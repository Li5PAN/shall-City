<template>
  <div class="article-card" @click="handleClick">
    <div v-if="showCover && article.coverImage" class="article-card__cover">
      <img :src="article.coverImage" :alt="article.title" class="article-card__image" />
    </div>
    <div class="article-card__body">
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p class="article-card__summary">{{ article.summary }}</p>
      <div class="article-card__meta">
        <span class="article-card__author">
          <UserOutlined /> {{ article.author }}
        </span>
        <span class="article-card__time">
          <ClockCircleOutlined /> {{ formatTime(article.createdAt) }}
        </span>
        <span class="article-card__views">
          <EyeOutlined /> {{ article.views || 0 }}
        </span>
        <a-tag v-if="article.category" size="small" color="blue">{{ article.category }}</a-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { UserOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  showCover: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD') : ''
}

const handleClick = () => {
  emit('click', props.article.id)
}
</script>

<style scoped lang="less">
.article-card {
  display: flex;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__cover {
    width: 200px;
    min-height: 120px;
    flex-shrink: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    flex: 1;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__summary {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
    color: #999;
  }

  &__author,
  &__time,
  &__views {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
