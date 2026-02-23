import { createRouter , createWebHistory } from "vue-router";

const files = import.meta.glob("./modules/*.js",{
    eager:true,
});

//路由暂存
const routerModuleList = [];

// 遍历路由模块
Object.keys(files).forEach((key) => {
  const module = files[key].default || {};
  const moduleList = Array.isArray(module) ? [...module] : [module];
  routerModuleList.push(...moduleList);
});

// 存放动态路由（从modules加载的路由）
const asyncRouterList = [...routerModuleList];

// 存放固定路由
const defaultRouterList = [
  // 根路径重定向到首页
  {
    path: "/",
    redirect: "/home",
  },
  // 兼容旧的 /user/* 路径，重定向到 /home/*
  {
    path: "/user/:pathMatch(.*)*",
    redirect: to => {
      const rest = Array.isArray(to.params.pathMatch) ? to.params.pathMatch.join('/') : (to.params.pathMatch || '')
      return `/home/${rest}`
    },
  },
  // 404路由（放在最后）
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '页面未找到' }
  },
];

// 合并所有路由
const routes = [...defaultRouterList, ...asyncRouterList];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

// 根据角色获取对应首页路径
function getHomeRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/home'
  }
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 1. 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - IT服务平台` : 'IT服务平台'
  
  // 2. 获取认证状态
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  const userInfo = isAuthenticated ? JSON.parse(localStorage.getItem('userInfo') || '{}') : {}
  const userRole = userInfo.role || 'user'
  
  // 3. 已登录用户访问guest页面 → 重定向到对应首页
  if (to.meta.guest && isAuthenticated) {
    next(getHomeRoute(userRole))
    return
  }
  
  // 4. 需要认证但未登录 → 重定向到登录页（携带redirect参数）
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  // 5. 角色权限检查 → 无权限重定向到403
  if (to.meta.role && isAuthenticated) {
    const requiredRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    if (!requiredRoles.includes(userRole)) {
      next('/403')
      return
    }
  }
  
  next()
})

export default router;
