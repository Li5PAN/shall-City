<template>
  <div class="my-likes">
    <a-card title="我的点赞">
      <a-spin :spinning="forumStore.loading">
        <div v-if="forumStore.myLikes.length > 0" class="likes-list">
          <div v-for="item in forumStore.myLikes" :key="item.id" class="like-item">
            <div class="like-info">
              <h4 class="like-title" @click="goToDetail(item.postId || item.id)">
                {{ item.title }}
              </h4>
              <div class="like-meta">
                <span class="like-author">{{ item.author?.name || item.authorName || '匿名' }}</span>
                <span class="like-time">点赞于 {{ formatTime(item.likedAt || item.createdAt) }}</span>
              </div>
            </div>
            <div class="like-actions">
              <a-button type="link" @click="goToDetail(item.postId || item.id)">
                <EyeOutlined /> 查看帖子
              </a-button>
              <a-popconfirm title="确定取消点赞？" @confirm="handleUnlike(item.postId || item.id)">
                <a-button type="link" danger>
                  <LikeOutlined /> 取消点赞
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>

        <EmptyState v-if="!forumStore.loading && forumStore.myLikes.length === 0" description="暂无点赞记录">
          <template #action>
            <a-button type="primary" @click="goToForum">去论坛逛逛</a-button>
          </template>
        </EmptyState>
      </a-spin>

      <PaginationWrapper
        v-if="forumStore.myLikes.length > 0"
        :total="forumStore.pagination.total"
        :current="forumStore.pagination.current"
        :page-size="forumStore.pagination.pageSize"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { EyeOutlined, LikeOutlined } from '@ant-design/icons-vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useForumStore } from '@/stores/forum'

const router = useRouter()
const forumStore = useForumStore()

const handlePageChange = (page, pageSize) => {
  forumStore.pagination.current = page
  forumStore.pagination.pageSize = pageSize
  forumStore.fetchMyLikes({ current: page, pageSize })
}

const goToDetail = (id) => router.push(`/user/forum/post/${id}`)
const goToForum = () => router.push('/user/forum')

const handleUnlike = async (id) => {
  try {
    await forumStore.likePost(id)
    message.success('已取消点赞')
    forumStore.fetchMyLikes()
  } catch {
    // handled in store
  }
}

const formatTime = (t) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''

onMounted(() => {
  forumStore.fetchMyLikes()
})
</script>

<style scoped lang="less">
.my-likes {
  .likes-list {
    .like-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .like-info {
        flex: 1;

        .like-title {
          font-size: 15px;
          font-weight: 500;
          margin: 0 0 8px;
          color: #333;
          cursor: pointer;

          &:hover {
            color: #1890ff;
          }
        }

        .like-meta {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #999;
        }
      }

      .like-actions {
        flex-shrink: 0;
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
