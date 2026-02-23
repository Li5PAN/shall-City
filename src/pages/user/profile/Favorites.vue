<template>
  <div class="favorites-page">
    <!-- 标签页切换：收藏的帖子 / 收藏的服务 -->
    <a-card>
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="post" tab="收藏的帖子">
          <a-spin :spinning="loading">
            <div v-if="postFavorites.length > 0" class="favorites-list">
              <div v-for="item in postFavorites" :key="item.id" class="favorite-item">
                <div class="favorite-info">
                  <h4 class="favorite-title" @click="goToPost(item.id)">{{ item.title }}</h4>
                  <p class="favorite-desc">{{ item.description }}</p>
                  <div class="favorite-meta">
                    <span>
                      <a-avatar :src="item.author?.avatar" :size="20">
                        <template #icon><UserOutlined /></template>
                      </a-avatar>
                      {{ item.author?.name || '匿名' }}
                    </span>
                    <span>收藏于 {{ formatTime(item.favoriteTime) }}</span>
                    <span><EyeOutlined /> {{ item.stats?.views || 0 }}</span>
                    <span><LikeOutlined /> {{ item.stats?.likes || 0 }}</span>
                  </div>
                </div>
                <div class="favorite-actions">
                  <a-popconfirm title="确定取消收藏？" @confirm="removeFavorite(item, 'post')">
                    <a-button type="link" danger>
                      <HeartFilled style="color: #ff4d4f;" /> 取消收藏
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
            </div>
            <EmptyState v-if="!loading && postFavorites.length === 0" description="暂无收藏的帖子" />
          </a-spin>

          <PaginationWrapper
            v-if="postFavorites.length > 0"
            :total="postTotal"
            :current="currentPage"
            :page-size="pageSize"
            @change="handlePageChange"
          />
        </a-tab-pane>

        <a-tab-pane key="service" tab="收藏的服务">
          <a-spin :spinning="loading">
            <a-row v-if="serviceFavorites.length > 0" :gutter="[16, 16]">
              <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in serviceFavorites" :key="item.id">
                <ServiceCard :service="item" mode="grid" @click="goToService" />
              </a-col>
            </a-row>
            <EmptyState v-if="!loading && serviceFavorites.length === 0" description="暂无收藏的服务" />
          </a-spin>

          <PaginationWrapper
            v-if="serviceFavorites.length > 0"
            :total="serviceTotal"
            :current="currentPage"
            :page-size="pageSize"
            @change="handlePageChange"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { HeartFilled, EyeOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons-vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ServiceCard from '@/components/business/ServiceCard.vue'

const router = useRouter()

const activeTab = ref('post')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const postTotal = ref(0)
const serviceTotal = ref(0)

const postFavorites = ref([])
const serviceFavorites = ref([])

const handleTabChange = (key) => {
  activeTab.value = key
  currentPage.value = 1
  fetchFavorites()
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchFavorites()
}

const fetchFavorites = async () => {
  loading.value = true
  try {
    // Simulated API call — replace with actual store/api integration
    await new Promise(resolve => setTimeout(resolve, 300))
    if (activeTab.value === 'post') {
      postTotal.value = postFavorites.value.length
    } else {
      serviceTotal.value = serviceFavorites.value.length
    }
  } catch {
    message.error('获取收藏列表失败')
  } finally {
    loading.value = false
  }
}

const removeFavorite = (item, type) => {
  if (type === 'post') {
    postFavorites.value = postFavorites.value.filter(f => f.id !== item.id)
    postTotal.value--
  } else {
    serviceFavorites.value = serviceFavorites.value.filter(f => f.id !== item.id)
    serviceTotal.value--
  }
  message.success('已取消收藏')
}

const goToPost = (id) => router.push(`/user/forum/post/${id}`)
const goToService = (id) => router.push(`/user/services/${id}`)

const formatTime = (t) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped lang="less">
.favorites-page {
  .favorites-list {
    .favorite-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .favorite-info {
        flex: 1;

        .favorite-title {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px;
          color: #333;
          cursor: pointer;

          &:hover {
            color: #1890ff;
          }
        }

        .favorite-desc {
          color: #666;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .favorite-meta {
          display: flex;
          gap: 16px;
          align-items: center;
          font-size: 13px;
          color: #999;
        }
      }

      .favorite-actions {
        flex-shrink: 0;
        margin-left: 16px;
      }
    }
  }
}
</style>
