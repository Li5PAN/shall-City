<template>
  <div class="bounty-list-page">
    <!-- 标题 -->
    <h2 class="page-title">需求悬赏</h2>

    <!-- 分类标签栏 -->
    <div class="category-bar">
      <span
        v-for="cat in categories"
        :key="cat"
        :class="['category-item', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >{{ cat }}</span>
    </div>

    <!-- 悬赏卡片网格 -->
    <a-spin :spinning="loading">
      <div class="bounty-grid">
        <div
          v-for="bounty in filteredList"
          :key="bounty.id"
          class="bounty-card"
          @click="$router.push(`/home/bounty/${bounty.id}`)"
        >
          <div class="bounty-card__top">
            <div class="bounty-card__icon">
              <img :src="bounty.coverImage" :alt="bounty.title" />
            </div>
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
      <a-empty v-if="!loading && filteredList.length === 0" description="暂无悬赏需求" />
    </a-spin>

    <!-- 分页 -->
    <div class="pagination-section" v-if="filteredList.length > 0">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="(t, range) => `第 ${range[0]}-${range[1]} 条，共 ${t} 条`"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeOutlined } from '@ant-design/icons-vue'

const loading = ref(false)
const activeCategory = ref('猜你喜欢')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)

const categories = ['猜你喜欢', '网站开发', '微信开发', '小程序开发', 'APP开发']

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

const filteredList = computed(() => {
  if (activeCategory.value === '猜你喜欢') return bountyList.value
  return bountyList.value.filter(b => b.group === activeCategory.value)
})

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
}
</script>

<style scoped lang="less">
.bounty-list-page {
  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin: 0 0 16px;
  }

  .category-bar {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .category-item {
      font-size: 14px;
      color: #666;
      cursor: pointer;
      padding-bottom: 4px;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;
      &:hover { color: #ff4d00; }
      &.active { color: #ff4d00; font-weight: 600; border-bottom-color: #ff4d00; }
    }
  }

  .bounty-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .bounty-card {
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    padding: 16px;
    cursor: pointer;
    transition: box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    &:hover { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); }

    &__top { display: flex; gap: 12px; margin-bottom: 12px; }
    &__icon {
      width: 48px; height: 48px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: #f5f5f5;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    &__content { flex: 1; min-width: 0; }
    &__title {
      font-size: 14px; font-weight: 600; color: #333; margin: 0 0 4px;
      overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4;
    }
    &__desc { font-size: 12px; color: #999; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    &__bottom { display: flex; justify-content: space-between; align-items: center; }
    &__meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #999; }
    &__tag { color: #52c41a; font-size: 12px; }
    &__views { display: inline-flex; align-items: center; gap: 3px; }
    &__right { display: flex; align-items: center; gap: 12px; }
    &__price { font-size: 16px; font-weight: 700; color: #ff4d00; }
    &__detail { font-size: 12px; color: #999; cursor: pointer; white-space: nowrap; &:hover { color: #1890ff; } }
  }

  .pagination-section {
    text-align: center;
  }
}
</style>
