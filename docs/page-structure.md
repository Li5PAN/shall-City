# IT服务平台页面结构设计

## 1. 页面层次结构

### 1.1 布局组件 (Layouts)

```
src/layouts/
├── UserLayout.vue          # 普通用户布局
├── ProviderLayout.vue      # 服务提供方布局
├── AdminLayout.vue         # 管理员布局
└── GuestLayout.vue         # 访客布局（登录/注册）
```

### 1.2 页面组件结构

```
src/pages/
├── Home.vue                # 首页
├── auth/                   # 认证相关
│   ├── Login.vue          # 登录页
│   └── Register.vue       # 注册页
├── user/                   # 普通用户页面
│   ├── news/              # 资讯模块
│   │   ├── NewsList.vue   # 资讯列表
│   │   └── NewsDetail.vue # 资讯详情
│   ├── articles/          # 文章模块
│   │   ├── ArticleList.vue    # 文章列表
│   │   ├── CreateArticle.vue  # 发布文章
│   │   ├── EditArticle.vue    # 编辑文章
│   │   └── DraftList.vue      # 草稿箱
│   ├── forum/             # 论坛模块
│   │   ├── ForumHome.vue      # 论坛首页
│   │   ├── ForumCategory.vue  # 论坛分类
│   │   ├── PostDetail.vue     # 帖子详情
│   │   └── CreatePost.vue     # 发布帖子
│   ├── services/          # 服务模块
│   │   ├── ServiceList.vue    # 服务列表
│   │   └── ServiceDetail.vue  # 服务详情
│   ├── bounty/            # 悬赏模块
│   │   ├── BountyList.vue     # 悬赏列表
│   │   ├── CreateBounty.vue   # 发布悬赏
│   │   └── BountyDetail.vue   # 悬赏详情
│   ├── orders/            # 订单模块
│   │   ├── OrderList.vue      # 订单列表
│   │   └── OrderDetail.vue    # 订单详情
│   └── profile/           # 个人中心
│       ├── Profile.vue        # 个人信息
│       ├── Favorites.vue      # 我的收藏
│       ├── Following.vue      # 我的关注
│       ├── Followers.vue      # 我的粉丝
│       ├── Messages.vue       # 消息中心
│       └── Settings.vue       # 账户设置
├── provider/              # 服务提供方页面
│   ├── Dashboard.vue          # 服务商后台
│   ├── services/              # 服务管理
│   │   ├── ServiceManage.vue  # 服务管理
│   │   ├── CreateService.vue  # 创建服务
│   │   └── EditService.vue    # 编辑服务
│   ├── orders/                # 订单管理
│   │   ├── OrderManage.vue    # 订单管理
│   │   └── OrderDetail.vue    # 订单详情
│   └── Transactions.vue       # 交易记录
├── admin/                 # 管理员页面
│   ├── Dashboard.vue          # 管理后台首页
│   ├── users/                 # 用户管理
│   │   ├── UserManage.vue     # 用户管理
│   │   ├── UserDetail.vue     # 用户详情
│   │   └── RoleManage.vue     # 角色管理
│   ├── content/               # 内容管理
│   │   ├── ArticleReview.vue  # 文章审核
│   │   ├── ServiceReview.vue  # 服务审核
│   │   └── ForumManage.vue    # 论坛管理
│   ├── orders/                # 订单管理
│   │   ├── OrderManage.vue    # 订单管理
│   │   └── AppealHandle.vue   # 申诉处理
│   ├── Statistics.vue         # 数据统计
│   ├── Logs.vue              # 系统日志
│   └── Announcements.vue     # 公告管理
└── error/                 # 错误页面
    ├── 404.vue           # 404页面
    └── 403.vue           # 403页面
```

## 2. 核心页面设计规范

### 2.1 首页 (Home.vue)

**功能模块**:
- 顶部导航栏
- 轮播图/Banner
- 热门服务推荐
- 最新资讯
- 平台统计数据
- 底部信息

**组件结构**:
```vue
<template>
  <div class="home-page">
    <AppHeader />
    <HeroBanner />
    <ServiceRecommend />
    <NewsSection />
    <PlatformStats />
    <AppFooter />
  </div>
</template>
```

### 2.2 用户布局 (UserLayout.vue)

**功能模块**:
- 顶部导航栏（用户信息、消息通知）
- 侧边导航菜单
- 主内容区域
- 面包屑导航

**组件结构**:
```vue
<template>
  <div class="user-layout">
    <UserHeader />
    <div class="layout-content">
      <UserSidebar />
      <main class="main-content">
        <Breadcrumb />
        <router-view />
      </main>
    </div>
  </div>
</template>
```

### 2.3 服务列表页 (ServiceList.vue)

**功能模块**:
- 搜索筛选器
- 服务分类标签
- 服务卡片列表
- 分页组件
- 排序选项

**组件结构**:
```vue
<template>
  <div class="service-list">
    <SearchFilter />
    <CategoryTabs />
    <SortOptions />
    <ServiceGrid />
    <Pagination />
  </div>
</template>
```

### 2.4 订单管理页 (OrderManage.vue)

**功能模块**:
- 订单状态筛选
- 订单列表表格
- 批量操作
- 订单详情弹窗
- 导出功能

**组件结构**:
```vue
<template>
  <div class="order-manage">
    <OrderFilter />
    <OrderTable />
    <BatchActions />
    <OrderDetailModal />
    <ExportDialog />
  </div>
</template>
```

## 3. 组件设计规范

### 3.1 公共组件

```
src/components/
├── common/                # 通用组件
│   ├── AppHeader.vue     # 应用头部
│   ├── AppFooter.vue     # 应用底部
│   ├── Breadcrumb.vue    # 面包屑
│   ├── Pagination.vue    # 分页组件
│   ├── SearchBox.vue     # 搜索框
│   ├── LoadingSpinner.vue # 加载动画
│   └── EmptyState.vue    # 空状态
├── layout/               # 布局组件
│   ├── UserHeader.vue    # 用户头部
│   ├── UserSidebar.vue   # 用户侧边栏
│   ├── AdminSidebar.vue  # 管理员侧边栏
│   └── ProviderSidebar.vue # 服务商侧边栏
└── business/             # 业务组件
    ├── ArticleCard.vue   # 文章卡片
    ├── ServiceCard.vue   # 服务卡片
    ├── OrderCard.vue     # 订单卡片
    ├── UserAvatar.vue    # 用户头像
    ├── RichEditor.vue    # 富文本编辑器
    ├── ImageUpload.vue   # 图片上传
    ├── CommentList.vue   # 评论列表
    └── NotificationBell.vue # 消息通知
```

### 3.2 组件命名规范

- **页面组件**: PascalCase，描述性命名 (UserProfile.vue)
- **布局组件**: PascalCase + Layout后缀 (UserLayout.vue)
- **业务组件**: PascalCase，功能描述 (ArticleCard.vue)
- **通用组件**: PascalCase，通用性描述 (LoadingSpinner.vue)

### 3.3 组件props设计

```javascript
// 示例：服务卡片组件
defineProps({
  service: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.id && value.title && value.price
    }
  },
  showActions: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})
```

## 4. 状态管理设计

### 4.1 Store模块划分

```
src/stores/
├── index.js              # Store入口
├── auth.js              # 认证状态
├── user.js              # 用户信息
├── article.js           # 文章数据
├── service.js           # 服务数据
├── order.js             # 订单数据
├── forum.js             # 论坛数据
├── notification.js      # 消息通知
└── app.js               # 应用全局状态
```

### 4.2 状态设计示例

```javascript
// stores/service.js
export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    categories: [],
    currentService: null,
    loading: false,
    filters: {
      category: '',
      priceRange: [0, 10000],
      sortBy: 'created_at'
    }
  }),
  
  getters: {
    filteredServices: (state) => {
      // 筛选逻辑
    },
    servicesByCategory: (state) => {
      // 分类逻辑
    }
  },
  
  actions: {
    async fetchServices() {
      // 获取服务列表
    },
    async createService(serviceData) {
      // 创建服务
    },
    updateFilters(filters) {
      // 更新筛选条件
    }
  }
})
```

## 5. 响应式设计

### 5.1 断点设计

```scss
// 响应式断点
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px
);
```

### 5.2 布局适配

- **移动端** (< 768px): 单列布局，侧边栏折叠
- **平板端** (768px - 992px): 两列布局，部分功能简化
- **桌面端** (> 992px): 多列布局，完整功能展示

## 6. 性能优化

### 6.1 路由懒加载

所有页面组件采用动态导入，实现按需加载：

```javascript
component: () => import('@/pages/user/services/ServiceList.vue')
```

### 6.2 组件懒加载

大型组件使用异步组件：

```javascript
const RichEditor = defineAsyncComponent(() => 
  import('@/components/business/RichEditor.vue')
)
```

### 6.3 图片优化

- 使用WebP格式
- 实现图片懒加载
- 提供多尺寸适配

这份页面结构设计文档为IT服务平台的前端开发提供了完整的架构指导，确保项目的可维护性和扩展性。