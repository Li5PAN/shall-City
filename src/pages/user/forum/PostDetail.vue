<template>
  <div class="post-detail">
    <a-spin :spinning="forumStore.loading">
      <template v-if="post">
        <!-- 帖子标题 + 作者信息 -->
        <a-card class="post-header-card">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-author-bar">
            <UserAvatar :user="post.author || {}" size="default" />
            <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            <a-tag v-if="post.section" color="blue">{{ post.section }}</a-tag>
          </div>
          <div class="post-stats">
            <span><EyeOutlined /> {{ post.views || 0 }} 浏览</span>
            <span><LikeOutlined /> {{ post.likes || 0 }} 点赞</span>
            <span><MessageOutlined /> {{ post.commentCount || 0 }} 评论</span>
          </div>
        </a-card>

        <!-- 帖子正文 -->
        <a-card class="post-body-card">
          <div class="post-content" v-html="post.content || ''"></div>
          <div v-if="post.tags && post.tags.length" class="post-tags">
            <a-tag v-for="tag in post.tags" :key="tag">{{ tag }}</a-tag>
          </div>
        </a-card>

        <!-- 点赞/收藏操作栏 -->
        <div class="action-bar">
          <a-button
            :type="post.isLiked ? 'primary' : 'default'"
            @click="handleLike"
          >
            <LikeOutlined /> {{ post.isLiked ? '已点赞' : '点赞' }}
          </a-button>
          <a-button
            :type="post.isFavorited ? 'primary' : 'default'"
            @click="handleFavorite"
          >
            <StarOutlined /> {{ post.isFavorited ? '已收藏' : '收藏' }}
          </a-button>
          <a-button @click="goBack">
            <ArrowLeftOutlined /> 返回列表
          </a-button>
        </div>

        <!-- 评论列表 -->
        <a-card title="评论区" class="comments-card">
          <CommentList
            :comments="post.comments || []"
            :loading="false"
            :allow-reply="true"
            @submit="handleCommentSubmit"
            @like="handleCommentLike"
            @delete="handleCommentDelete"
          />
        </a-card>
      </template>

      <EmptyState v-if="!forumStore.loading && !post" description="帖子不存在或已被删除" />
    </a-spin>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  EyeOutlined, LikeOutlined, MessageOutlined,
  StarOutlined, ArrowLeftOutlined
} from '@ant-design/icons-vue'
import UserAvatar from '@/components/business/UserAvatar.vue'
import CommentList from '@/components/business/CommentList.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useForumStore } from '@/stores/forum'

const route = useRoute()
const router = useRouter()
const forumStore = useForumStore()

const post = computed(() => forumStore.currentPost)

const handleLike = async () => {
  try {
    await forumStore.likePost(route.params.id)
    message.success('操作成功')
    forumStore.fetchPostDetail(route.params.id)
  } catch {
    // handled in store
  }
}

const handleFavorite = async () => {
  try {
    await forumStore.favoritePost(route.params.id)
    message.success('操作成功')
    forumStore.fetchPostDetail(route.params.id)
  } catch {
    // handled in store
  }
}

const handleCommentSubmit = (content, parentId) => {
  message.success('评论已提交')
}

const handleCommentLike = (commentId) => {
  message.success('已点赞')
}

const handleCommentDelete = (commentId) => {
  message.success('已删除')
}

const goBack = () => router.push('/user/forum')

const formatTime = (t) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''

onMounted(() => {
  const id = route.params.id
  if (id) forumStore.fetchPostDetail(id)
})
</script>

<style scoped lang="less">
.post-detail {
  .post-header-card {
    margin-bottom: 16px;

    .post-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px;
    }

    .post-author-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .post-time {
        color: #999;
        font-size: 13px;
      }
    }

    .post-stats {
      display: flex;
      gap: 20px;
      color: #666;
      font-size: 13px;
    }
  }

  .post-body-card {
    margin-bottom: 16px;

    .post-content {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
    }

    .post-tags {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
  }

  .action-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
  }

  .comments-card {
    margin-bottom: 16px;
  }
}
</style>
