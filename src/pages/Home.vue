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
            <!-- 头像 + 悬浮卡片 -->
            <a-popover
              trigger="hover"
              placement="bottomRight"
              overlay-class-name="user-popover"
              :arrow="false"
            >
              <div class="avatar-trigger">
                <a-avatar :src="authStore.userInfo?.avatar" :size="34">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </div>
              <template #content>
                <div class="user-hover-card">
                  <!-- 顶部用户信息 -->
                  <div class="hover-card__header">
                    <a-avatar :src="authStore.userInfo?.avatar" :size="44">
                      <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <div class="hover-card__info">
                      <span class="hover-card__name">{{ authStore.userInfo?.nickname || authStore.userInfo?.username || '用户' }}</span>
                      <a-tag size="small" color="green">{{ authStore.userRole === 'provider' ? '服务商' : '普通用户' }}</a-tag>
                    </div>
                  </div>

                  <!-- 统计数据 -->
                  <div class="hover-card__stats">
                    <div class="hover-stat" @click="$router.push('/user/followers')">
                      <span class="hover-stat__value">{{ userStats.followers || '--' }}</span>
                      <span class="hover-stat__label">粉丝</span>
                    </div>
                    <div class="hover-stat" @click="$router.push('/user/following')">
                      <span class="hover-stat__value">{{ userStats.following || 141 }}</span>
                      <span class="hover-stat__label">关注</span>
                    </div>
                    <div class="hover-stat">
                      <span class="hover-stat__value">{{ userStats.likes || '--' }}</span>
                      <span class="hover-stat__label">获赞</span>
                    </div>
                  </div>

                  <!-- 导航菜单 -->
                  <div class="hover-card__menu">
                    <div class="hover-menu-item" @click="$router.push('/home')">
                      <HomeOutlined /> <span>我的主页</span>
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/user/profile')">
                      <UserOutlined /> <span>个人中心</span>
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/user/articles')">
                      <FormOutlined /> <span>内容管理</span>
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/user/favorites')">
                      <HeartOutlined /> <span>会员中心</span>
                    </div>
                  </div>

                  <a-divider style="margin: 8px 0" />

                  <div class="hover-card__menu">
                    <div class="hover-menu-item" @click="$router.push('/user/services')">
                      <ShoppingCartOutlined /> <span>已购内容</span>
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/user/orders')">
                      <FileTextOutlined /> <span>我的订单</span>
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/user/profile/security')">
                      <WalletOutlined /> <span>我的钱包</span>
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/user/profile')">
                      <SafetyCertificateOutlined /> <span>我的等级</span> <RightOutlined class="menu-arrow" />
                    </div>
                    <div class="hover-menu-item" @click="$router.push('/home')">
                      <HistoryOutlined /> <span>浏览历史</span>
                    </div>
                  </div>

                  <a-divider style="margin: 8px 0" />

                  <div class="hover-card__menu">
                    <div class="hover-menu-item" @click="handleLogout">
                      <LogoutOutlined /> <span>退出</span>
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>

            <!-- 个人中心链接 -->
            <a class="header-link" @click="$router.push('/user/profile')">个人中心</a>

            <!-- 消息图标 + 红点 -->
            <a-badge :dot="hasUnreadMessages" class="msg-badge">
              <a class="header-link" @click="$router.push('/user/messages')">
                <BellOutlined style="font-size: 18px" />
              </a>
            </a-badge>

            <!-- 创作按钮 + 悬浮面板 -->
            <a-popover
              trigger="click"
              placement="bottomRight"
              overlay-class-name="creation-popover"
              :arrow="false"
            >
              <a-button class="creation-btn">
                <template #icon><EditOutlined /></template>
                创作
              </a-button>
              <template #content>
                <div class="creation-hover-panel">
                  <div class="creation-panel__grid">
                    <div class="creation-panel__item" @click="$router.push('/user/articles/create')">
                      <EditOutlined class="creation-panel__icon" />
                      <span>写文章</span>
                    </div>
                    <div class="creation-panel__item" @click="$router.push('/user/services')">
                      <CodeOutlined class="creation-panel__icon" />
                      <span>我的服务</span>
                    </div>
                    <div class="creation-panel__item" @click="$router.push('/user/bounty/create')">
                      <FolderOpenOutlined class="creation-panel__icon" />
                      <span>我的悬赏</span>
                    </div>
                    <div class="creation-panel__item" @click="$router.push('/user/forum/create')">
                      <MessageOutlined class="creation-panel__icon" />
                      <span>我的论坛</span>
                    </div>
                    <div class="creation-panel__item" @click="$router.push('/user/orders')">
                      <InboxOutlined class="creation-panel__icon" />
                      <span>订单管理</span>
                    </div>
                  </div>
                  <div class="creation-panel__entry" @click="$router.push('/user/articles')">
                    <BulbOutlined /> 进入创作者中心 <RightOutlined style="font-size: 12px" />
                  </div>
                </div>
              </template>
            </a-popover>
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
        <div class="sidebar-top">
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
          </a-menu>
        </div>
        <div class="sidebar-bottom">
          <a-menu mode="inline" :selected-keys="[]" @click="handleMenuClick">
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
        </div>
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

        <!-- 需求悬赏区 -->
        <section class="recommend-section">
          <div class="section-tabs">
            <span class="tab-label active">需求悬赏</span>
            <a class="tab-more" @click="$router.push('/user/bounty')">更多需求 &gt;</a>
          </div>

          <a-spin :spinning="bountyLoading">
            <div class="bounty-grid">
              <div
                v-for="bounty in bountyList"
                :key="bounty.id"
                class="bounty-card"
                @click="$router.push(`/user/bounty/${bounty.id}`)"
              >
                <div class="bounty-card__top">
                  <div v-if="bounty.coverImage" class="bounty-card__icon">
                    <img :src="bounty.coverImage" :alt="bounty.title" />
                  </div>
                  <div class="bounty-card__content">
                    <h4 class="bounty-card__title">{{ bounty.title }}</h4>
                    <p class="bounty-card__desc">{{ bounty.description }}</p>
                  </div>
                </div>
                <div class="bounty-card__bottom">
                  <div class="bounty-card__meta">
                    <a-tag v-if="bounty.category" size="small" color="green">{{ bounty.category }}</a-tag>
                    <span v-if="bounty.views" class="bounty-card__views"><EyeOutlined /> {{ bounty.views }}</span>
                  </div>
                  <a class="bounty-card__detail">查看详情 <RightOutlined /></a>
                </div>
              </div>
            </div>
            <a-empty v-if="!bountyLoading && bountyList.length === 0" description="暂无悬赏需求" />
          </a-spin>
        </section>

        <!-- 精选文章区 -->
        <section class="recommend-section">
          <div class="section-tabs">
            <span class="tab-label active">精选文章</span>
            <a class="tab-more" @click="$router.push('/user/news')"><StarOutlined /> 排行榜</a>
          </div>

          <a-spin :spinning="newsLoading">
            <div class="article-list">
              <div
                v-for="article in featuredArticles"
                :key="article.id"
                class="article-item"
                @click="handleNewsClick(article.id)"
              >
                <div class="article-item__header">
                  <a-avatar :size="22" :src="article.authorAvatar">
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                  <span class="article-item__author">{{ article.author || '匿名' }}</span>
                </div>
                <div class="article-item__main">
                  <div class="article-item__text">
                    <h3 class="article-item__title">{{ article.title }}</h3>
                    <p class="article-item__desc">{{ article.summary }}</p>
                  </div>
                  <div v-if="article.coverImage" class="article-item__cover">
                    <img :src="article.coverImage" :alt="article.title" />
                  </div>
                </div>
                <div class="article-item__footer">
                  <span class="article-item__stat"><EyeOutlined /> 阅读 {{ article.views || 0 }}</span>
                  <span class="article-item__stat"><LikeOutlined /> {{ article.likes || 0 }} 赞</span>
                  <span class="article-item__stat"><StarOutlined /> 收藏 {{ article.favorites || 0 }}</span>
                </div>
              </div>
              <a-empty v-if="!newsLoading && featuredArticles.length === 0" description="暂无精选文章" />
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
            <a class="sidebar-more" @click="$router.push('/user/forum')">更多 &gt;</a>
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
              <span class="forum-arrow">&gt;</span>
            </div>
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
  FormOutlined,
  FileTextOutlined,
  WalletOutlined,
  SafetyCertificateOutlined,
  RightOutlined,
  CodeOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  BulbOutlined,
  LikeOutlined,
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchKeyword = ref('')
const sidebarCollapsed = ref(false)
const newsLoading = ref(false)
const bountyLoading = ref(false)
const activeTab = ref('news')
const hasUnreadMessages = ref(true)

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

const bountyList = ref([
  { id: 1, title: 'CHATERM AI：开启云资源氛围管理新篇章', description: '需要一个智能云资源管理平台，支持多云环境统一管理', category: '人工智能', views: '58.5K', coverImage: 'https://via.placeholder.com/48x48/1890ff/ffffff?text=AI' },
  { id: 2, title: '欧拉操作系统内核开源，助力开发者获取源码与技术', description: '基于欧拉内核的定制化开发需求', category: 'C', views: '12.3K', coverImage: 'https://via.placeholder.com/48x48/4e6ef2/ffffff?text=OS' },
  { id: 3, title: 'MiniMax-M2.1：MiniMax-AI开源大模型，赋能高效智能应用开发', description: '需要基于MiniMax大模型的应用集成方案', category: 'Python', views: '32.1K', coverImage: 'https://via.placeholder.com/48x48/722ed1/ffffff?text=ML' },
  { id: 4, title: 'PaddleOCR-VL：开源视觉语言OCR工具，多模态识别提升文档处理效率', description: '文档智能识别与结构化处理系统开发', category: 'Python', views: '28.7K', coverImage: 'https://via.placeholder.com/48x48/13c2c2/ffffff?text=OCR' },
])
const featuredArticles = ref([
  { id: 1, author: 'Agent学习系统', title: 'AI大模型大师秘籍：2025年AI技术全景揭秘，从入门到精通的完整学习指南', summary: '本文系统介绍了AI大模型的学习路径，分为四个阶段：基础阶段（1-2个月）重点内容数学、统计和机器学习基础；进阶阶段（2-3个月）深入深度学习框架...', views: '1.5k', likes: 47, favorites: 14, coverImage: 'https://via.placeholder.com/120x80/f0f0f0/333?text=AI' },
  { id: 2, author: 'RR1335', title: '构建太空生存空间 NASA Artemis IV: Building First Lunar Space Station', summary: 'NASA正在推进阿尔忒弥斯IV计划，计划在月球轨道建设首个空间站"门户"。该计划采用升级版SLS火箭，运送核心模块到月球轨道...', views: '1.3k', likes: 33, favorites: 39, coverImage: 'https://via.placeholder.com/120x80/e6f7ff/333?text=NASA' },
  { id: 3, author: 'bkspiderx', title: '深入解析CPU调度：操作系统的核心资源分配机制', summary: '本文系统解析了CPU调度机制，包括必要性、核心目标和经典算法。CPU调度通过时间分片和优先级排序实现多任务并行，平衡响应时间...', views: '1.5k', likes: 34, favorites: 11, coverImage: 'https://via.placeholder.com/120x80/f6ffed/333?text=CPU' },
])

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

onMounted(() => {
  // 数据已使用假数据，无需加载
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
    width: 100%;
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
    gap: 12px;
    flex-shrink: 0;

    .avatar-trigger {
      cursor: pointer;
      border-radius: 50%;
      padding: 2px;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 0 0 2px #52c41a;
      }
    }

    .header-link {
      font-size: 13px;
      color: #333;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        color: #52c41a;
      }
    }

    .msg-badge {
      cursor: pointer;
    }

    .creation-btn {
      background: #f0fbe8;
      color: #52c41a;
      border: 1px solid #b7eb8f;
      border-radius: 20px;
      font-size: 13px;
      height: 32px;
      padding: 0 16px;
      font-weight: 500;

      &:hover {
        background: #d9f7be;
        border-color: #73d13d;
        color: #389e0d;
      }
    }
  }
}

/* ===== 主体布局 ===== */
.main-wrapper {
  width: 100%;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 72px;
  height: calc(100vh - 88px);

  .sidebar-top {
    padding: 8px 0;
  }

  .sidebar-bottom {
    padding: 8px 0;
    border-top: 1px solid #f0f0f0;
  }

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

/* ===== 需求悬赏 2x2 网格 ===== */
.bounty-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .bounty-card {
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    &__top {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    &__icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__content {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__desc {
      font-size: 12px;
      color: #999;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #999;
    }

    &__views {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    &__detail {
      font-size: 12px;
      color: #999;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        color: #1890ff;
      }
    }
  }
}

/* ===== 精选文章列表 ===== */
.article-list {
  .article-item {
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

    &__header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    &__author {
      font-size: 13px;
      color: #666;
    }

    &__main {
      display: flex;
      gap: 16px;
      margin-bottom: 10px;
    }

    &__text {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 17px;
      font-weight: 600;
      color: #333;
      margin: 0 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__desc {
      font-size: 13px;
      color: #666;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &__cover {
      width: 120px;
      height: 80px;
      flex-shrink: 0;
      border-radius: 6px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    &__stat {
      font-size: 12px;
      color: #999;
      display: inline-flex;
      align-items: center;
      gap: 4px;
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
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sidebar-more {
      font-size: 12px;
      font-weight: 400;
      color: #999;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }

  &__body {
    padding: 8px 12px;
  }
}

.forum-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 4px;
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
    flex: 1;
  }

  .forum-arrow {
    font-size: 12px;
    color: #ccc;
    margin-right: 3px;
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

/* ===== 头像悬浮卡片 ===== */
.user-hover-card {
  width: 260px;
  padding: 4px 0;

  .hover-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;

    .hover-card__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .hover-card__name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }
  }

  .hover-card__stats {
    display: flex;
    padding: 8px 16px 12px;
    border-bottom: 1px solid #f0f0f0;

    .hover-stat {
      flex: 1;
      text-align: center;
      cursor: pointer;

      &:hover .hover-stat__value {
        color: #52c41a;
      }

      .hover-stat__value {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .hover-stat__label {
        display: block;
        font-size: 12px;
        color: #999;
        margin-top: 2px;
      }
    }
  }

  .hover-card__menu {
    padding: 4px 0;

    .hover-menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      .menu-arrow {
        margin-left: auto;
        font-size: 12px;
        color: #ccc;
      }
    }
  }
}

/* ===== 创作悬浮面板 ===== */
.creation-hover-panel {
  width: 460px;
  padding: 8px 0;

  .creation-panel__grid {
    display: flex;
    justify-content: space-around;
    padding: 16px 12px 20px;

    .creation-panel__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background 0.2s;
      font-size: 13px;
      color: #333;
      white-space: nowrap;

      &:hover {
        background: #f5f5f5;
      }

      .creation-panel__icon {
        font-size: 24px;
        color: #555;
      }
    }
  }

  .creation-panel__entry {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0 16px;
    padding: 10px 0;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #fafafa;
      color: #333;
      border-color: #d9d9d9;
    }
  }
}
</style>
