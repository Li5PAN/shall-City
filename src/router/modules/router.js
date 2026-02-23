// 公共路由模块
export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { 
      title: '登录',
      guest: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/auth/Register.vue'),
    meta: { 
      title: '注册',
      guest: true 
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/pages/error/403.vue'),
    meta: { 
      title: '权限不足' 
    }
  }
]