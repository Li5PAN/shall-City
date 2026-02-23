<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-inner">
        <div class="header-left">
          <a-button type="text" class="menu-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
            <template #icon><MenuOutlined /></template>
          </a-button>
          <div class="logo" @click="$router.push('/home')">
            <img src="/logo.svg" alt="IT服务平台" class="logo-img" />
            <span class="logo-text">IT服务平台</span>
          </div>
        </div>

        <div class="header-center">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="小美想知道些什么..."
            class="global-search"
            @search="handleSearch"
          />
          <div class="nav-tabs">
            <a-button
              v-for="tab in navTabs"
              :key="tab.key"
              :type="activeTab === tab.key ? 'primary' : 'text'"
              size="small"
              @click="handleTabClick(tab)"
            >
              {{ tab.label }}
            </a-button>
          </div>
        </div>

        <div class="header-right">
          <template v-if="authStore.isAuthenticated">
            <a-dropdown>
              <div class="user-trigger">
                <a-avatar :src="authStore.userInfo?.avatar" :size="32">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile" @click="$router.push('/user/profile')">
                    <UserOutlined /> 个人中心
                  </a-menu-item>
                  <a-menu-item key="orders" @click="$router.push('/user/orders')">
                    <ShoppingOutlined /> 我的订单
                  </a-menu-item>
                  <a-menu-item key="favorites" @click="$router.push('/user/favorites')">
                    <HeartOutlined /> 我的收藏
                  </a-menu-item>
                  <a-menu-item key="messages" @click="$router.push('/user/messages')">
                    <BellOutlined /> 消息中心
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined /> 退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <span class="username-text">{{ authStore.userInfo?.nickname || authStore.userInfo?.username }}</span>
          </template>
          <template v-else>
            <a-button type="link" @click="$router.push('/login')">登录</a-button>
            <a-button type="primary" size="small" @click="$router.push('/register')">注册</a-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主体区域 -->
    <div class="main-wrapper">
      <!-- 左侧导航 -->
      <aside :class="['left-sidebar', { collapsed: sidebarCollapsed }]">
        <a-menu mode="inline" :selected-keys="['home']" @click="handleMenuClick">
          <a-menu-item key="home">
            <template #icon><HomeOutlined /></template>
            <span>首页</span>
          </a-menu-item>
          <a-menu-item key="services">
            <template #icon><ShoppingOutlined /></template>
            <span>服务市场</span>
          </a-menu-item>
          <a-menu-item key="bounty">
            <template #icon><TrophyOutlined /></template>
            <span>需求悬赏</span>
          </a-menu-item>
          <a-menu-item key="forum">
            <template #icon><MessageOutlined /></template>
            <span>技术论坛</span>
          </a-menu-item>
          <a-menu-item key="help">
            <template #icon><QuestionCircleOutlined /></template>
            <span>帮助中心</span>
          </a-menu-item>
          <a-divider style="margin: 8px 0" />
          <a-menu-item key="orders">
            <template #icon><ShoppingCartOutlined /></template>
            <span>订单</span>
          </a-menu-item>
          <a-menu-item key="following">
            <template #icon><EyeOutlined /></template>
            <span>关注</span>
          </a-menu-item>
          <a-menu-item key="favorites">
            <template #icon><StarOutlined /></template>
            <span>收藏</span>
          </a-menu-item>
          <a-menu-item key="history">
            <template #icon><HistoryOutlined /></template>
            <span>历史</span>
          </a-menu-item>
          <a-menu-item key="profile">
            <template #icon><UserOutlined /></template>
            <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="creation">
            <template #icon><EditOutlined /></template>
            <span>创作中心</span>
          </a-menu-item>
        </a-menu>
      </aside>

      <!-- 中间内容区 -->
      <main class="content-area">
        <!-- Banner 轮播 -->
        <section class="banner-section">
          <a-carousel autoplay class="home-carousel">
            <div v-for="(banner, index) in banners" :key="index" class="carousel-slide">
              <div class="banner-inner" :style="{ background: banner.bg }">
                <div class="banner-text">
                  <h2>{{ banner.title }}</h2>
                  <p>{{ banner.subtitle }}</p>
                  <div class="banner-logo-placeholder">图片logo</div>
                </div>
              </div>
            </div>
          </a-carousel>
        </section>

        <!-- 资讯推荐区 -->
        <section class="recommend-section">
          <div class="section-tabs">
            <span class="tab-label active">资讯推荐</span>
            <a class="tab-more" @click="$router.push('/user/news')">全部资讯</a>
          </div>

          <a-spin :spinning="newsLoading">
            <div class="article-feed">
              <div
                v-for="article in latestNews"
                :key="article.id"
                class="feed-item"
                @click="handleNewsClick(article.id)"
              >
                <div class="feed-item__body">
                  <div class="feed-item__source">
                    <a-avatar :size="20" :src="article.authorAvatar">
                      <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <span class="source-name">{{ article.author || '匿名' }}</span>
                    <span class="source-time">{{ formatTime(article.createdAt) }}</span>
                  </div>
                  <h3 class="feed-item__title">{{ article.title }}</h3>
                  <p class="feed-item__desc">{{ article.summary }}</p>
                  <div class="feed-item__tags">
                    <a-tag v-for="tag in (article.tags || []).slice(0, 3)" :key="tag" size="small">{{ tag }}</a-tag>
                  </div>
                </div>
                <div v-if="article.coverImage" class="feed-item__cover">
                  <img :src="article.coverImage" :alt="article.title" />
                </div>
              </div>
              <a-empty v-if="!newsLoading && latestNews.length === 0" description="暂无推荐资讯" />
            </div>
          </a-spin>
        </section>

        <!-- 精选文章区 -->
        <section class="recommend-section">
          <div class="section-tabs">
            <span class="tab-label active">精选文章</span>
          </div>
          <a-spin :spinning="newsLoading">
            <div class="article-feed">
              <div
                v-for="article in featuredArticles"
                :key="article.id"
                class="feed-item"
                @click="handleNewsClick(article.id)"
              >
                <div class="feed-item__body">
                  <div class="feed-item__source">
                    <a-avatar :size="20" :src="article.authorAvatar">
                      <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <span class="source-name">{{ article.author || '匿名' }}</span>
                  </div>
                  <h3 class="feed-item__title">{{ article.title }}</h3>
                  <p class="feed-item__desc">{{ article.summary }}</p>
                </div>
                <div v-if="article.coverImage" class="feed-item__cover">
                  <img :src="article.coverImage" :alt="article.title" />
                </div>
              </div>
            </div>
          </a-spin>
        </section>
      </main>

      <!-- 右侧边栏 -->
      <aside class="right-sidebar">
        <!-- 论坛推荐 -->
        <div class="sidebar-card">
          <div class="sidebar-card__header">
            <span>论坛推荐</span>
          </div>
          <div class="sidebar-card__body">
            <div
              v-for="(item, index) in forumRecommends"
              :key="index"
              class="forum-item"
              @click="handleForumClick(item)"
            >
              <span class="forum-icon">{{ item.icon }}</span>
              <span class="forum-name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <!-- 用户信息卡片（已登录） -->
        <div v-if="authStore.isAuthenticated" class="sidebar-card user-card">
          <div class="user-card__header">
            <a-avatar :src="authStore.userInfo?.avatar" :size="48">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div class="user-card__info">
              <span class="user-card__name">{{ authStore.userInfo?.nickname || authStore.userInfo?.username }}</span>
            </div>
          </div>
          <div class="user-card__stats">
            <div class="stat-item">
              <span class="stat-value">{{ userStats.articles || '--' }}</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userStats.followers || '--' }}</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userStats.likes || '--' }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
        </div>

        <!-- 创作中心入口 -->
        <div v-if="authStore.isAuthenticated" class="sidebar-card">
          <div class="sidebar-card__header">
            <span>创作中心</span>
          </div>
          <div class="creation-grid">
            <div class="creation-item" @click="$router.push('/user/articles/create')">
              <EditOutlined />
              <span>写文章</span>
            </div>
            <div class="creation-item" @click="$router.push('/user/bounty/create')">
              <TrophyOutlined />
              <span>发悬赏</span>
            </div>
            <div class="creation-item" @click="$router.push('/user/services')">
              <ShoppingOutlined />
              <span>找服务</span>
            </div>
            <div class="creation-item" @click="$router.push('/user/forum/create')">
              <MessageOutlined />
              <span>发帖子</span>
            </div>
          </div>
          <div class="creation-entry" @click="$router.push('/user/articles/create')">
            <EditOutlined /> 进入创作中心 &gt;
          </div>
        </div>

        <!-- 快捷导航 -->
        <div class="sidebar-card">
          <div class="quick-links">
            <a @click="$router.push('/user/orders')"><ShoppingCartOutlined /> 我的订单</a>
            <a @click="$router.push('/user/profile')"><UserOutlined /> 我的主页</a>
            <a @click="$router.push('/user/favorites')"><StarOutlined /> 我的收藏</a>
            <a @click="$router.push('/user/following')"><EyeOutlined /> 我的关注</a>
            <a @click="$router.push('/user/messages')"><BellOutlined /> 消息中心</a>
            <a v-if="authStore.isAuthenticated" @click="handleLogout"><LogoutOutlined /> 退出</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  StarOutlined,
  HistoryOutlined,
  EditOutlined,
  HeartOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { useNewsStore } from '@/stores/news'
import { useForumStore } from '@/stores/forum'

const router = useRouter()
const authStore = useAuthStore()
const newsStore = useNewsStore()
const forumStore = useForumStore()

const searchKeyword = ref('')
const sidebarCollapsed = ref(false)
const newsLoading = ref(false)
const activeTab = ref('news')

const navTabs = [
  { key: 'news', label: '资讯中心', path: '/user/news' },
  { key: 'services', label: '服务市场', path: '/user/services' },
  { key: 'bounty', label: '需求悬赏', path: '/user/bounty' },
  { key: 'forum', label: '技术论坛', path: '/user/forum' },
]

const banners = ref([
  {
    title: '找专业人做专业事 多快好省',
    subtitle: '一站式IT服务平台，连接优质服务商与企业需求',
    bg: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
  },
  {
    title: '悬赏模式 精准匹配需求',
    subtitle: '发布技术需求，获得专业解决方案',
    bg: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
  },
])

const userStats = ref({ articles: '--', followers: 141, likes: '--' })

const latestNews = ref([])
const featuredArticles = ref([])

const forumRecommends = ref([
  { icon: '🌊', name: '海洋开发者社区', path: '/user/forum' },
  { icon: '📱', name: 'Harmony OS开发社区', path: '/user/forum' },
  { icon: '✈️', name: '航天AI技术前沿社区', path: '/user/forum' },
  { icon: '🎓', name: '深度学习入门者交流', path: '/user/forum' },
  { icon: '🤖', name: 'NVIDIA AI智能体社区', path: '/user/forum' },
  { icon: '📊', name: '智能财务与数字化管理', path: '/user/forum' },
  { icon: '🔧', name: 'DARPA开源硬件社区', path: '/user/forum' },
  { icon: '🌐', name: '清华社区', path: '/user/forum' },
  { icon: '☕', name: 'JAVA社区', path: '/user/forum' },
])

const menuRouteMap = {
  home: '/home',
  services: '/user/services',
  bounty: '/user/bounty',
  forum: '/user/forum',
  help: '/home',
  orders: '/user/orders',
  following: '/user/following',
  favorites: '/user/favorites',
  history: '/home',
  profile: '/user/profile',
  creation: '/user/articles/create',
}

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD') : ''
}

const handleSearch = (value) => {
  if (value) router.push(`/user/news?keyword=${value}`)
}

const handleTabClick = (tab) => {
  activeTab.value = tab.key
  router.push(tab.path)
}

const handleMenuClick = ({ key }) => {
  const path = menuRouteMap[key]
  if (path) router.push(path)
}

const handleNewsClick = (id) => {
  router.push(`/user/news/${id}`)
}

const handleForumClick = (item) => {
  router.push(item.path || '/user/forum')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const loadNews = async () => {
  newsLoading.value = true
  try {
    const res = await newsStore.fetchLatestNews({ pageSize: 6 })
    const list = res?.list || res?.data || res || []
    latestNews.value = Array.isArray(list) ? list.slice(0, 4) : []
    featuredArticles.value = Array.isArray(list) ? list.slice(4, 6) : []
  } catch {
    // handled in store
  } finally {
    newsLoading.value = false
  }
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped lang="less">
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* ===== 顶部导航 ===== */
.top-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;

  .header-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    height: 100%;
    gap: 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    .menu-toggle {
      font-size: 18px;
    }

    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 6px;

      .logo-img {
        width: 28px;
        height: 28px;
      }

      .logo-text {
        font-size: 16px;
        font-weight: 600;
        color: #52c41a;
        white-space: nowrap;
      }
    }
  }

  .header-center {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;

    .global-search {
      max-width: 320px;
    }

    .nav-tabs {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    .user-trigger {
      cursor: pointer;
    }

    .username-text {
      font-size: 13px;
      color: #333;
    }
  }
}

/* ===== 主体布局 ===== */
.main-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  gap: 16px;
}

/* ===== 左侧导航 ===== */
.left-sidebar {
  width: 180px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 8px 0;
  align-self: flex-start;
  position: sticky;
  top: 72px;

  &.collapsed {
    width: 64px;

    :deep(.ant-menu-inline) {
      width: 64px;
    }

    :deep(.ant-menu-item) {
      padding: 0 calc(50% - 8px) !important;
    }

    span:not(.anticon) {
      display: none;
    }
  }

  :deep(.ant-menu) {
    border-right: none;
  }

  :deep(.ant-menu-item) {
    height: 40px;
    line-height: 40px;
    margin: 2px 8px;
    border-radius: 6px;
  }
}

/* ===== 中间内容区 ===== */
.content-area {
  flex: 1;
  min-width: 0;
}

.banner-section {
  margin-bottom: 16px;

  .home-carousel {
    border-radius: 8px;
    overflow: hidden;
  }

  .carousel-slide {
    .banner-inner {
      height: 200px;
      display: flex;
      align-items: center;
      padding: 0 40px;
      border-radius: 8px;
      color: #fff;

      .banner-text {
        h2 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 16px;
        }

        .banner-logo-placeholder {
          font-size: 13px;
          opacity: 0.7;
        }
      }
    }
  }
}

/* ===== 资讯推荐 ===== */
.recommend-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .section-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;

    .tab-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;

      &.active {
        color: #333;
      }
    }

    .tab-more {
      font-size: 13px;
      color: #999;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }
}

.article-feed {
  .feed-item {
    display: flex;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #fafafa;
    }

    &__body {
      flex: 1;
      min-width: 0;
    }

    &__source {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;

      .source-name {
        font-size: 12px;
        color: #666;
      }

      .source-time {
        font-size: 12px;
        color: #999;
      }
    }

    &__title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin: 0 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__desc {
      font-size: 13px;
      color: #666;
      margin: 0 0 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__tags {
      display: flex;
      gap: 4px;
    }

    &__cover {
      width: 160px;
      height: 100px;
      flex-shrink: 0;
      border-radius: 6px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

/* ===== 右侧边栏 ===== */
.right-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: flex-start;
  position: sticky;
  top: 72px;
}

.sidebar-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  &__header {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
  }

  &__body {
    padding: 8px 12px;
  }
}

.forum-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  .forum-icon {
    font-size: 18px;
  }

  .forum-name {
    font-size: 13px;
    color: #333;
  }
}

/* 用户卡片 */
.user-card {
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }

  &__name {
    font-size: 15px;
    font-weight: 500;
    color: #333;
  }

  &__stats {
    display: flex;
    border-top: 1px solid #f5f5f5;

    .stat-item {
      flex: 1;
      text-align: center;
      padding: 12px 0;

      .stat-value {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .stat-label {
        display: block;
        font-size: 12px;
        color: #999;
        margin-top: 2px;
      }
    }
  }
}

/* 创作中心 */
.creation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 12px;

  .creation-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 0;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
    font-size: 12px;
    color: #666;

    &:hover {
      background: #f5f5f5;
      color: #1890ff;
    }

    .anticon {
      font-size: 20px;
    }
  }
}

.creation-entry {
  padding: 10px 16px;
  border-top: 1px solid #f5f5f5;
  font-size: 13px;
  color: #1890ff;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #f0f9ff;
  }
}

/* 快捷导航 */
.quick-links {
  padding: 8px 12px;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 4px;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: #f5f5f5;
      color: #1890ff;
    }
  }
}
</style>
