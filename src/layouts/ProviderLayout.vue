<template>
  <a-layout class="provider-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="layout-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <img src="/logo.svg" alt="IT服务平台" />
            <span>服务商后台</span>
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
import { providerMenus } from '@/config/menu'
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  MoneyCollectOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 图标映射
const iconMap = {
  DashboardOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  MoneyCollectOutlined
}

// 响应式数据
const unreadCount = ref(3)
const selectedKeys = ref([])
const openKeys = ref(['services'])

// 用户信息（模拟数据）
const userInfo = ref({
  id: 2001,
  username: '李四',
  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  role: 'provider'
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
  
  return convertMenu(providerMenus)
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const crumbs = [{ title: '首页', path: '/' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    
    if (path === 'provider') {
      crumbs.push({ title: '服务商后台', path: currentPath })
    } else if (path === 'dashboard') {
      crumbs.push({ title: '数据看板', path: currentPath })
    } else if (path === 'services') {
      crumbs.push({ title: '服务管理', path: currentPath })
    } else if (path === 'orders') {
      crumbs.push({ title: '订单管理', path: currentPath })
    } else if (path === 'transactions') {
      crumbs.push({ title: '交易记录', path: currentPath })
    } else if (path === 'create') {
      crumbs.push({ title: '创建', path: null })
    } else if (path === 'audit-result') {
      crumbs.push({ title: '审核结果', path: null })
    } else if (path === 'delivery') {
      crumbs.push({ title: '订单交付', path: null })
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
  
  const path = findPath(providerMenus, key)
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
    const section = pathSegments[1] // provider
    const module = pathSegments[2] // dashboard, services, etc.
    
    if (section === 'provider') {
      if (module === 'dashboard') {
        selectedKeys.value = ['dashboard']
      } else if (module === 'services') {
        selectedKeys.value = ['service-list']
        if (pathSegments[3] === 'create') {
          selectedKeys.value = ['service-create']
        } else if (pathSegments[3] === 'audit-result') {
          selectedKeys.value = ['service-list']
        }
      } else if (module === 'orders') {
        selectedKeys.value = ['orders']
        if (pathSegments[3] === 'delivery') {
          selectedKeys.value = ['orders']
        }
      } else if (module === 'transactions') {
        selectedKeys.value = ['transactions']
      }
    }
  }
}, { immediate: true })
</script>

<style scoped lang="less">
.provider-layout {
  min-height: 100vh;
  
  .layout-header {
    background: #001529;
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
</style>