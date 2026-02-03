# IT服务平台前端开发文档

## 1. 项目概述

基于Vue 3 + Vite的IT服务平台前端系统，采用前后端分离架构，支持普通用户、服务提供方、管理员三种角色的业务流程。

## 2. 技术栈

- **框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI组件库**: Element Plus / Ant Design Vue
- **HTTP客户端**: Axios
- **样式**: SCSS/Less
- **代码规范**: ESLint + Prettier

## 3. 项目结构

```
src/
├── api/                    # API接口
│   ├── auth.js            # 认证相关
│   ├── user.js            # 用户相关
│   ├── article.js         # 文章相关
│   ├── service.js         # 服务相关
│   ├── order.js           # 订单相关
│   └── admin.js           # 管理员相关
├── assets/                # 静态资源
│   ├── images/
│   ├── icons/
│   └── styles/
├── components/            # 公共组件
│   ├── common/           # 通用组件
│   ├── layout/           # 布局组件
│   └── business/         # 业务组件
├── composables/          # 组合式函数
├── config/               # 配置文件
├── directives/           # 自定义指令
├── hooks/                # 自定义hooks
├── layouts/              # 布局模板
├── pages/                # 页面组件
├── router/               # 路由配置
├── stores/               # 状态管理
├── utils/                # 工具函数
└── main.js               # 入口文件
```

## 4. 页面设计与路由规划

### 4.1 公共页面
- `/` - 首页
- `/login` - 登录页
- `/register` - 注册页
- `/404` - 404页面

### 4.2 普通用户模块 (`/user`)

#### 资讯大厅
- `/user/news` - 资讯列表页
- `/user/news/:id` - 资讯详情页

#### 文章管理
- `/user/articles` - 我的文章列表
- `/user/articles/create` - 发布文章
- `/user/articles/edit/:id` - 编辑文章
- `/user/articles/draft` - 草稿箱

#### 论坛模块
- `/user/forum` - 论坛首页
- `/user/forum/:category` - 论坛分类页
- `/user/forum/post/:id` - 帖子详情页
- `/user/forum/create` - 发布帖子

#### 服务相关
- `/user/services` - 服务市场
- `/user/services/:id` - 服务详情页
- `/user/bounty` - 需求悬赏
- `/user/bounty/create` - 发布悬赏
- `/user/bounty/:id` - 悬赏详情

#### 订单管理
- `/user/orders` - 我的订单
- `/user/orders/:id` - 订单详情

#### 个人中心
- `/user/profile` - 个人信息
- `/user/favorites` - 我的收藏
- `/user/following` - 我的关注
- `/user/followers` - 我的粉丝
- `/user/messages` - 消息中心
- `/user/settings` - 账户设置

### 4.3 服务提供方模块 (`/provider`)

#### 服务管理
- `/provider/services` - 我的服务
- `/provider/services/create` - 创建服务
- `/provider/services/edit/:id` - 编辑服务

#### 订单管理
- `/provider/orders` - 订单管理
- `/provider/orders/:id` - 订单详情

#### 数据统计
- `/provider/dashboard` - 数据看板
- `/provider/transactions` - 交易记录

### 4.4 管理员模块 (`/admin`)

#### 用户管理
- `/admin/users` - 用户列表
- `/admin/users/:id` - 用户详情
- `/admin/roles` - 角色权限管理

#### 内容审核
- `/admin/articles/review` - 文章审核
- `/admin/services/review` - 服务审核
- `/admin/forum/manage` - 论坛管理

#### 订单管理
- `/admin/orders` - 订单管理
- `/admin/appeals` - 申诉处理

#### 系统管理
- `/admin/dashboard` - 管理后台首页
- `/admin/statistics` - 数据统计
- `/admin/logs` - 系统日志
- `/admin/announcements` - 公告管理

## 5. 核心页面设计

### 5.1 首页 (Home)
**功能**: 平台介绍、热门服务、最新资讯
**组件**:
- Header导航
- Banner轮播
- 服务推荐卡片
- 资讯列表
- Footer

### 5.2 资讯大厅 (News)
**功能**: 分页浏览、分类筛选、搜索
**组件**:
- 搜索栏
- 分类标签
- 文章卡片列表
- 分页组件
- 侧边栏推荐

### 5.3 服务市场 (Services)
**功能**: 服务浏览、筛选、购买
**组件**:
- 筛选器
- 服务卡片
- 价格排序
- 服务详情模态框

### 5.4 需求悬赏 (Bounty)
**功能**: 发布需求、浏览悬赏、接单
**组件**:
- 需求发布表单
- 悬赏列表
- 需求详情
- 接单操作

### 5.5 个人中心 (Profile)
**功能**: 信息管理、订单查看、消息通知
**组件**:
- 侧边导航
- 信息编辑表单
- 订单状态卡片
- 消息列表

## 6. 路由配置示例

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue')
  },
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'user' },
    children: [
      {
        path: 'news',
        name: 'UserNews',
        component: () => import('@/pages/user/News.vue')
      },
      {
        path: 'services',
        name: 'UserServices',
        component: () => import('@/pages/user/Services.vue')
      },
      // ... 其他用户路由
    ]
  },
  {
    path: '/provider',
    component: () => import('@/layouts/ProviderLayout.vue'),
    meta: { requiresAuth: true, role: 'provider' },
    children: [
      {
        path: 'dashboard',
        name: 'ProviderDashboard',
        component: () => import('@/pages/provider/Dashboard.vue')
      },
      // ... 其他服务商路由
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/Dashboard.vue')
      },
      // ... 其他管理员路由
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

## 7. 状态管理设计

### 7.1 Store模块划分
- `auth` - 认证状态
- `user` - 用户信息
- `article` - 文章数据
- `service` - 服务数据
- `order` - 订单数据
- `notification` - 消息通知

### 7.2 认证Store示例
```javascript
// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(credentials) {
      // 登录逻辑
    },
    
    async logout() {
      // 登出逻辑
    },
    
    async fetchUserInfo() {
      // 获取用户信息
    }
  }
})
```

## 8. 组件设计规范

### 8.1 组件命名
- 页面组件: PascalCase (UserProfile.vue)
- 公共组件: PascalCase + 前缀 (BaseButton.vue)
- 业务组件: 功能描述 (ArticleCard.vue)

### 8.2 组件结构
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
// 组合式API逻辑
</script>

<style scoped lang="scss">
/* 样式 */
</style>
```

## 9. API接口设计

### 9.1 接口规范
- 基础URL: `/api/v1`
- 认证方式: Bearer Token
- 响应格式: JSON

### 9.2 接口示例
```javascript
// api/user.js
import request from '@/utils/request'

export const getUserProfile = () => {
  return request.get('/user/profile')
}

export const updateUserProfile = (data) => {
  return request.put('/user/profile', data)
}
```

## 10. 开发规范

### 10.1 代码规范
- 使用ESLint + Prettier
- 组件props定义类型
- 合理使用组合式函数
- 统一错误处理

### 10.2 Git提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构代码

## 11. 部署配置

### 11.1 环境变量
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=IT服务平台

# .env.production
VITE_API_BASE_URL=https://api.example.com/v1
VITE_APP_TITLE=IT服务平台
```

### 11.2 构建配置
```javascript
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

这份文档涵盖了IT服务平台前端开发的核心内容，包括页面设计、路由规划、组件架构等，为开发团队提供了清晰的技术指导。