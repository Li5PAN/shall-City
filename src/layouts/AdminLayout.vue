<template>
  <a-layout class="admin-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <img src="/logo.svg" alt="IT服务平台" />
            <span>管理后台</span>
          </router-link>
        </div>
        
        <div class="header-actions">
          <a-badge :count="unreadCount" :offset="[10, 0]">
            <a-button type="text">
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
import { adminMenus } from '@/config/menu'
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DesktopOutlined,
  TeamOutlined,
  AuditOutlined,
  ReconciliationOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 图标映射
const iconMap = {
  DesktopOutlined,
  TeamOutlined,
  AuditOutlined,
  ReconciliationOutlined,
  SettingOutlined
}

// 响应式数据
const unreadCount = ref(8)
const selectedKeys = ref([])
const openKeys = ref(['users', 'content', 'orders', 'system'])

// 用户信息（模拟数据）
const userInfo = ref({
  id: 3001,
  username: '管理员',
  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  role: 'admin'
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
  
  return convertMenu(adminMenus)
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const crumbs = [{ title: '首页', path: '/' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    
    if (path === 'admin') {
      crumbs.push({ title: '管理后台', path: currentPath })
    } else if (path === 'dashboard') {
      crumbs.push({ title: '数据看板', path: currentPath })
    } else if (path === 'users') {
      crumbs.push({ title: '用户管理', path: currentPath })
    } else if (path === 'roles') {
      crumbs.push({ title: '角色管理', path: currentPath })
    } else if (path === 'articles') {
      crumbs.push({ title: '文章审核', path: currentPath })
    } else if (path === 'services') {
      crumbs.push({ title: '服务审核', path: currentPath })
    } else if (path === 'bounty') {
      crumbs.push({ title: '需求审核', path: currentPath })
    } else if (path === 'forum') {
      crumbs.push({ title: '论坛管理', path: currentPath })
    } else if (path === 'sections') {
      crumbs.push({ title: '板块管理', path: null })
    } else if (path === 'orders') {
      crumbs.push({ title: '订单管理', path: currentPath })
    } else if (path === 'appeals') {
      crumbs.push({ title: '申诉处理', path: currentPath })
    } else if (path === 'arbitration') {
      crumbs.push({ title: '订单仲裁', path: null })
    } else if (path === 'statistics') {
      crumbs.push({ title: '数据统计', path: currentPath })
    } else if (path === 'logs') {
      crumbs.push({ title: '系统日志', path: currentPath })
    } else if (path === 'announcements') {
      crumbs.push({ title: '公告管理', path: currentPath })
    } else if (path === 'review') {
      crumbs.push({ title: '审核', path: null })
    } else if (path === 'manage') {
      crumbs.push({ title: '管理', path: null })
    }
  })
  
  return crumbs
})

// 方法
const handleMenuClick = ({ key }) => {
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
  
  const path = findPath(adminMenus, key)
  if (path) {
    router.push(path)
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  router.push('/login')
}

// 监听路由变化，更新选中的菜单
watch(() => route.path, (newPath) => {
  const pathSegments = newPath.split('/').filter(Boolean)
  
  if (pathSegments.length >= 2) {
    const section = pathSegments[1] // admin
    const module = pathSegments[2] // dashboard, users, etc.
    
    if (section === 'admin') {
      if (module === 'dashboard') {
        selectedKeys.value = ['dashboard']
      } else if (module === 'users') {
        selectedKeys.value = ['user-list']
      } else if (module === 'roles') {
        selectedKeys.value = ['role-manage']
      } else if (module === 'articles') {
        selectedKeys.value = ['article-review']
      } else if (module === 'services') {
        selectedKeys.value = ['service-review']
      } else if (module === 'bounty') {
        selectedKeys.value = ['bounty-review']
      } else if (module === 'forum') {
        if (pathSegments[3] === 'sections') {
          selectedKeys.value = ['forum-sections']
        } else {
          selectedKeys.value = ['forum-manage']
        }
      } else if (module === 'orders') {
        if (pathSegments[3] === 'arbitration') {
          selectedKeys.value = ['order-arbitration']
        } else {
          selectedKeys.value = ['order-list']
        }
      } else if (module === 'appeals') {
        selectedKeys.value = ['appeal-handle']
      } else if (module === 'statistics') {
        selectedKeys.value = ['statistics']
      } else if (module === 'logs') {
        selectedKeys.value = ['logs']
      } else if (module === 'announcements') {
        selectedKeys.value = ['announcements']
      }
    }
  }
}, { immediate: true })
</script>

<style scoped lang="less">
.admin-layout {
  min-height: 100vh;
  
  .layout-header {
    background: #722ed1;
    padding: 0;
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }
    
    .logo {
      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #fff;
      }
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      
      span {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .ant-btn {
        color: rgba(255, 255, 255, 0.85);
        
        &:hover {
          color: #fff;
        }
      }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.85);
      
      &:hover {
        color: #fff;
      }
    }
  }
  
  .layout-body {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: #f0f2f5;
  }
  
  .layout-sidebar {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-right: 20px;
    
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
  }
  
  .layout-main {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0;
    
    .breadcrumb {
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      
      :deep(.ant-breadcrumb-link) {
        a {
          text-decoration: none;
          color: #722ed1;
          
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
</style>