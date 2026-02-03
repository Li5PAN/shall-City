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

// 存放固定路由（登录、注册等无需鉴权的路由）
const defaultRouterList = [
  // 根路径重定向到登录页面
  {
    path: "/",
    redirect: "/login",
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

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - IT服务平台` : 'IT服务平台'
  
  // 检查是否需要认证
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  
  // 如果用户已登录且访问根路径，重定向到对应的首页
  if (to.path === '/login' && isAuthenticated) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const userRole = userInfo.role
    
    switch (userRole) {
      case 'admin':
        next('/admin/statistics')
        return
      case 'provider':
        next('/provider/dashboard')
        return
      default:
        next('/user/news')
        return
    }
  }
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // 检查访客页面（已登录用户不能访问）
  if (to.meta.guest && isAuthenticated) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const userRole = userInfo.role
    
    switch (userRole) {
      case 'admin':
        next('/admin/statistics')
        return
      case 'provider':
        next('/provider/dashboard')
        return
      default:
        next('/user/news')
        return
    }
  }
  
  // 检查角色权限
  if (to.meta.role && isAuthenticated) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const userRole = userInfo.role
    const requiredRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    
    if (userRole && !requiredRoles.includes(userRole)) {
      next('/403')
      return
    }
  }
  
  next()
})

export default router;