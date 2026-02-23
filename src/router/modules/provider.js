// 服务提供方路由模块
export default {
  path: '/provider',
  component: () => import('@/layouts/ProviderLayout.vue'),
  meta: { 
    requiresAuth: true, 
    role: ['provider'] 
  },
  children: [
    {
      path: 'dashboard',
      name: 'ProviderDashboard',
      component: () => import('@/pages/provider/Dashboard.vue'),
      meta: { title: '服务商后台' }
    },
    
    // 服务管理
    {
      path: 'services',
      name: 'ProviderServices',
      component: () => import('@/pages/provider/services/ServiceManage.vue'),
      meta: { title: '我的服务' }
    },
    {
      path: 'services/create',
      name: 'CreateService',
      component: () => import('@/pages/provider/services/CreateService.vue'),
      meta: { title: '创建服务' }
    },
    {
      path: 'services/edit/:id',
      name: 'EditService',
      component: () => import('@/pages/provider/services/EditService.vue'),
      meta: { title: '编辑服务' }
    },
    {
      path: 'services/audit-result/:id',
      name: 'ServiceAuditResult',
      component: () => import('@/pages/provider/services/ServiceAuditResult.vue'),
      meta: { title: '服务审核结果' }
    },
    
    // 订单管理
    {
      path: 'orders',
      name: 'ProviderOrders',
      component: () => import('@/pages/provider/orders/OrderManage.vue'),
      meta: { title: '订单管理' }
    },
    {
      path: 'orders/delivery/:id',
      name: 'OrderDelivery',
      component: () => import('@/pages/provider/orders/OrderDelivery.vue'),
      meta: { title: '订单交付' }
    },
    {
      path: 'orders/:id',
      name: 'ProviderOrderDetail',
      component: () => import('@/pages/provider/orders/OrderDetail.vue'),
      meta: { title: '订单详情' }
    },
    
    // 交易记录
    {
      path: 'transactions',
      name: 'ProviderTransactions',
      component: () => import('@/pages/provider/Transactions.vue'),
      meta: { title: '交易记录' }
    }
  ]
}
