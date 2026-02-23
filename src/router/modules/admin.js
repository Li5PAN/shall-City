// 管理员路由模块
export default {
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  meta: { 
    requiresAuth: true, 
    role: ['admin'] 
  },
  children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('@/pages/admin/Dashboard.vue'),
      meta: { title: '管理后台' }
    },
    
    // 用户管理
    {
      path: 'users',
      name: 'AdminUsers',
      component: () => import('@/pages/admin/users/UserManage.vue'),
      meta: { title: '用户管理' }
    },
    {
      path: 'users/:id',
      name: 'AdminUserDetail',
      component: () => import('@/pages/admin/users/UserDetail.vue'),
      meta: { title: '用户详情' }
    },
    {
      path: 'roles',
      name: 'AdminRoles',
      component: () => import('@/pages/admin/users/RoleManage.vue'),
      meta: { title: '角色权限管理' }
    },
    
    // 内容审核
    {
      path: 'articles/review',
      name: 'ArticleReview',
      component: () => import('@/pages/admin/content/ArticleReview.vue'),
      meta: { title: '文章审核' }
    },
    {
      path: 'services/review',
      name: 'ServiceReview',
      component: () => import('@/pages/admin/content/ServiceReview.vue'),
      meta: { title: '服务审核' }
    },
    {
      path: 'bounty/review',
      name: 'BountyReview',
      component: () => import('@/pages/admin/content/BountyReview.vue'),
      meta: { title: '需求审核' }
    },
    {
      path: 'forum/manage',
      name: 'ForumManage',
      component: () => import('@/pages/admin/content/ForumManage.vue'),
      meta: { title: '论坛管理' }
    },
    {
      path: 'forum/sections',
      name: 'ForumSectionManage',
      component: () => import('@/pages/admin/content/ForumSectionManage.vue'),
      meta: { title: '板块管理' }
    },
    
    // 订单管理
    {
      path: 'orders',
      name: 'AdminOrders',
      component: () => import('@/pages/admin/orders/OrderManage.vue'),
      meta: { title: '订单管理' }
    },
    {
      path: 'appeals',
      name: 'AdminAppeals',
      component: () => import('@/pages/admin/orders/AppealHandle.vue'),
      meta: { title: '申诉处理' }
    },
    {
      path: 'orders/arbitration/:id',
      name: 'OrderArbitration',
      component: () => import('@/pages/admin/orders/OrderArbitration.vue'),
      meta: { title: '订单仲裁' }
    },
    
    // 系统管理
    {
      path: 'statistics',
      name: 'AdminStatistics',
      component: () => import('@/pages/admin/Statistics.vue'),
      meta: { title: '数据统计' }
    },
    {
      path: 'logs',
      name: 'AdminLogs',
      component: () => import('@/pages/admin/Logs.vue'),
      meta: { title: '系统日志' }
    },
    {
      path: 'announcements',
      name: 'AdminAnnouncements',
      component: () => import('@/pages/admin/Announcements.vue'),
      meta: { title: '公告管理' }
    }
  ]
}
