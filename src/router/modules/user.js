// 普通用户路由模块
export default {
  path: '/user',
  component: () => import('@/layouts/UserLayout.vue'),
  meta: { 
    requiresAuth: true, 
    role: ['user', 'provider'] 
  },
  children: [
    // 资讯大厅
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

    // 论坛模块
    {
      path: 'forum',
      name: 'Forum',
      component: () => import('@/pages/user/forum/ForumHome.vue'),
      meta: { title: '技术论坛' }
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
    {
      path: 'forum/create',
      name: 'CreatePost',
      component: () => import('@/pages/user/forum/CreatePost.vue'),
      meta: { title: '发布帖子' }
    },

    // 服务相关
    {
      path: 'services',
      name: 'UserServices',
      component: () => import('@/pages/user/services/ServiceList.vue'),
      meta: { title: '服务市场' }
    },
    {
      path: 'services/:id',
      name: 'ServiceDetail',
      component: () => import('@/pages/user/services/ServiceDetail.vue'),
      meta: { title: '服务详情' }
    },

    // 需求悬赏
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
      path: 'bounty/:id',
      name: 'BountyDetail',
      component: () => import('@/pages/user/bounty/BountyDetail.vue'),
      meta: { title: '悬赏详情' }
    },

    // 订单管理
    {
      path: 'orders',
      name: 'UserOrders',
      component: () => import('@/pages/user/orders/OrderList.vue'),
      meta: { title: '我的订单' }
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