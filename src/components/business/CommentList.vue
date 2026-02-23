<template>
  <div class="comment-list">
    <div class="comment-list__input">
      <a-textarea
        v-model:value="newComment"
        placeholder="写下你的评论..."
        :rows="3"
        :maxlength="500"
        show-count
      />
      <a-button
        type="primary"
        :disabled="!newComment.trim()"
        style="margin-top: 8px"
        @click="handleSubmit(null)"
      >
        发表评论
      </a-button>
    </div>

    <a-spin :spinning="loading">
      <div v-if="comments.length === 0 && !loading" class="comment-list__empty">
        <a-empty description="暂无评论" />
      </div>

      <div v-for="comment in comments" :key="comment.id" class="comment-list__item">
        <div class="comment-list__item-header">
          <UserAvatar :user="comment.author || {}" size="small" />
          <span class="comment-list__item-time">{{ formatTime(comment.createdAt) }}</span>
        </div>
        <div class="comment-list__item-content">{{ comment.content }}</div>
        <div class="comment-list__item-actions">
          <a-button type="link" size="small" @click="handleLike(comment.id)">
            <LikeOutlined /> {{ comment.likes || 0 }}
          </a-button>
          <a-button v-if="allowReply" type="link" size="small" @click="toggleReply(comment.id)">
            <MessageOutlined /> 回复
          </a-button>
          <a-popconfirm title="确定删除此评论？" @confirm="handleDelete(comment.id)">
            <a-button type="link" size="small" danger>
              <DeleteOutlined /> 删除
            </a-button>
          </a-popconfirm>
        </div>

        <!-- Reply input -->
        <div v-if="replyingTo === comment.id" class="comment-list__reply-input">
          <a-textarea
            v-model:value="replyContent"
            placeholder="写下你的回复..."
            :rows="2"
            :maxlength="500"
          />
          <a-space style="margin-top: 8px">
            <a-button type="primary" size="small" :disabled="!replyContent.trim()" @click="handleSubmit(comment.id)">
              回复
            </a-button>
            <a-button size="small" @click="replyingTo = null">取消</a-button>
          </a-space>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies && comment.replies.length" class="comment-list__replies">
          <div v-for="reply in comment.replies" :key="reply.id" class="comment-list__reply-item">
            <div class="comment-list__item-header">
              <UserAvatar :user="reply.author || {}" size="small" />
              <span class="comment-list__item-time">{{ formatTime(reply.createdAt) }}</span>
            </div>
            <div class="comment-list__item-content">{{ reply.content }}</div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { LikeOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import UserAvatar from './UserAvatar.vue'

defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  allowReply: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['submit', 'like', 'delete'])

const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref(null)

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''
}

const toggleReply = (commentId) => {
  replyingTo.value = replyingTo.value === commentId ? null : commentId
  replyContent.value = ''
}

const handleSubmit = (parentId) => {
  const content = parentId ? replyContent.value.trim() : newComment.value.trim()
  if (!content) return
  emit('submit', content, parentId)
  if (parentId) {
    replyContent.value = ''
    replyingTo.value = null
  } else {
    newComment.value = ''
  }
}

const handleLike = (commentId) => {
  emit('like', commentId)
}

const handleDelete = (commentId) => {
  emit('delete', commentId)
}
</script>

<style scoped lang="less">
.comment-list {
  &__input {
    margin-bottom: 24px;
  }

  &__empty {
    padding: 32px 0;
  }

  &__item {
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    &-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    &-time {
      font-size: 12px;
      color: #999;
    }

    &-content {
      font-size: 14px;
      color: #333;
      line-height: 1.6;
      margin-bottom: 8px;
      padding-left: 32px;
    }

    &-actions {
      padding-left: 32px;
    }
  }

  &__reply-input {
    padding-left: 32px;
    margin-top: 8px;
  }

  &__replies {
    padding-left: 32px;
    margin-top: 8px;
    border-left: 2px solid #f0f0f0;
  }

  &__reply-item {
    padding: 8px 0 8px 12px;
  }
}
</style>
