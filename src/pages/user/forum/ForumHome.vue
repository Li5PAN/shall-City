<template>
  <div class="forum-home">
    <!-- 搜索筛选栏 -->
    <SearchFilter
      :filters="searchFilters"
      :default-values="{ keyword: '' }"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 热门帖子轮播 -->
    <a-card class="hot-carousel-card" v-if="forumStore.hotPosts.length">
      <template #title>
        <FireOutlined style="color: #ff4d4f; margin-right: 8px;" />热门帖子
      </template>
      <a-carousel autoplay :dots="true" class="hot-carousel">
        <div v-for="post in forumStore.hotPosts" :key="post.id" class="carousel-item" @click="goToPostDetail(post.id)">
          <h3>{{ post.title }}</h3>
          <p>{{ post.summary }}</p>
          <div class="carousel-meta">
            <span><EyeOutlined /> {{ post.views || 0 }}</span>
            <span><LikeOutlined /> {{ post.likes || 0 }}</span>
          </div>
        </div>
      </a-carousel>
    </a-card>

    <!-- 板块分类导航 -->
    <a-card style="margin-top: 16px;">
      <a-tabs v-model:activeKey="activeSectionId" @change="handleSectionChange">
        <a-tab-pane key="all" tab="全部板块" />
        <a-tab-pane
          v-for="section in forumStore.sections"
          :key="section.id"
          :tab="section.name"
        />
      </a-tabs>

      <!-- 排序 -->
      <div class="sort-bar">
        <a-radio-group v-model:value="sortBy" @change="fetchList">
          <a-radio-button value="latest">最新</a-radio-button>
          <a-radio-button value="hot">最热</a-radio-button>
          <a-radio-button value="essence">精华</a-radio-button>
        </a-radio-group>
        <a-button type="primary" @click="goToCreatePost">
          <EditOutlined /> 发布帖子
        </a-button>
      </div>

      <!-- 帖子列表 -->
      <a-spin :spinning="forumStore.loading">
        <div class="posts-list">
          <div
            v-for="post in forumStore.postList"
            :key="post.id"
            class="post-item"
            @click="goToPostDetail(post.id)"
          >
            <a-avatar :src="post.author?.avatar" :size="40">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div class="post-content">
              <h3 class="post-title">
                <a-tag v-if="post.isTop" color="red" size="small">置顶</a-tag>
                <a-tag v-if="post.isEssence" color="gold" size="small">精华</a-tag>
                {{ post.title }}
              </h3>
              <p class="post-summary">{{ post.summary }}</p>
              <div class="post-meta">
                <span>{{ post.author?.name || '匿名' }}</span>
                <span>{{ formatTime(post.createdAt) }}</span>
                <span><EyeOutlined /> {{ post.stats?.views || 0 }}</span>
                <span><LikeOutlined /> {{ post.stats?.likes || 0 }}</span>
                <span><MessageOutlined /> {{ post.stats?.replies || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <EmptyState v-if="!forumStore.loading && forumStore.postList.length === 0" description="暂无帖子" />
      </a-spin>

      <!-- 分页 -->
      <PaginationWrapper
        v-if="forumStore.postList.length > 0"
        :total="forumStore.pagination.total"
        :current="forumStore.pagination.current"
        :page-size="forumStore.pagination.pageSize"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  EditOutlined, EyeOutlined, LikeOutlined, MessageOutlined,
  FireOutlined, UserOutlined
} from '@ant-design/icons-vue'
import SearchFilter from '@/components/common/SearchFilter.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useForumStore } from '@/stores/forum'

const router = useRouter()
const forumStore = useForumStore()

const activeSectionId = ref('all')
const sortBy = ref('latest')
const searchKeyword = ref('')

const searchFilters = [
  { type: 'input', field: 'keyword', label: '关键词', placeholder: '搜索帖子...' }
]

const handleSearch = (params) => {
  searchKeyword.value = params.keyword || ''
  forumStore.pagination.current = 1
  fetchList()
}

const handleReset = () => {
  searchKeyword.value = ''
  forumStore.pagination.current = 1
  fetchList()
}

const handleSectionChange = (key) => {
  activeSectionId.value = key
  forumStore.pagination.current = 1
  fetchList()
}

const handlePageChange = (page, pageSize) => {
  forumStore.pagination.current = page
  forumStore.pagination.pageSize = pageSize
  fetchList()
}

const fetchList = () => {
  forumStore.fetchPostList({
    sectionId: activeSectionId.value === 'all' ? undefined : activeSectionId.value,
    sortBy: sortBy.value,
    keyword: searchKeyword.value,
    current: forumStore.pagination.current,
    pageSize: forumStore.pagination.pageSize,
  })
}

const goToCreatePost = () => router.push('/user/forum/create')
const goToPostDetail = (id) => router.push(`/user/forum/post/${id}`)

const formatTime = (t) => {
  if (!t) return ''
  const diff = dayjs().diff(dayjs(t), 'minute')
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  return dayjs(t).format('MM-DD HH:mm')
}

onMounted(() => {
  forumStore.fetchSections()
  fetchList()
})
</script>

<style scoped lang="less">
.forum-home {
  .hot-carousel-card {
    margin-top: 16px;

    .hot-carousel {
      .carousel-item {
        padding: 24px;
        background: linear-gradient(135deg, #e6f7ff, #f0f5ff);
        border-radius: 8px;
        cursor: pointer;

        h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        p {
          color: #666;
          margin-bottom: 12px;
        }

        .carousel-meta {
          display: flex;
          gap: 16px;
          color: #999;
          font-size: 13px;
        }
      }
    }
  }

  .sort-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .posts-list {
    .post-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #fafafa;
      }

      .post-content {
        flex: 1;

        .post-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px;
          color: #333;
        }

        .post-summary {
          color: #666;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-meta {
          display: flex;
          gap: 16px;
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
