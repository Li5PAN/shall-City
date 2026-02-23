<template>
  <div class="news-detail-page">
    <a-spin :spinning="newsStore.loading">
      <template v-if="article">
        <div class="article-container">
          <!-- 文章标题区 -->
          <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-tags">
              <a-tag v-for="tag in (article.tags || [])" :key="tag" color="blue">{{ tag }}</a-tag>
            </div>
          </div>

          <!-- 作者信息栏 -->
          <div class="author-bar">
            <div class="author-info">
              <a-avatar :src="article.author?.avatar" :size="40" />
              <div class="author-details">
                <div class="author-name">{{ article.author?.name || article.author }}</div>
                <div class="publish-info">
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <span class="separator">·</span>
                  <span><EyeOutlined /> {{ article.stats?.views || article.views || 0 }} 阅读</span>
                </div>
              </div>
            </div>
            <div class="header-actions">
              <a-button @click="toggleLike" :type="isLiked ? 'primary' : 'default'" size="small">
                <template #icon>
                  <LikeFilled v-if="isLiked" />
                  <LikeOutlined v-else />
                </template>
                {{ article.stats?.likes || 0 }}
              </a-button>
              <a-button @click="toggleFavorite" :type="isFavorited ? 'primary' : 'default'" size="small">
                <template #icon>
                  <StarFilled v-if="isFavorited" />
                  <StarOutlined v-else />
                </template>
                收藏
              </a-button>
              <a-button size="small" @click="shareArticle">
                <template #icon><ShareAltOutlined /></template>
                分享
              </a-button>
            </div>
          </div>

          <!-- 正文内容（Markdown 渲染） -->
          <div class="article-content">
            <div class="content-body" v-html="article.content"></div>
          </div>

          <!-- 文章底部统计 + 操作 -->
          <div class="article-footer">
            <div class="footer-stats">
              <span><EyeOutlined /> {{ article.stats?.views || article.views || 0 }} 阅读</span>
              <span><LikeOutlined /> {{ article.stats?.likes || 0 }} 点赞</span>
              <span><MessageOutlined /> {{ article.stats?.comments || 0 }} 评论</span>
            </div>
            <div class="footer-actions">
              <a-button @click="toggleLike" :type="isLiked ? 'primary' : 'default'" size="large">
                <template #icon>
                  <LikeFilled v-if="isLiked" />
                  <LikeOutlined v-else />
                </template>
                {{ isLiked ? '已点赞' : '点赞' }}
              </a-button>
              <a-button @click="toggleFavorite" :type="isFavorited ? 'primary' : 'default'" size="large">
                <template #icon>
                  <StarFilled v-if="isFavorited" />
                  <StarOutlined v-else />
                </template>
                {{ isFavorited ? '已收藏' : '收藏' }}
              </a-button>
            </div>
          </div>
        </div>

        <!-- 评论区域 - 复用 CommentList -->
        <div class="comments-section">
          <a-card title="评论" :bordered="false">
            <CommentList
              :comments="comments"
              :loading="commentsLoading"
              :allow-reply="true"
              @submit="handleCommentSubmit"
              @like="handleCommentLike"
              @delete="handleCommentDelete"
            />
          </a-card>
        </div>

        <!-- 相关推荐 - 复用 ArticleCard -->
        <div v-if="relatedArticles.length > 0" class="related-section">
          <a-card title="相关推荐" :bordered="false">
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12" :md="8" v-for="item in relatedArticles" :key="item.id">
                <ArticleCard :article="item" :show-cover="true" @click="goToArticle" />
              </a-col>
            </a-row>
          </a-card>
        </div>
      </template>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useNewsStore } from '@/stores/news'
import ArticleCard from '@/components/business/ArticleCard.vue'
import CommentList from '@/components/business/CommentList.vue'
import {
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  EyeOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

// 本地状态
const isLiked = ref(false)
const isFavorited = ref(false)
const commentsLoading = ref(false)
const comments = ref([])
const relatedArticles = ref([])

// 从 store 获取当前资讯
const article = computed(() => newsStore.currentNews)

const formatDate = (dateString) => {
  return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm') : ''
}

// 加载资讯详情
const loadDetail = async (id) => {
  await newsStore.fetchNewsDetail(id)

  // 设置本地交互状态
  if (newsStore.currentNews) {
    isLiked.value = !!newsStore.currentNews.isLiked
    isFavorited.value = !!newsStore.currentNews.isFavorited
    comments.value = newsStore.currentNews.comments || []
    relatedArticles.value = newsStore.currentNews.relatedArticles || []
  }
}

// 点赞
const toggleLike = async () => {
  if (!article.value) return
  isLiked.value = !isLiked.value
  if (article.value.stats) {
    article.value.stats.likes += isLiked.value ? 1 : -1
  }
  message.success(isLiked.value ? '点赞成功' : '取消点赞')
}

// 收藏
const toggleFavorite = async () => {
  if (!article.value) return
  isFavorited.value = !isFavorited.value
  message.success(isFavorited.value ? '收藏成功' : '取消收藏')
}

// 分享
const shareArticle = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    message.success('链接已复制到剪贴板')
  }).catch(() => {
    message.error('分享失败')
  })
}

// 评论操作
const handleCommentSubmit = (content, parentId) => {
  const newComment = {
    id: Date.now(),
    content,
    author: { name: '当前用户', avatar: '' },
    likes: 0,
    createdAt: new Date().toISOString(),
  }
  if (parentId) {
    const parent = comments.value.find(c => c.id === parentId)
    if (parent) {
      if (!parent.replies) parent.replies = []
      parent.replies.push(newComment)
    }
  } else {
    comments.value.unshift(newComment)
  }
  if (article.value?.stats) {
    article.value.stats.comments = (article.value.stats.comments || 0) + 1
  }
  message.success('评论发表成功')
}

const handleCommentLike = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likes = (comment.likes || 0) + 1
  }
}

const handleCommentDelete = (commentId) => {
  comments.value = comments.value.filter(c => c.id !== commentId)
  message.success('评论已删除')
}

// 跳转相关文章
const goToArticle = (articleId) => {
  router.push(`/user/news/${articleId}`)
}

// 监听路由参数变化（同页面跳转）
watch(() => route.params.id, (newId) => {
  if (newId) loadDetail(newId)
})

onMounted(() => {
  if (route.params.id) {
    loadDetail(route.params.id)
  }
})
</script>

<style scoped lang="less">
.news-detail-page {
  max-width: 800px;
  margin: 0 auto;

  .article-container {
    background: #fff;
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .article-header {
      margin-bottom: 20px;

      .article-title {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .author-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      margin-bottom: 24px;
      border-bottom: 1px solid #f0f0f0;

      .author-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .author-details {
          .author-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 2px;
          }

          .publish-info {
            font-size: 13px;
            color: #999;

            .separator {
              margin: 0 6px;
            }
          }
        }
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }

    .article-content {
      .content-body {
        font-size: 16px;
        line-height: 1.8;
        color: #333;

        :deep(h2) {
          font-size: 22px;
          font-weight: 600;
          margin: 28px 0 14px;
        }

        :deep(p) {
          margin-bottom: 14px;
        }

        :deep(pre) {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 16px 0;
        }

        :deep(code) {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Monaco', 'Consolas', monospace;
        }

        :deep(img) {
          max-width: 100%;
          border-radius: 6px;
        }
      }
    }

    .article-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;

      .footer-stats {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;
        color: #666;
        font-size: 14px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .footer-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
      }
    }
  }

  .comments-section {
    margin-bottom: 24px;
  }

  .related-section {
    margin-bottom: 24px;
  }
}
</style>
