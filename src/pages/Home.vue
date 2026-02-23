<template>
  <div class="home-page">
    <header class="top-header">
      <div class="header-inner">
        <div class="header-left">
          <a-button type="text" class="menu-toggle" @click="sidebarCollapsed = !sidebarCollapsed"><template #icon><MenuOutlined /></template></a-button>
          <div class="logo" @click="goHome"><img src="/logo.svg" alt="IT" class="logo-img" /><span class="logo-text">IT服务平台</span></div>
        </div>
        <div class="header-center">
          <a-input-search v-model:value="searchKeyword" placeholder="小美想知道些什么..." class="global-search" @search="handleSearch" />
          <div class="nav-tabs"><a-button v-for="tab in navTabs" :key="tab.key" :type="activeTab === tab.key ? 'primary' : 'text'" size="small" @click="handleTabClick(tab)">{{ tab.label }}</a-button></div>
        </div>
        <div class="header-right">
          <template v-if="authStore.isAuthenticated">
            <a-popover trigger="hover" placement="bottomRight" overlay-class-name="user-popover" :arrow="false">
              <div class="avatar-trigger"><a-avatar :src="authStore.userInfo?.avatar" :size="34"><template #icon><UserOutlined /></template></a-avatar></div>
              <template #content>
                <div class="user-hover-card">
                  <div class="hover-card__header"><a-avatar :src="authStore.userInfo?.avatar" :size="44"><template #icon><UserOutlined /></template></a-avatar><div class="hover-card__info"><span class="hover-card__name">{{ authStore.userInfo?.nickname || '用户' }}</span><a-tag size="small" color="green">{{ authStore.userRole === 'provider' ? '服务商' : '普通用户' }}</a-tag></div></div>
                  <div class="hover-card__stats"><div class="hover-stat" @click="nav('/home/followers')"><span class="hover-stat__value">{{ userStats.followers || '--' }}</span><span class="hover-stat__label">粉丝</span></div><div class="hover-stat" @click="nav('/home/following')"><span class="hover-stat__value">{{ userStats.following || 141 }}</span><span class="hover-stat__label">关注</span></div><div class="hover-stat"><span class="hover-stat__value">{{ userStats.likes || '--' }}</span><span class="hover-stat__label">获赞</span></div></div>
                  <div class="hover-card__menu"><div class="hover-menu-item" @click="goHome"><HomeOutlined /> <span>我的主页</span></div><div class="hover-menu-item" @click="nav('/home/profile')"><UserOutlined /> <span>个人中心</span></div><div class="hover-menu-item" @click="nav('/home/articles')"><FormOutlined /> <span>内容管理</span></div><div class="hover-menu-item" @click="nav('/home/favorites')"><HeartOutlined /> <span>会员中心</span></div></div>
                  <a-divider style="margin: 8px 0" />
                  <div class="hover-card__menu"><div class="hover-menu-item" @click="nav('/home/services')"><ShoppingCartOutlined /> <span>已购内容</span></div><div class="hover-menu-item" @click="nav('/home/orders')"><FileTextOutlined /> <span>我的订单</span></div><div class="hover-menu-item" @click="nav('/home/profile/security')"><WalletOutlined /> <span>我的钱包</span></div></div>
                  <a-divider style="margin: 8px 0" />
                  <div class="hover-card__menu"><div class="hover-menu-item" @click="handleLogout"><LogoutOutlined /> <span>退出</span></div></div>
                </div>
              </template>
            </a-popover>
            <a class="header-link" @click="nav('/home/profile')">个人中心</a>
            <a-badge :dot="hasUnreadMessages" class="msg-badge"><a class="header-link" @click="nav('/home/messages')"><BellOutlined style="font-size: 18px" /></a></a-badge>
            <a-popover trigger="click" placement="bottomRight" overlay-class-name="creation-popover" :arrow="false">
              <a-button class="creation-btn"><template #icon><EditOutlined /></template>创作</a-button>
              <template #content>
                <div class="creation-hover-panel">
                  <div class="creation-panel__grid"><div class="creation-panel__item" @click="nav('/home/articles/create')"><EditOutlined class="creation-panel__icon" /><span>写文章</span></div><div class="creation-panel__item" @click="nav('/home/services')"><CodeOutlined class="creation-panel__icon" /><span>我的服务</span></div><div class="creation-panel__item" @click="nav('/home/bounty/create')"><FolderOpenOutlined class="creation-panel__icon" /><span>我的悬赏</span></div><div class="creation-panel__item" @click="nav('/home/forum/create')"><MessageOutlined class="creation-panel__icon" /><span>我的论坛</span></div><div class="creation-panel__item" @click="nav('/home/orders')"><InboxOutlined class="creation-panel__icon" /><span>订单管理</span></div></div>
                  <div class="creation-panel__entry" @click="nav('/home/articles')"><BulbOutlined /> 进入创作者中心 <RightOutlined style="font-size: 12px" /></div>
                </div>
              </template>
            </a-popover>
          </template>
          <template v-else><a-button type="link" @click="nav('/login')">登录</a-button><a-button type="primary" size="small" @click="nav('/register')">注册</a-button></template>
        </div>
      </div>
    </header>
    <div class="main-wrapper">
      <aside :class="['left-sidebar', { collapsed: sidebarCollapsed }]">
        <div class="sidebar-top"><a-menu mode="inline" :selected-keys="sidebarTopKeys" @click="handleMenuClick"><a-menu-item key="home"><template #icon><HomeOutlined /></template><span>首页</span></a-menu-item><a-menu-item key="services"><template #icon><ShoppingOutlined /></template><span>服务市场</span></a-menu-item><a-menu-item key="bounty"><template #icon><TrophyOutlined /></template><span>需求悬赏</span></a-menu-item><a-menu-item key="forum"><template #icon><MessageOutlined /></template><span>技术论坛</span></a-menu-item><a-menu-item key="help"><template #icon><QuestionCircleOutlined /></template><span>帮助中心</span></a-menu-item></a-menu></div>
        <div class="sidebar-bottom"><a-menu mode="inline" :selected-keys="sidebarBottomKeys" @click="handleMenuClick"><a-menu-item key="orders"><template #icon><ShoppingCartOutlined /></template><span>订单</span></a-menu-item><a-menu-item key="following"><template #icon><EyeOutlined /></template><span>关注</span></a-menu-item><a-menu-item key="favorites"><template #icon><StarOutlined /></template><span>收藏</span></a-menu-item><a-menu-item key="history"><template #icon><HistoryOutlined /></template><span>历史</span></a-menu-item><a-menu-item key="profile"><template #icon><UserOutlined /></template><span>个人中心</span></a-menu-item><a-menu-item key="creation"><template #icon><EditOutlined /></template><span>创作中心</span></a-menu-item></a-menu></div>
      </aside>
      <main class="content-area"><router-view /></main>
      <aside class="right-sidebar"><div class="sidebar-card"><div class="sidebar-card__header"><span>论坛推荐</span><a class="sidebar-more" @click="nav('/home/forum')">更多 &gt;</a></div><div class="sidebar-card__body"><div v-for="(item, index) in forumRecommends" :key="index" class="forum-item" @click="handleForumClick(item)"><span class="forum-icon">{{ item.icon }}</span><span class="forum-name">{{ item.name }}</span><span class="forum-arrow">&gt;</span></div></div></div></aside>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MenuOutlined, HomeOutlined, UserOutlined, ShoppingOutlined, TrophyOutlined, MessageOutlined, QuestionCircleOutlined, ShoppingCartOutlined, EyeOutlined, StarOutlined, HistoryOutlined, EditOutlined, HeartOutlined, BellOutlined, LogoutOutlined, FormOutlined, FileTextOutlined, WalletOutlined, SafetyCertificateOutlined, RightOutlined, CodeOutlined, FolderOpenOutlined, InboxOutlined, BulbOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const searchKeyword = ref('')
const sidebarCollapsed = ref(false)
const activeTab = ref('news')
const hasUnreadMessages = ref(true)
const userStats = ref({ articles: '--', followers: 141, following: 141, likes: '--' })
const nav = (path) => router.push(path)
const goHome = () => router.push('/home')
const currentMenuKey = computed(() => {
  const p = route.path
  if (p === '/home') return 'home'
  if (p.startsWith('/home/services')) return 'services'
  if (p.startsWith('/home/bounty')) return 'bounty'
  if (p.startsWith('/home/forum')) return 'forum'
  if (p.startsWith('/home/orders')) return 'orders'
  if (p.startsWith('/home/following')) return 'following'
  if (p.startsWith('/home/favorites')) return 'favorites'
  if (p.startsWith('/home/profile')) return 'profile'
  if (p.startsWith('/home/articles')) return 'creation'
  if (p.startsWith('/home/messages')) return 'profile'
  return 'home'
})
const topKeys = ['home', 'services', 'bounty', 'forum', 'help']
const sidebarTopKeys = computed(() => topKeys.includes(currentMenuKey.value) ? [currentMenuKey.value] : [])
const sidebarBottomKeys = computed(() => !topKeys.includes(currentMenuKey.value) ? [currentMenuKey.value] : [])
const navTabs = [{ key: 'news', label: '资讯中心', path: '/home/news' }, { key: 'services', label: '服务市场', path: '/home/services' }, { key: 'bounty', label: '需求悬赏', path: '/home/bounty' }, { key: 'forum', label: '技术论坛', path: '/home/forum' }]
const menuRouteMap = { home: '/home', services: '/home/services', bounty: '/home/bounty', forum: '/home/forum', help: '/home', orders: '/home/orders', following: '/home/following', favorites: '/home/favorites', history: '/home', profile: '/home/profile', creation: '/home/articles' }
const forumRecommends = ref([{ icon: '', name: '海洋开发者社区', path: '/home/forum' }, { icon: '', name: 'Harmony OS开发社区', path: '/home/forum' }, { icon: '', name: '航天AI技术前沿社区', path: '/home/forum' }, { icon: '', name: '深度学习入门者交流', path: '/home/forum' }, { icon: '', name: 'NVIDIA AI智能体社区', path: '/home/forum' }, { icon: '', name: '智能财务与数字化管理', path: '/home/forum' }, { icon: '', name: 'DARPA开源硬件社区', path: '/home/forum' }, { icon: '', name: '清华社区', path: '/home/forum' }, { icon: '', name: 'JAVA社区', path: '/home/forum' }])
const handleSearch = (value) => { if (value) router.push('/home/news?keyword=' + value) }
const handleTabClick = (tab) => { activeTab.value = tab.key; router.push(tab.path) }
const handleMenuClick = ({ key }) => { const path = menuRouteMap[key]; if (path) router.push(path) }
const handleForumClick = (item) => { router.push(item.path || '/home/forum') }
const handleLogout = () => { authStore.logout(); router.push('/login') }
</script>
<style scoped lang="less">
.home-page { min-height: 100vh; background: #f5f5f5; }
.top-header { background: #fff; border-bottom: 1px solid #e8e8e8; position: sticky; top: 0; z-index: 100; height: 56px;
  .header-inner { width: 100%; padding: 0 16px; display: flex; align-items: center; height: 100%; gap: 16px; }
  .header-left { display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    .menu-toggle { font-size: 18px; }
    .logo { display: flex; align-items: center; cursor: pointer; gap: 6px;
      .logo-img { width: 28px; height: 28px; }
      .logo-text { font-size: 16px; font-weight: 600; color: #52c41a; white-space: nowrap; }
    }
  }
  .header-center { flex: 1; display: flex; align-items: center; gap: 12px; min-width: 0;
    .global-search { max-width: 320px; }
    .nav-tabs { display: flex; gap: 4px; flex-shrink: 0; }
  }
  .header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    .avatar-trigger { cursor: pointer; border-radius: 50%; padding: 2px; transition: box-shadow 0.2s; &:hover { box-shadow: 0 0 0 2px #52c41a; } }
    .header-link { font-size: 13px; color: #333; cursor: pointer; white-space: nowrap; &:hover { color: #52c41a; } }
    .msg-badge { cursor: pointer; }
    .creation-btn { background: #f0fbe8; color: #52c41a; border: 1px solid #b7eb8f; border-radius: 20px; font-size: 13px; height: 32px; padding: 0 16px; font-weight: 500; &:hover { background: #d9f7be; border-color: #73d13d; color: #389e0d; } }
  }
}
.main-wrapper { width: 100%; padding: 16px; display: flex; gap: 16px; }
.left-sidebar { width: 180px; flex-shrink: 0; background: #fff; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between; position: sticky; top: 72px; height: calc(100vh - 88px);
  .sidebar-top { padding: 8px 0; }
  .sidebar-bottom { padding: 8px 0; border-top: 1px solid #f0f0f0; }
  &.collapsed { width: 64px; :deep(.ant-menu-inline) { width: 64px; } :deep(.ant-menu-item) { padding: 0 calc(50% - 8px) !important; } span:not(.anticon) { display: none; } }
  :deep(.ant-menu) { border-right: none; }
  :deep(.ant-menu-item) { height: 40px; line-height: 40px; margin: 2px 8px; border-radius: 6px; }
}
.content-area { flex: 1; min-width: 0; }
.right-sidebar { width: 280px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px; align-self: flex-start; position: sticky; top: 72px; }
.sidebar-card { background: #fff; border-radius: 8px; overflow: hidden;
  &__header { padding: 12px 16px; font-size: 14px; font-weight: 600; color: #333; border-bottom: 1px solid #f5f5f5; display: flex; justify-content: space-between; align-items: center;
    .sidebar-more { font-size: 12px; font-weight: 400; color: #999; cursor: pointer; &:hover { color: #1890ff; } }
  }
  &__body { padding: 8px 12px; }
}
.forum-item { display: flex; align-items: center; gap: 8px; padding: 10px 4px; cursor: pointer; border-radius: 4px; transition: background 0.2s; &:hover { background: #f5f5f5; }
  .forum-icon { font-size: 18px; } .forum-name { font-size: 13px; color: #333; flex: 1; } .forum-arrow { font-size: 12px; color: #ccc; margin-right: 3px; }
}
.user-hover-card { width: 260px; padding: 4px 0;
  .hover-card__header { display: flex; align-items: center; gap: 12px; padding: 12px 16px;
    .hover-card__info { display: flex; flex-direction: column; gap: 4px; } .hover-card__name { font-size: 15px; font-weight: 600; color: #333; }
  }
  .hover-card__stats { display: flex; padding: 8px 16px 12px; border-bottom: 1px solid #f0f0f0;
    .hover-stat { flex: 1; text-align: center; cursor: pointer; &:hover .hover-stat__value { color: #52c41a; }
      .hover-stat__value { display: block; font-size: 16px; font-weight: 600; color: #333; } .hover-stat__label { display: block; font-size: 12px; color: #999; margin-top: 2px; }
    }
  }
  .hover-card__menu { padding: 4px 0;
    .hover-menu-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 14px; color: #333; cursor: pointer; transition: background 0.2s; &:hover { background: #f5f5f5; }
      .menu-arrow { margin-left: auto; font-size: 12px; color: #ccc; }
    }
  }
}
.creation-hover-panel { width: 460px; padding: 8px 0;
  .creation-panel__grid { display: flex; justify-content: space-around; padding: 16px 12px 20px;
    .creation-panel__item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; border-radius: 8px; transition: background 0.2s; font-size: 13px; color: #333; white-space: nowrap; &:hover { background: #f5f5f5; }
      .creation-panel__icon { font-size: 24px; color: #555; }
    }
  }
  .creation-panel__entry { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 0 16px; padding: 10px 0; border: 1px solid #f0f0f0; border-radius: 8px; font-size: 14px; color: #666; cursor: pointer; transition: all 0.2s; &:hover { background: #fafafa; color: #333; border-color: #d9d9d9; } }
}
</style>
