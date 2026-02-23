<template>
  <div>
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
      <div class="section-header">
        <span class="section-title">需求悬赏</span>
      </div>
      <div class="category-tabs">
        <span
          v-for="cat in bountyCategories"
          :key="cat"
          :class="['category-tab', { active: activeBountyCategory === cat }]"
          @click="activeBountyCategory = cat"
        >{{ cat }}</span>
      </div>
      <div class="bounty-grid">
        <div v-for="bounty in filteredBountyList" :key="bounty.id" class="bounty-card" @click="$router.push(`/home/bounty/${bounty.id}`)">
          <div class="bounty-card__top">
            <div class="bounty-card__icon"><img :src="bounty.coverImage" :alt="bounty.title" /></div>
            <div class="bounty-card__content">
              <h4 class="bounty-card__title">{{ bounty.title }}</h4>
              <p class="bounty-card__desc">{{ bounty.description }}</p>
            </div>
          </div>
          <div class="bounty-card__bottom">
            <div class="bounty-card__meta">
              <span class="bounty-card__tag">● {{ bounty.category }}</span>
              <span v-if="bounty.views" class="bounty-card__views"><EyeOutlined /> {{ bounty.views }}</span>
            </div>
            <div class="bounty-card__right">
              <span class="bounty-card__price">¥{{ bounty.price }}</span>
              <a class="bounty-card__detail">查看详情 →</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 精选文章区 -->
    <section class="recommend-section">
      <div class="section-tabs">
        <span class="tab-label active">精选文章</span>
        <a class="tab-more" @click="$router.push('/home/news')"><StarOutlined /> 排行榜</a>
      </div>
      <div class="article-list">
        <div v-for="article in featuredArticles" :key="article.id" class="article-item" @click="$router.push(`/home/news/${article.id}`)">
          <div class="article-item__header">
            <a-avatar :size="22" :src="article.authorAvatar"><template #icon><UserOutlined /></template></a-avatar>
            <span class="article-item__author">{{ article.author || '匿名' }}</span>
          </div>
          <div class="article-item__main">
            <div class="article-item__text">
              <h3 class="article-item__title">{{ article.title }}</h3>
              <p class="article-item__desc">{{ article.summary }}</p>
            </div>
            <div v-if="article.coverImage" class="article-item__cover"><img :src="article.coverImage" :alt="article.title" /></div>
          </div>
          <div class="article-item__footer">
            <span class="article-item__stat"><EyeOutlined /> 阅读 {{ article.views || 0 }}</span>
            <span class="article-item__stat"><LikeOutlined /> {{ article.likes || 0 }} 赞</span>
            <span class="article-item__stat"><StarOutlined /> 收藏 {{ article.favorites || 0 }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeOutlined, StarOutlined, UserOutlined, LikeOutlined } from '@ant-design/icons-vue'

const banners = ref([
  { title: '找专业人做专业事 多快好省', subtitle: '一站式IT服务平台，连接优质服务商与企业需求', bg: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' },
  { title: '悬赏模式 精准匹配需求', subtitle: '发布技术需求，获得专业解决方案', bg: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)' },
])

const bountyCategories = ['猜你喜欢', '网站开发', '微信开发', '小程序开发', 'APP开发']
const activeBountyCategory = ref('猜你喜欢')

const bountyList = ref([
  { id: 1, title: 'MiniMax-M2.1：MiniMax-AI开源大模型，赋能高效智能应用开发', description: '需要基于MiniMax大模型的应用集成方案', category: 'Python', price: 3800, views: '32.1K', coverImage: 'https://via.placeholder.com/48x48/722ed1/ffffff?text=ML', group: '猜你喜欢' },
  { id: 2, title: 'PaddleOCR-VL：开源视觉语言OCR工具，多模态识别提升文档处理效率', description: '文档智能识别与结构化处理系统开发', category: 'Python', price: 3800, views: '28.7K', coverImage: 'https://via.placeholder.com/48x48/13c2c2/ffffff?text=OCR', group: '猜你喜欢' },
  { id: 3, title: 'CHATERM AI：开启云资源氛围管理新篇章！', description: '需要一个智能云资源管理平台，支持多云环境统一管理', category: '人工智能', price: 3800, views: '68.5K', coverImage: 'https://via.placeholder.com/48x48/1890ff/ffffff?text=AI', group: '猜你喜欢' },
  { id: 4, title: '欧拉操作系统内核开源，助力开发者获取源码与技术', description: '基于欧拉内核的定制化开发需求', category: 'C', price: 3800, views: '12.3K', coverImage: 'https://via.placeholder.com/48x48/4e6ef2/ffffff?text=OS', group: '猜你喜欢' },
  { id: 5, title: 'MiniMax-M2.1：MiniMax-AI开源大模型，赋能高效智能应用开发', description: '需要基于MiniMax大模型的应用集成方案', category: 'Python', price: 3800, views: '32.1K', coverImage: 'https://via.placeholder.com/48x48/722ed1/ffffff?text=ML', group: '猜你喜欢' },
  { id: 6, title: 'PaddleOCR-VL：开源视觉语言OCR工具，多模态识别提升文档处理效率', description: '文档智能识别与结构化处理系统开发', category: 'Python', price: 3800, views: '28.7K', coverImage: 'https://via.placeholder.com/48x48/13c2c2/ffffff?text=OCR', group: '猜你喜欢' },
  { id: 7, title: 'CHATERM AI：开启云资源氛围管理新篇章！', description: '需要一个智能云资源管理平台，支持多云环境统一管理', category: '人工智能', price: 3800, views: '68.5K', coverImage: 'https://via.placeholder.com/48x48/1890ff/ffffff?text=AI', group: '猜你喜欢' },
  { id: 8, title: '欧拉操作系统内核开源，助力开发者获取源码与技术', description: '基于欧拉内核的定制化开发需求', category: 'C', price: 3800, views: '12.3K', coverImage: 'https://via.placeholder.com/48x48/4e6ef2/ffffff?text=OS', group: '猜你喜欢' },
  { id: 9, title: 'MiniMax-M2.1：MiniMax-AI开源大模型，赋能高效智能应用开发', description: '需要基于MiniMax大模型的应用集成方案', category: 'Python', price: 3800, views: '32.1K', coverImage: 'https://via.placeholder.com/48x48/722ed1/ffffff?text=ML', group: '猜你喜欢' },
  { id: 10, title: 'PaddleOCR-VL：开源视觉语言OCR工具，多模态识别提升文档处理效率', description: '文档智能识别与结构化处理系统开发', category: 'Python', price: 3800, views: '28.7K', coverImage: 'https://via.placeholder.com/48x48/13c2c2/ffffff?text=OCR', group: '猜你喜欢' },
])

const filteredBountyList = computed(() => {
  const list = activeBountyCategory.value === '猜你喜欢' ? bountyList.value : bountyList.value.filter(b => b.group === activeBountyCategory.value)
  return list.slice(0, 4)
})

const featuredArticles = ref([
  { id: 1, author: 'Agent学习系统', title: 'AI大模型大师秘籍：2025年AI技术全景揭秘', summary: '本文系统介绍了AI大模型的学习路径，分为四个阶段...', views: '1.5k', likes: 47, favorites: 14, coverImage: 'https://via.placeholder.com/120x80/f0f0f0/333?text=AI' },
  { id: 2, author: 'RR1335', title: '构建太空生存空间 NASA Artemis IV', summary: 'NASA正在推进阿尔忒弥斯IV计划，计划在月球轨道建设首个空间站...', views: '1.3k', likes: 33, favorites: 39, coverImage: 'https://via.placeholder.com/120x80/e6f7ff/333?text=NASA' },
  { id: 3, author: 'bkspiderx', title: '深入解析CPU调度：操作系统的核心资源分配机制', summary: '本文系统解析了CPU调度机制，包括必要性、核心目标和经典算法...', views: '1.5k', likes: 34, favorites: 11, coverImage: 'https://via.placeholder.com/120x80/f6ffed/333?text=CPU' },
])
</script>

<style scoped lang="less">
.banner-section {
  margin-bottom: 16px;
  .home-carousel { border-radius: 8px; overflow: hidden; }
  .carousel-slide .banner-inner {
    height: 200px; display: flex; align-items: center; padding: 0 40px; border-radius: 8px; color: #fff;
    .banner-text {
      h2 { font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px; }
      p { font-size: 14px; color: rgba(255,255,255,0.85); margin: 0 0 16px; }
      .banner-logo-placeholder { font-size: 13px; opacity: 0.7; }
    }
  }
}
.recommend-section {
  background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 16px;
  .section-header {
    margin-bottom: 12px;
    .section-title { font-size: 18px; font-weight: 700; color: #333; }
  }
  .category-tabs {
    display: flex; align-items: center; gap: 24px; margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;
    .category-tab {
      font-size: 14px; color: #666; cursor: pointer; padding-bottom: 4px; border-bottom: 2px solid transparent; transition: all 0.2s;
      &:hover { color: #ff4d00; }
      &.active { color: #ff4d00; font-weight: 600; border-bottom-color: #ff4d00; }
    }
  }
  .section-tabs {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;
    .tab-label { font-size: 16px; font-weight: 600; color: #333; }
    .tab-more { font-size: 13px; color: #999; cursor: pointer; &:hover { color: #1890ff; } }
  }
}
.bounty-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
  .bounty-card {
    border: 1px solid #f0f0f0; border-radius: 10px; padding: 16px; cursor: pointer; transition: box-shadow 0.2s; display: flex; flex-direction: column; justify-content: space-between;
    &:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    &__top { display: flex; gap: 12px; margin-bottom: 12px; }
    &__icon { width: 48px; height: 48px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #f5f5f5; img { width: 100%; height: 100%; object-fit: cover; } }
    &__content { flex: 1; min-width: 0; }
    &__title { font-size: 14px; font-weight: 600; color: #333; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4; }
    &__desc { font-size: 12px; color: #999; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    &__bottom { display: flex; justify-content: space-between; align-items: center; }
    &__meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #999; }
    &__tag { color: #52c41a; font-size: 12px; }
    &__views { display: inline-flex; align-items: center; gap: 3px; }
    &__right { display: flex; align-items: center; gap: 12px; }
    &__price { font-size: 16px; font-weight: 700; color: #ff4d00; }
    &__detail { font-size: 12px; color: #999; cursor: pointer; white-space: nowrap; &:hover { color: #1890ff; } }
  }
}
.article-list {
  .article-item {
    padding: 16px 0; border-bottom: 1px solid #f5f5f5; cursor: pointer; transition: background 0.2s;
    &:last-child { border-bottom: none; }
    &:hover { background: #fafafa; }
    &__header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    &__author { font-size: 13px; color: #666; }
    &__main { display: flex; gap: 16px; margin-bottom: 10px; }
    &__text { flex: 1; min-width: 0; }
    &__title { font-size: 17px; font-weight: 600; color: #333; margin: 0 0 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    &__desc { font-size: 13px; color: #666; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    &__cover { width: 120px; height: 80px; flex-shrink: 0; border-radius: 6px; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } }
    &__footer { display: flex; align-items: center; gap: 20px; }
    &__stat { font-size: 12px; color: #999; display: inline-flex; align-items: center; gap: 4px; }
  }
}
</style>
