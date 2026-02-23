<template>
  <a-layout class="user-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <img src="/logo.svg" alt="IT服务平台" />
            <span>IT服务平台</span>
          </router-link>
        </div>
        
        <a-menu 
          mode="horizontal" 
          :selected-keys="[]"
          class="header-nav"
        >
          <a-menu-item key="home">
            <router-link to="/">首页</router-link>
          </a-menu-item>
          <a-menu-item key="news">
            <router-link to="/user/news">资讯</router-link>
          </a-menu-item>
          <a-menu-item key="services">
            <router-link to="/user/services">服务</router-link>
          </a-menu-item>
          <a-menu-item key="forum">
            <router-link to="/user/forum">论坛</router-link>
          </a-menu-item>
        </a-menu>
        
        <div class="header-actions">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索服务、文章..."
            style="width: 200px"
            @search="handleSearch"
          />
          
          <a-badge :count="unreadCount" :offset="[10, 0]">
            <a-button type="text" @click="showNotifications = !showNotifications">
              <template #icon>
                <BellOutlined />
              </template>
            </a-button>
          </a-badge>
          
          <a-dropdown>
            <a-button type="text" class="user-info">
              <a-avatar :src="userInfo.avatar" :size="32" />
              <span style="margin-left: 8px">{{ userInfo.username }}</span>
              <DownOutlined style="margin-left: 4px" />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile">
                  <router-link to="/user/profile">
                    <UserOutlined />
                    个人中心
                  </router-link>
                </a-menu-item>
                <a-menu-item key="settings">
                  <router-link to="/user/settings">
                    <SettingOutlined />
                    账户设置
                  </router-link>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    
    <!-- 主体内容 -->
    <a-layout class="layout-body">
      <!-- 侧边导航 -->
      <a-layout-sider 
        width="240" 
        theme="light"
        class="layout-sidebar"
      >
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </a-layout-sider>
      
      <!-- 主内容区 -->
      <a-layout-content class="layout-main">
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.title">
            <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
            <span v-else>{{ item.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        
        <div class="main-content">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userMenus } from '@/config/menu'
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ReadOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 图标映射
const iconMap = {
  ReadOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  ShoppingCartOutlined,
  UserOutlined
}

// 响应式数据
const searchKeyword = ref('')
const showNotifications = ref(false)
const unreadCount = ref(5)
const selectedKeys = ref([])
const openKeys = ref(['articles', 'bounty', 'forum', 'orders', 'profile'])

// 用户信息（模拟数据）
const userInfo = ref({
  id: 1001,
  username: '张三',
  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  role: 'user'
})

// 转换菜单数据为Ant Design格式
const menuItems = computed(() => {
  const convertMenu = (menus) => {
    return menus.map(menu => {
      const item = {
        key: menu.key,
        label: menu.label,
        icon: menu.icon ? h(iconMap[menu.icon]) : null
      }
      
      if (menu.children && menu.children.length > 0) {
        item.children = menu.children.map(child => ({
          key: child.key,
          label: child.label
        }))
      }
      
      return item
    })
  }
  
  return convertMenu(userMenus)
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const crumbs = [{ title: '首页', path: '/' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    
    // 根据路径生成面包屑
    if (path === 'user') {
      crumbs.push({ title: '用户中心', path: currentPath })
    } else if (path === 'news') {
      crumbs.push({ title: '资讯大厅', path: currentPath })
    } else if (path === 'articles') {
      crumbs.push({ title: '文章管理', path: currentPath })
    } else if (path === 'forum') {
      crumbs.push({ title: '技术论坛', path: currentPath })
    } else if (path === 'services') {
      crumbs.push({ title: '服务市场', path: currentPath })
    } else if (path === 'bounty') {
      crumbs.push({ title: '需求悬赏', path: currentPath })
    } else if (path === 'orders') {
      crumbs.push({ title: '我的订单', path: currentPath })
    } else if (path === 'profile') {
      crumbs.push({ title: '个人中心', path: currentPath })
    } else if (path === 'create') {
      crumbs.push({ title: '创建', path: null })
    } else if (path === 'edit') {
      crumbs.push({ title: '编辑', path: null })
    } else if (path === 'draft') {
      crumbs.push({ title: '草稿', path: null })
    } else if (path === 'my-posts') {
      crumbs.push({ title: '我的帖子', path: null })
    } else if (path === 'my-likes') {
      crumbs.push({ title: '我的点赞', path: null })
    } else if (path === 'transactions') {
      crumbs.push({ title: '交易记录', path: null })
    } else if (path === 'security') {
      crumbs.push({ title: '账号安全', path: null })
    } else if (path === 'role-apply') {
      crumbs.push({ title: '角色申请', path: null })
    } else if (path === 'subscriptions') {
      crumbs.push({ title: '我的订阅', path: null })
    } else if (path === 'privacy') {
      crumbs.push({ title: '隐私设置', path: null })
    } else if (path === 'audit-result') {
      crumbs.push({ title: '审核结果', path: null })
    }
  })
  
  return crumbs
})

// 方法
const handleMenuClick = ({ key }) => {
  // 查找对应的路径
  const findPath = (menus, targetKey) => {
    for (const menu of menus) {
      if (menu.key === targetKey) {
        return menu.path
      }
      if (menu.children) {
        for (const child of menu.children) {
          if (child.key === targetKey) {
            return child.path
          }
        }
      }
    }
    return null
  }
  
  const path = findPath(userMenus, key)
  if (path) {
    router.push(path)
  }
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchKeyword.value)}`)
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}

// 监听路由变化，更新选中的菜单
watch(() => route.path, (newPath) => {
  // 根据当前路径设置选中的菜单项
  const pathSegments = newPath.split('/').filter(Boolean)
  
  if (pathSegments.length >= 2) {
    const section = pathSegments[1] // user
    const module = pathSegments[2] // news, articles, etc.
    
    if (section === 'user') {
      if (module === 'news') {
        selectedKeys.value = ['news']
      } else if (module === 'articles') {
        selectedKeys.value = ['article-list']
        if (pathSegments[3] === 'create') {
          selectedKeys.value = ['article-create']
        } else if (pathSegments[3] === 'draft') {
          selectedKeys.value = ['article-draft']
        }
      } else if (module === 'forum') {
        if (pathSegments[3] === 'create') {
          selectedKeys.value = ['forum-create']
        } else if (pathSegments[3] === 'my-posts') {
          selectedKeys.value = ['forum-my-posts']
        } else if (pathSegments[3] === 'my-likes') {
          selectedKeys.value = ['forum-my-likes']
        } else {
          selectedKeys.value = ['forum-home']
        }
      } else if (module === 'services') {
        selectedKeys.value = ['services']
      } else if (module === 'bounty') {
        if (pathSegments[3] === 'create') {
          selectedKeys.value = ['bounty-create']
        } else if (pathSegments[3] === 'draft') {
          selectedKeys.value = ['bounty-draft']
        } else if (pathSegments[3] === 'audit-result') {
          selectedKeys.value = ['bounty-list']
        } else {
          selectedKeys.value = ['bounty-list']
        }
      } else if (module === 'orders') {
        if (pathSegments[3] === 'transactions') {
          selectedKeys.value = ['order-transactions']
        } else {
          selectedKeys.value = ['order-list']
        }
      } else if (module === 'profile') {
        if (pathSegments[3] === 'security') {
          selectedKeys.value = ['profile-security']
        } else if (pathSegments[3] === 'role-apply') {
          selectedKeys.value = ['profile-role-apply']
        } else if (pathSegments[3] === 'subscriptions') {
          selectedKeys.value = ['profile-subscriptions']
        } else if (pathSegments[3] === 'privacy') {
          selectedKeys.value = ['profile-privacy']
        } else {
          selectedKeys.value = ['profile-info']
        }
      } else if (module === 'favorites') {
        selectedKeys.value = ['profile-favorites']
      } else if (module === 'following') {
        selectedKeys.value = ['profile-following']
      } else if (module === 'followers') {
        selectedKeys.value = ['profile-followers']
      } else if (module === 'messages') {
        selectedKeys.value = ['profile-messages']
      } else if (module === 'settings') {
        selectedKeys.value = ['profile-settings']
      }
    }
  }
}, { immediate: true })
</script>

<style scoped lang="less">
.user-layout {
  min-height: 100vh;
  
  .layout-header {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 0;
    
    .header-content {
      width: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      height: 64px;
    }
    
    .logo {
      margin-right: 40px;
      flex-shrink: 0;
      
      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #333;
      }
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      
      span {
        font-size: 18px;
        font-weight: bold;
        color: #1890ff;
      }
    }
    
    .header-nav {
      flex: 1;
      border-bottom: none;
      line-height: 64px;
      
      :deep(.ant-menu-item) {
        a {
          text-decoration: none;
          color: inherit;
        }
      }
      
      :deep(.ant-menu-horizontal) {
        border-bottom: none;
      }
      
      :deep(.ant-menu-horizontal > .ant-menu-item) {
        border-bottom: 2px solid transparent;
        
        &:hover {
          border-bottom-color: #1890ff;
        }
        
        &.ant-menu-item-selected {
          border-bottom-color: #1890ff;
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }
    
    .user-info {
      display: flex;
      align-items: center;
    }
  }
  
  .layout-body {
    width: 100%;
    padding: 0;
    background: #f5f5f5;
    min-height: calc(100vh - 64px);
  }
  
  .layout-sidebar {
    background: #fff;
    border-right: 1px solid #f0f0f0;
    
    :deep(.ant-layout-sider-children) {
      padding: 16px 0;
    }
    
    :deep(.ant-menu-item),
    :deep(.ant-menu-submenu-title) {
      margin: 0;
      border-radius: 0;
      
      a {
        text-decoration: none;
        color: inherit;
      }
    }
    
    :deep(.ant-menu-inline) {
      border-right: none;
    }
  }
  
  .layout-main {
    background: #fff;
    padding: 0;
    
    .breadcrumb {
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
      
      :deep(.ant-breadcrumb-link) {
        a {
          text-decoration: none;
          color: #1890ff;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .main-content {
      padding: 24px;
      min-height: 600px;
    }
  }
}

@media (max-width: 1200px) {
  .user-layout {
    .layout-header {
      .header-content {
        padding: 0 16px;
      }
      
      .logo {
        margin-right: 24px;
      }
    }
  }
}

@media (max-width: 768px) {
  .user-layout {
    .layout-header {
      .header-content {
        padding: 0 12px;
      }
      
      .logo {
        margin-right: 16px;
        
        span {
          display: none;
        }
      }
      
      .header-actions {
        gap: 8px;
        
        .ant-input-search {
          width: 150px !important;
        }
      }
    }
    
    .layout-body {
      flex-direction: column;
      
      .layout-sidebar {
        width: 100% !important;
        max-width: 100% !important;
        flex: none !important;
        order: -1;
      }
    }
  }
}
</style>