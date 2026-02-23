// 普通用户路由模块 — 所有子页面挂在 Home.vue 下，共享首页侧边栏
export default {
  path: '/home',
  component: () => import('@/pages/Home.vue'),
  meta: {
    requiresAuth: true,
    title: 'IT服务平台首页'
  },
  children: [
    // 首页默认内容
    {
      path: '',
      name: 'Home',
      component: () => import('@/pages/HomeContent.vue'),
      meta: { title: 'IT服务平台首页' }
    },

    // 资讯
    {
      path: 'news',
      name: 'UserNews',
      component: () => import('@/pages/user/news/NewsList.vue'),
      meta: { title: '资讯大厅' }
    },
    {
      path: 'news/:id',
      name: 'NewsDetail',
      component: () => import('@/pages/user/news/NewsDetail.vue'),
      meta: { title: '资讯详情' }
    },

    // 文章管理
    {
      path: 'articles',
      name: 'UserArticles',
      component: () => import('@/pages/user/articles/ArticleList.vue'),
      meta: { title: '我的文章' }
    },
    {
      path: 'articles/create',
      name: 'CreateArticle',
      component: () => import('@/pages/user/articles/CreateArticle.vue'),
      meta: { title: '发布文章' }
    },
    {
      path: 'articles/edit/:id',
      name: 'EditArticle',
      component: () => import('@/pages/user/articles/EditArticle.vue'),
      meta: { title: '编辑文章' }
    },
    {
      path: 'articles/draft',
      name: 'DraftArticles',
      component: () => import('@/pages/user/articles/DraftList.vue'),
      meta: { title: '草稿箱' }
    },

    // 论坛
    {
      path: 'forum',
      name: 'Forum',
      component: () => import('@/pages/user/forum/ForumHome.vue'),
      meta: { title: '技术论坛' }
    },
    {
      path: 'forum/create',
      name: 'CreatePost',
      component: () => import('@/pages/user/forum/CreatePost.vue'),
      meta: { title: '发布帖子' }
    },
    {
      path: 'forum/my-posts',
      name: 'MyPosts',
      component: () => import('@/pages/user/forum/MyPosts.vue'),
      meta: { title: '我的帖子' }
    },
    {
      path: 'forum/my-likes',
      name: 'MyLikes',
      component: () => import('@/pages/user/forum/MyLikes.vue'),
      meta: { title: '我的点赞' }
    },
    {
      path: 'forum/:category',
      name: 'ForumCategory',
      component: () => import('@/pages/user/forum/ForumCategory.vue'),
      meta: { title: '论坛分类' }
    },
    {
      path: 'forum/post/:id',
      name: 'PostDetail',
      component: () => import('@/pages/user/forum/PostDetail.vue'),
      meta: { title: '帖子详情' }
    },

    // 服务
    {
      path: 'services',
      name: 'UserServices',
      component: () => import('@/pages/user/services/ServiceList.vue'),
      meta: { title: '服务市场' }
    },
    {
      path: 'services/purchase/:id',
      name: 'ServicePurchase',
      component: () => import('@/pages/user/services/ServicePurchase.vue'),
      meta: { title: '购买服务' }
    },
    {
      path: 'services/:id',
      name: 'ServiceDetail',
      component: () => import('@/pages/user/services/ServiceDetail.vue'),
      meta: { title: '服务详情' }
    },

    // 悬赏
    {
      path: 'bounty',
      name: 'BountyList',
      component: () => import('@/pages/user/bounty/BountyList.vue'),
      meta: { title: '需求悬赏' }
    },
    {
      path: 'bounty/create',
      name: 'CreateBounty',
      component: () => import('@/pages/user/bounty/CreateBounty.vue'),
      meta: { title: '发布悬赏' }
    },
    {
      path: 'bounty/draft',
      name: 'BountyDraft',
      component: () => import('@/pages/user/bounty/BountyDraft.vue'),
      meta: { title: '需求草稿' }
    },
    {
      path: 'bounty/audit-result/:id',
      name: 'BountyAuditResult',
      component: () => import('@/pages/user/bounty/BountyAuditResult.vue'),
      meta: { title: '需求审核结果' }
    },
    {
      path: 'bounty/:id',
      name: 'BountyDetail',
      component: () => import('@/pages/user/bounty/BountyDetail.vue'),
      meta: { title: '悬赏详情' }
    },

    // 订单
    {
      path: 'orders',
      name: 'UserOrders',
      component: () => import('@/pages/user/orders/OrderList.vue'),
      meta: { title: '我的订单' }
    },
    {
      path: 'orders/transactions',
      name: 'UserTransactions',
      component: () => import('@/pages/user/orders/TransactionHistory.vue'),
      meta: { title: '交易记录' }
    },
    {
      path: 'orders/acceptance/:id',
      name: 'OrderAcceptance',
      component: () => import('@/pages/user/orders/OrderAcceptance.vue'),
      meta: { title: '订单验收' }
    },
    {
      path: 'orders/appeal/:id',
      name: 'OrderAppeal',
      component: () => import('@/pages/user/orders/OrderAppeal.vue'),
      meta: { title: '订单申诉' }
    },
    {
      path: 'orders/:id',
      name: 'OrderDetail',
      component: () => import('@/pages/user/orders/OrderDetail.vue'),
      meta: { title: '订单详情' }
    },

    // 个人中心
    {
      path: 'profile',
      name: 'UserProfile',
      component: () => import('@/pages/user/profile/Profile.vue'),
      meta: { title: '个人信息' }
    },
    {
      path: 'profile/security',
      name: 'AccountSecurity',
      component: () => import('@/pages/user/profile/AccountSecurity.vue'),
      meta: { title: '账号安全' }
    },
    {
      path: 'profile/role-apply',
      name: 'RoleApplication',
      component: () => import('@/pages/user/profile/RoleApplication.vue'),
      meta: { title: '角色申请' }
    },
    {
      path: 'profile/subscriptions',
      name: 'Subscriptions',
      component: () => import('@/pages/user/profile/Subscriptions.vue'),
      meta: { title: '我的订阅' }
    },
    {
      path: 'profile/privacy',
      name: 'PrivacySettings',
      component: () => import('@/pages/user/profile/PrivacySettings.vue'),
      meta: { title: '隐私设置' }
    },
    {
      path: 'favorites',
      name: 'UserFavorites',
      component: () => import('@/pages/user/profile/Favorites.vue'),
      meta: { title: '我的收藏' }
    },
    {
      path: 'following',
      name: 'UserFollowing',
      component: () => import('@/pages/user/profile/Following.vue'),
      meta: { title: '我的关注' }
    },
    {
      path: 'followers',
      name: 'UserFollowers',
      component: () => import('@/pages/user/profile/Followers.vue'),
      meta: { title: '我的粉丝' }
    },
    {
      path: 'messages',
      name: 'UserMessages',
      component: () => import('@/pages/user/profile/Messages.vue'),
      meta: { title: '消息中心' }
    },
    {
      path: 'settings',
      name: 'UserSettings',
      component: () => import('@/pages/user/profile/Settings.vue'),
      meta: { title: '账户设置' }
    }
  ]
}
