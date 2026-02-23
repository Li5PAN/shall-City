// 菜单配置
export const userMenus = [
  {
    key: 'news',
    label: '资讯大厅',
    icon: 'ReadOutlined',
    path: '/user/news'
  },
  {
    key: 'articles',
    label: '文章管理',
    icon: 'FileTextOutlined',
    path: '/user/articles',
    children: [
      {
        key: 'article-list',
        label: '我的文章',
        path: '/user/articles'
      },
      {
        key: 'article-create',
        label: '发布文章',
        path: '/user/articles/create'
      },
      {
        key: 'article-draft',
        label: '草稿箱',
        path: '/user/articles/draft'
      }
    ]
  },
  {
    key: 'forum',
    label: '技术论坛',
    icon: 'MessageOutlined',
    path: '/user/forum',
    children: [
      {
        key: 'forum-home',
        label: '论坛首页',
        path: '/user/forum'
      },
      {
        key: 'forum-create',
        label: '发布帖子',
        path: '/user/forum/create'
      },
      {
        key: 'forum-my-posts',
        label: '我的帖子',
        path: '/user/forum/my-posts'
      },
      {
        key: 'forum-my-likes',
        label: '我的点赞',
        path: '/user/forum/my-likes'
      }
    ]
  },
  {
    key: 'services',
    label: '服务市场',
    icon: 'ShoppingOutlined',
    path: '/user/services'
  },
  {
    key: 'bounty',
    label: '需求悬赏',
    icon: 'TrophyOutlined',
    path: '/user/bounty',
    children: [
      {
        key: 'bounty-list',
        label: '悬赏列表',
        path: '/user/bounty'
      },
      {
        key: 'bounty-create',
        label: '发布悬赏',
        path: '/user/bounty/create'
      },
      {
        key: 'bounty-draft',
        label: '需求草稿',
        path: '/user/bounty/draft'
      }
    ]
  },
  {
    key: 'orders',
    label: '我的订单',
    icon: 'ShoppingCartOutlined',
    path: '/user/orders',
    children: [
      {
        key: 'order-list',
        label: '订单列表',
        path: '/user/orders'
      },
      {
        key: 'order-transactions',
        label: '交易记录',
        path: '/user/orders/transactions'
      }
    ]
  },
  {
    key: 'profile',
    label: '个人中心',
    icon: 'UserOutlined',
    path: '/user/profile',
    children: [
      {
        key: 'profile-info',
        label: '个人信息',
        path: '/user/profile'
      },
      {
        key: 'profile-security',
        label: '账号安全',
        path: '/user/profile/security'
      },
      {
        key: 'profile-role-apply',
        label: '角色申请',
        path: '/user/profile/role-apply'
      },
      {
        key: 'profile-favorites',
        label: '我的收藏',
        path: '/user/favorites'
      },
      {
        key: 'profile-following',
        label: '我的关注',
        path: '/user/following'
      },
      {
        key: 'profile-followers',
        label: '我的粉丝',
        path: '/user/followers'
      },
      {
        key: 'profile-messages',
        label: '消息中心',
        path: '/user/messages'
      },
      {
        key: 'profile-subscriptions',
        label: '我的订阅',
        path: '/user/profile/subscriptions'
      },
      {
        key: 'profile-privacy',
        label: '隐私设置',
        path: '/user/profile/privacy'
      },
      {
        key: 'profile-settings',
        label: '账户设置',
        path: '/user/settings'
      }
    ]
  }
]

export const providerMenus = [
  {
    key: 'dashboard',
    label: '数据看板',
    icon: 'DashboardOutlined',
    path: '/provider/dashboard'
  },
  {
    key: 'services',
    label: '服务管理',
    icon: 'AppstoreOutlined',
    path: '/provider/services',
    children: [
      {
        key: 'service-list',
        label: '我的服务',
        path: '/provider/services'
      },
      {
        key: 'service-create',
        label: '创建服务',
        path: '/provider/services/create'
      }
    ]
  },
  {
    key: 'orders',
    label: '订单管理',
    icon: 'OrderedListOutlined',
    path: '/provider/orders'
  },
  {
    key: 'transactions',
    label: '交易记录',
    icon: 'MoneyCollectOutlined',
    path: '/provider/transactions'
  }
]

export const adminMenus = [
  {
    key: 'dashboard',
    label: '管理后台',
    icon: 'DesktopOutlined',
    path: '/admin/dashboard'
  },
  {
    key: 'users',
    label: '用户管理',
    icon: 'TeamOutlined',
    path: '/admin/users',
    children: [
      {
        key: 'user-list',
        label: '用户列表',
        path: '/admin/users'
      },
      {
        key: 'role-manage',
        label: '角色管理',
        path: '/admin/roles'
      }
    ]
  },
  {
    key: 'content',
    label: '内容审核',
    icon: 'AuditOutlined',
    path: '/admin/articles/review',
    children: [
      {
        key: 'article-review',
        label: '文章审核',
        path: '/admin/articles/review'
      },
      {
        key: 'service-review',
        label: '服务审核',
        path: '/admin/services/review'
      },
      {
        key: 'bounty-review',
        label: '需求审核',
        path: '/admin/bounty/review'
      },
      {
        key: 'forum-manage',
        label: '论坛管理',
        path: '/admin/forum/manage'
      },
      {
        key: 'forum-sections',
        label: '板块管理',
        path: '/admin/forum/sections'
      }
    ]
  },
  {
    key: 'orders',
    label: '订单管理',
    icon: 'ReconciliationOutlined',
    path: '/admin/orders',
    children: [
      {
        key: 'order-list',
        label: '订单列表',
        path: '/admin/orders'
      },
      {
        key: 'appeal-handle',
        label: '申诉处理',
        path: '/admin/appeals'
      },
      {
        key: 'order-arbitration',
        label: '订单仲裁',
        path: '/admin/orders/arbitration'
      }
    ]
  },
  {
    key: 'system',
    label: '系统管理',
    icon: 'SettingOutlined',
    path: '/admin/statistics',
    children: [
      {
        key: 'statistics',
        label: '数据统计',
        path: '/admin/statistics'
      },
      {
        key: 'logs',
        label: '系统日志',
        path: '/admin/logs'
      },
      {
        key: 'announcements',
        label: '公告管理',
        path: '/admin/announcements'
      }
    ]
  }
]
