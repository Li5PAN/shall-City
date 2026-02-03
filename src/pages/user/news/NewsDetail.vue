<template>
  <div class="news-detail-page">
    <a-spin :spinning="loading">
      <div class="article-container">
        <!-- 文章头部 -->
        <div class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          
          <div class="article-meta">
            <div class="author-info">
              <a-avatar :src="article.author?.avatar" :size="40" />
              <div class="author-details">
                <div class="author-name">{{ article.author?.name }}</div>
                <div class="publish-info">
                  <span>{{ formatDate(article.createdAt) }}</span>
                  <span class="separator">·</span>
                  <span>{{ article.stats?.views }} 阅读</span>
                </div>
              </div>
            </div>
            
            <div class="article-actions">
              <a-button @click="toggleLike" :type="article.isLiked ? 'primary' : 'default'">
                <template #icon>
                  <LikeOutlined v-if="!article.isLiked" />
                  <LikeFilled v-else />
                </template>
                {{ article.stats?.likes }}
              </a-button>
              
              <a-button @click="toggleFavorite" :type="article.isFavorited ? 'primary' : 'default'">
                <template #icon>
                  <StarOutlined v-if="!article.isFavorited" />
                  <StarFilled v-else />
                </template>
                收藏
              </a-button>
              
              <a-button @click="shareArticle">
                <template #icon><ShareAltOutlined /></template>
                分享
              </a-button>
            </div>
          </div>
          
          <div class="article-tags">
            <a-tag v-for="tag in article.tags" :key="tag" color="blue">{{ tag }}</a-tag>
          </div>
        </div>
        
        <!-- 文章内容 -->
        <div class="article-content">
          <div class="content-body" v-html="article.content"></div>
        </div>
        
        <!-- 文章底部 -->
        <div class="article-footer">
          <div class="article-stats">
            <span><EyeOutlined /> {{ article.stats?.views }} 阅读</span>
            <span><LikeOutlined /> {{ article.stats?.likes }} 点赞</span>
            <span><MessageOutlined /> {{ article.stats?.comments }} 评论</span>
          </div>
          
          <div class="article-actions">
            <a-button @click="toggleLike" :type="article.isLiked ? 'primary' : 'default'" size="large">
              <template #icon>
                <LikeOutlined v-if="!article.isLiked" />
                <LikeFilled v-else />
              </template>
              {{ article.isLiked ? '已点赞' : '点赞' }}
            </a-button>
            
            <a-button @click="toggleFavorite" :type="article.isFavorited ? 'primary' : 'default'" size="large">
              <template #icon>
                <StarOutlined v-if="!article.isFavorited" />
                <StarFilled v-else />
              </template>
              {{ article.isFavorited ? '已收藏' : '收藏' }}
            </a-button>
          </div>
        </div>
      </div>
      
      <!-- 评论区域 -->
      <div class="comments-section">
        <a-card title="评论" :bordered="false">
          <!-- 发表评论 -->
          <div class="comment-form">
            <a-textarea
              v-model:value="commentText"
              placeholder="写下你的评论..."
              :rows="3"
              :maxlength="500"
              show-count
            />
            <div class="comment-actions">
              <a-button type="primary" @click="submitComment" :loading="submittingComment">
                发表评论
              </a-button>
            </div>
          </div>
          
          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <a-avatar :src="comment.author.avatar" :size="32" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="author-name">{{ comment.author.name }}</span>
                  <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <div class="comment-text">{{ comment.content }}</div>
                <div class="comment-actions">
                  <a-button type="text" size="small" @click="likeComment(comment.id)">
                    <template #icon><LikeOutlined /></template>
                    {{ comment.likes }}
                  </a-button>
                  <a-button type="text" size="small" @click="replyComment(comment.id)">
                    回复
                  </a-button>
                </div>
              </div>
            </div>
            
            <div v-if="comments.length === 0" class="no-comments">
              暂无评论，快来发表第一条评论吧！
            </div>
          </div>
        </a-card>
      </div>
      
      <!-- 相关文章 -->
      <div class="related-articles">
        <a-card title="相关文章" :bordered="false">
          <a-row :gutter="[16, 16]">
            <a-col :span="8" v-for="relatedArticle in relatedArticles" :key="relatedArticle.id">
              <a-card hoverable size="small" @click="goToArticle(relatedArticle.id)">
                <template #cover>
                  <img :src="relatedArticle.coverImage" :alt="relatedArticle.title" />
                </template>
                <a-card-meta :title="relatedArticle.title" :description="relatedArticle.summary" />
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  EyeOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const submittingComment = ref(false)
const commentText = ref('')

// 文章数据
const article = ref({
  id: null,
  title: '',
  content: '',
  author: {},
  stats: {},
  tags: [],
  isLiked: false,
  isFavorited: false,
  createdAt: ''
})

// 评论数据
const comments = ref([])

// 相关文章
const relatedArticles = ref([])

// 方法
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const toggleLike = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    article.value.isLiked = !article.value.isLiked
    article.value.stats.likes += article.value.isLiked ? 1 : -1
    
    message.success(article.value.isLiked ? '点赞成功' : '取消点赞')
  } catch (error) {
    message.error('操作失败')
  }
}

const toggleFavorite = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    article.value.isFavorited = !article.value.isFavorited
    
    message.success(article.value.isFavorited ? '收藏成功' : '取消收藏')
  } catch (error) {
    message.error('操作失败')
  }
}

const shareArticle = () => {
  // 复制链接到剪贴板
  navigator.clipboard.writeText(window.location.href).then(() => {
    message.success('链接已复制到剪贴板')
  }).catch(() => {
    message.error('分享失败')
  })
}

const submitComment = async () => {
  if (!commentText.value.trim()) {
    message.warning('请输入评论内容')
    return
  }
  
  submittingComment.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 添加新评论到列表
    const newComment = {
      id: Date.now(),
      content: commentText.value,
      author: {
        name: '当前用户',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      likes: 0,
      createdAt: new Date().toISOString()
    }
    
    comments.value.unshift(newComment)
    commentText.value = ''
    article.value.stats.comments += 1
    
    message.success('评论发表成功')
  } catch (error) {
    message.error('评论发表失败')
  } finally {
    submittingComment.value = false
  }
}

const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likes += 1
    message.success('点赞成功')
  }
}

const replyComment = (commentId) => {
  message.info('回复功能开发中...')
}

const goToArticle = (articleId) => {
  router.push(`/user/news/${articleId}`)
}

const fetchArticle = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟文章数据
    article.value = {
      id: route.params.id,
      title: 'Vue 3.4 正式发布：性能优化与新特性详解',
      content: `
        <p>Vue 3.4 版本正式发布了！这个版本带来了许多令人兴奋的新特性和性能改进。</p>
        
        <h2>主要新特性</h2>
        <p>1. <strong>更好的TypeScript支持</strong>：改进了类型推断和错误提示。</p>
        <p>2. <strong>性能优化</strong>：渲染性能提升了15%，内存使用减少了10%。</p>
        <p>3. <strong>新的组合式API</strong>：增加了更多实用的组合式函数。</p>
        
        <h2>升级指南</h2>
        <p>升级到Vue 3.4非常简单，大部分应用都可以无缝升级。</p>
        
        <pre><code>npm install vue@latest</code></pre>
        
        <p>更多详细信息请查看官方文档。</p>
      `,
      author: {
        name: '前端小王',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      stats: {
        views: 1250,
        likes: 89,
        comments: 23
      },
      tags: ['Vue', '前端', '性能优化'],
      isLiked: false,
      isFavorited: false,
      createdAt: '2024-01-15T10:30:00Z'
    }
    
    // 模拟评论数据
    comments.value = [
      {
        id: 1,
        content: '很好的文章，学到了很多！',
        author: {
          name: '技术爱好者',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        },
        likes: 5,
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 2,
        content: 'Vue 3.4的性能提升确实很明显',
        author: {
          name: '前端开发者',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        },
        likes: 3,
        createdAt: '2024-01-15T12:30:00Z'
      }
    ]
    
    // 模拟相关文章
    relatedArticles.value = [
      {
        id: 2,
        title: 'React 18 并发特性深度解析',
        summary: 'React 18 引入了并发渲染等重要特性...',
        coverImage: 'https://via.placeholder.com/200x120/61dafb/ffffff?text=React'
      },
      {
        id: 3,
        title: '前端性能优化最佳实践',
        summary: '分享前端性能优化的实用技巧...',
        coverImage: 'https://via.placeholder.com/200x120/f39c12/ffffff?text=Performance'
      },
      {
        id: 4,
        title: 'TypeScript 5.0 新特性介绍',
        summary: 'TypeScript 5.0 带来了哪些新功能...',
        coverImage: 'https://via.placeholder.com/200x120/3178c6/ffffff?text=TypeScript'
      }
    ]
    
  } catch (error) {
    message.error('获取文章失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped lang="less">
.news-detail-page {
  max-width: 800px;
  margin: 0 auto;
  
  .article-container {
    background: white;
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .article-header {
      margin-bottom: 32px;
      
      .article-title {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        margin-bottom: 24px;
      }
      
      .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .author-details {
            .author-name {
              font-weight: 600;
              color: #333;
              margin-bottom: 4px;
            }
            
            .publish-info {
              font-size: 14px;
              color: #666;
              
              .separator {
                margin: 0 8px;
              }
            }
          }
        }
        
        .article-actions {
          display: flex;
          gap: 8px;
        }
      }
      
      .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
    
    .article-content {
      .content-body {
        font-size: 16px;
        line-height: 1.8;
        color: #333;
        
        :deep(h2) {
          font-size: 24px;
          font-weight: 600;
          margin: 32px 0 16px 0;
          color: #333;
        }
        
        :deep(p) {
          margin-bottom: 16px;
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
      }
    }
    
    .article-footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
      
      .article-stats {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
        color: #666;
        
        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
      
      .article-actions {
        display: flex;
        justify-content: center;
        gap: 16px;
      }
    }
  }
  
  .comments-section {
    margin-bottom: 24px;
    
    .comment-form {
      margin-bottom: 24px;
      
      .comment-actions {
        margin-top: 12px;
        text-align: right;
      }
    }
    
    .comments-list {
      .comment-item {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        
        .comment-content {
          flex: 1;
          
          .comment-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
            
            .author-name {
              font-weight: 600;
              color: #333;
            }
            
            .comment-time {
              font-size: 12px;
              color: #999;
            }
          }
          
          .comment-text {
            color: #333;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          
          .comment-actions {
            display: flex;
            gap: 8px;
          }
        }
      }
      
      .no-comments {
        text-align: center;
        color: #999;
        padding: 32px 0;
      }
    }
  }
  
  .related-articles {
    :deep(.ant-card-cover) img {
      height: 120px;
      object-fit: cover;
    }
    
    :deep(.ant-card-meta-title) {
      font-size: 14px;
      line-height: 1.4;
    }
    
    :deep(.ant-card-meta-description) {
      font-size: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>