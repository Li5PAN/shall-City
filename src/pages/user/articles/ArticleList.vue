<template>
  <div class="article-list-page">
    <!-- 页面头部 -->
    <a-card class="header-card">
      <a-row :gutter="24" align="middle">
        <a-col :span="12">
          <div class="page-header">
            <h2>我的文章</h2>
            <div class="stats-info">
              <a-statistic title="总文章数" :value="stats.total" />
              <a-statistic title="已发布" :value="stats.published" />
              <a-statistic title="草稿" :value="stats.draft" />
              <a-statistic title="总阅读量" :value="stats.totalViews" />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="header-actions">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索文章标题..."
              style="width: 300px; margin-right: 16px;"
              @search="handleSearch"
            />
            <a-button type="primary" @click="goToCreate">
              <EditOutlined />
              写文章
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 筛选和排序 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="4">
          <a-select
            v-model:value="selectedStatus"
            placeholder="文章状态"
            style="width: 100%"
            @change="handleStatusChange"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="published">已发布</a-select-option>
            <a-select-option value="draft">草稿</a-select-option>
            <a-select-option value="reviewing">审核中</a-select-option>
            <a-select-option value="rejected">已拒绝</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="selectedCategory"
            placeholder="文章分类"
            style="width: 100%"
            @change="handleCategoryChange"
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="sortBy"
            style="width: 100%"
            @change="handleSortChange"
          >
            <a-select-option value="latest">最新创建</a-select-option>
            <a-select-option value="updated">最近更新</a-select-option>
            <a-select-option value="views">浏览量</a-select-option>
            <a-select-option value="likes">点赞数</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="12">
          <div class="batch-actions">
            <a-checkbox
              v-model:checked="selectAll"
              :indeterminate="indeterminate"
              @change="handleSelectAll"
            >
              全选
            </a-checkbox>
            <a-button-group style="margin-left: 16px;">
              <a-button :disabled="selectedArticles.length === 0" @click="batchPublish">
                批量发布
              </a-button>
              <a-button :disabled="selectedArticles.length === 0" @click="batchDelete">
                批量删除
              </a-button>
            </a-button-group>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 文章列表 -->
    <a-spin :spinning="loading">
      <div class="articles-container">
        <div
          v-for="article in articles"
          :key="article.id"
          class="article-item"
        >
          <a-card hoverable>
            <div class="article-content">
              <div class="article-checkbox">
                <a-checkbox
                  v-model:checked="selectedArticles"
                  :value="article.id"
                />
              </div>

              <div class="article-cover">
                <img :src="article.coverImage" :alt="article.title" />
                <div class="article-status">
                  <a-tag :color="getStatusColor(article.status)">
                    {{ getStatusText(article.status) }}
                  </a-tag>
                </div>
              </div>

              <div class="article-info">
                <div class="article-header">
                  <h3 class="article-title" @click="goToEdit(article.id)">
                    {{ article.title }}
                  </h3>
                  <div class="article-actions">
                    <a-dropdown>
                      <a-button type="text">
                        <MoreOutlined />
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click="goToEdit(article.id)">
                            <EditOutlined />
                            编辑
                          </a-menu-item>
                          <a-menu-item @click="viewArticle(article.id)" v-if="article.status === 'published'">
                            <EyeOutlined />
                            查看
                          </a-menu-item>
                          <a-menu-item @click="publishArticle(article)" v-if="article.status === 'draft'">
                            <SendOutlined />
                            发布
                          </a-menu-item>
                          <a-menu-item @click="copyArticle(article)">
                            <CopyOutlined />
                            复制
                          </a-menu-item>
                          <a-menu-divider />
                          <a-menu-item @click="deleteArticle(article)" danger>
                            <DeleteOutlined />
                            删除
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </div>

                <div class="article-summary">{{ article.summary }}</div>

                <div class="article-tags">
                  <a-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</a-tag>
                </div>

                <div class="article-meta">
                  <div class="meta-info">
                    <span class="meta-item">
                      <CalendarOutlined />
                      创建：{{ formatTime(article.createdAt) }}
                    </span>
                    <span class="meta-item" v-if="article.updatedAt !== article.createdAt">
                      <EditOutlined />
                      更新：{{ formatTime(article.updatedAt) }}
                    </span>
                  </div>

                  <div class="article-stats">
                    <span class="stat-item">
                      <EyeOutlined />
                      {{ article.stats.views }}
                    </span>
                    <span class="stat-item">
                      <LikeOutlined />
                      {{ article.stats.likes }}
                    </span>
                    <span class="stat-item">
                      <MessageOutlined />
                      {{ article.stats.comments }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>

      <!-- 空状态 -->
      <a-empty v-if="!loading && articles.length === 0" description="还没有文章">
        <a-button type="primary" @click="goToCreate">写第一篇文章</a-button>
      </a-empty>
    </a-spin>

    <!-- 分页 -->
    <div class="pagination-section" v-if="articles.length > 0">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :show-size-changer="true"
        :show-total="(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
        @change="handlePageChange"
        @show-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  EditOutlined,
  EyeOutlined,
  SendOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedArticles = ref([])

// 统计数据
const stats = ref({
  total: 23,
  published: 18,
  draft: 5,
  totalViews: 12580
})

// 分类数据
const categories = ref([
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'ai', name: '人工智能' },
  { id: 'devops', name: 'DevOps' }
])

// 文章列表数据
const articles = ref([
  {
    id: 1,
    title: 'Vue 3.4 新特性深度解析：性能优化与开发体验提升',
    summary: '详细介绍Vue 3.4版本的新特性，包括响应式系统优化、TypeScript支持改进、开发工具增强等内容，帮助开发者更好地理解和使用新版本...',
    coverImage: 'https://via.placeholder.com/300x180/4fc08d/ffffff?text=Vue+3.4',
    status: 'published',
    tags: ['Vue', '前端', '性能优化'],
    stats: {
      views: 1250,
      likes: 89,
      comments: 23
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 2,
    title: 'React Hooks最佳实践指南',
    summary: '从基础到进阶，全面讲解React Hooks的使用方法和最佳实践，包括useState、useEffect、自定义Hooks等内容...',
    coverImage: 'https://via.placeholder.com/300x180/61dafb/ffffff?text=React+Hooks',
    status: 'draft',
    tags: ['React', 'Hooks', '最佳实践'],
    stats: {
      views: 0,
      likes: 0,
      comments: 0
    },
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 3,
    title: 'TypeScript进阶技巧：类型体操与实战应用',
    summary: '深入探讨TypeScript的高级类型系统，包括条件类型、映射类型、模板字面量类型等，结合实际项目案例进行讲解...',
    coverImage: 'https://via.placeholder.com/300x180/3178c6/ffffff?text=TypeScript',
    status: 'reviewing',
    tags: ['TypeScript', '类型系统', '进阶'],
    stats: {
      views: 856,
      likes: 67,
      comments: 12
    },
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  }
])

// 计算属性
const selectAll = computed({
  get: () => selectedArticles.value.length === articles.value.length && articles.value.length > 0,
  set: (val) => {
    if (val) {
      selectedArticles.value = articles.value.map(article => article.id)
    } else {
      selectedArticles.value = []
    }
  }
})

const indeterminate = computed(() => 
  selectedArticles.value.length > 0 && selectedArticles.value.length < articles.value.length
)

// 方法
const handleSearch = () => {
  currentPage.value = 1
  fetchArticles()
}

const handleStatusChange = () => {
  currentPage.value = 1
  fetchArticles()
}

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchArticles()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchArticles()
}

const handleSelectAll = (e) => {
  selectAll.value = e.target.checked
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchArticles()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchArticles()
}

const getStatusColor = (status) => {
  const colors = {
    published: 'green',
    draft: 'orange',
    reviewing: 'blue',
    rejected: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    published: '已发布',
    draft: '草稿',
    reviewing: '审核中',
    rejected: '已拒绝'
  }
  return texts[status] || '未知'
}

const goToCreate = () => {
  router.push('/user/articles/create')
}

const goToEdit = (articleId) => {
  router.push(`/user/articles/edit/${articleId}`)
}

const viewArticle = (articleId) => {
  router.push(`/user/news/${articleId}`)
}

const publishArticle = (article) => {
  Modal.confirm({
    title: '确认发布',
    content: `确定要发布文章"${article.title}"吗？`,
    onOk: async () => {
      try {
        // 模拟发布API
        await new Promise(resolve => setTimeout(resolve, 1000))
        article.status = 'reviewing'
        message.success('文章已提交审核')
      } catch (error) {
        message.error('发布失败')
      }
    }
  })
}

const copyArticle = (article) => {
  Modal.confirm({
    title: '复制文章',
    content: `确定要复制文章"${article.title}"吗？将创建一个草稿副本。`,
    onOk: async () => {
      try {
        // 模拟复制API
        await new Promise(resolve => setTimeout(resolve, 1000))
        message.success('文章已复制到草稿箱')
      } catch (error) {
        message.error('复制失败')
      }
    }
  })
}

const deleteArticle = (article) => {
  Modal.confirm({
    title: '删除文章',
    content: `确定要删除文章"${article.title}"吗？此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        // 模拟删除API
        await new Promise(resolve => setTimeout(resolve, 1000))
        const index = articles.value.findIndex(a => a.id === article.id)
        if (index > -1) {
          articles.value.splice(index, 1)
        }
        message.success('文章已删除')
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

const batchPublish = () => {
  Modal.confirm({
    title: '批量发布',
    content: `确定要发布选中的 ${selectedArticles.value.length} 篇文章吗？`,
    onOk: async () => {
      try {
        // 模拟批量发布API
        await new Promise(resolve => setTimeout(resolve, 1500))
        message.success(`已提交 ${selectedArticles.value.length} 篇文章审核`)
        selectedArticles.value = []
      } catch (error) {
        message.error('批量发布失败')
      }
    }
  })
}

const batchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedArticles.value.length} 篇文章吗？此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        // 模拟批量删除API
        await new Promise(resolve => setTimeout(resolve, 1500))
        articles.value = articles.value.filter(article => !selectedArticles.value.includes(article.id))
        message.success(`已删除 ${selectedArticles.value.length} 篇文章`)
        selectedArticles.value = []
      } catch (error) {
        message.error('批量删除失败')
      }
    }
  })
}

const formatTime = (timeString) => {
  return dayjs(timeString).format('YYYY-MM-DD HH:mm')
}

const fetchArticles = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该根据筛选条件调用实际API
    total.value = 23
    
  } catch (error) {
    message.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped lang="less">
.article-list-page {
  .header-card {
    margin-bottom: 16px;
    
    .page-header {
      h2 {
        margin-bottom: 16px;
        color: #333;
      }
      
      .stats-info {
        display: flex;
        gap: 32px;
        
        :deep(.ant-statistic) {
          text-align: center;
        }
      }
    }
    
    .header-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  
  .filter-card {
    margin-bottom: 16px;
    
    .batch-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  
  .articles-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    
    .article-item {
      .article-content {
        display: flex;
        gap: 12px;
        
        .article-checkbox {
          flex-shrink: 0;
          padding-top: 8px;
        }
        
        .article-cover {
          width: 120px;
          height: 80px;
          flex-shrink: 0;
          position: relative;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
          }
          
          .article-status {
            position: absolute;
            top: 4px;
            right: 4px;
          }
        }
        
        .article-info {
          flex: 1;
          
          .article-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            
            .article-title {
              font-size: 16px;
              font-weight: 600;
              margin: 0;
              color: #333;
              line-height: 1.4;
              cursor: pointer;
              flex: 1;
              
              &:hover {
                color: #1890ff;
              }
            }
            
            .article-actions {
              flex-shrink: 0;
            }
          }
          
          .article-summary {
            color: #666;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .article-tags {
            margin-bottom: 8px;
          }
          
          .article-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .meta-info {
              display: flex;
              flex-direction: column;
              gap: 4px;
              
              .meta-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #999;
                font-size: 12px;
                
                .anticon {
                  font-size: 12px;
                }
              }
            }
            
            .article-stats {
              display: flex;
              gap: 12px;
              
              .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #666;
                font-size: 12px;
                
                .anticon {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
  
  .pagination-section {
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .article-list-page {
    .header-card {
      :deep(.ant-row) {
        flex-direction: column;
        gap: 16px;
        
        .ant-col {
          width: 100% !important;
          max-width: 100% !important;
        }
      }
      
      .header-actions {
        justify-content: stretch;
        
        .ant-input-search {
          width: 100% !important;
          margin-right: 0 !important;
          margin-bottom: 12px;
        }
      }
    }
    
    .articles-container {
      grid-template-columns: 1fr;
      
      .article-item {
        .article-content {
          flex-direction: column;
          
          .article-cover {
            width: 100%;
            height: 150px;
          }
        }
      }
    }
  }
}
</style>