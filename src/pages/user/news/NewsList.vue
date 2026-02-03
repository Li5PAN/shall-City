<template>
  <div class="news-list-page">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <a-row :gutter="16" align="middle">
        <a-col :span="8">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索文章标题、内容..."
            @search="handleSearch"
            size="large"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="selectedCategory"
            placeholder="选择分类"
            size="large"
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
            size="large"
            style="width: 100%"
            @change="handleSortChange"
          >
            <a-select-option value="latest">最新发布</a-select-option>
            <a-select-option value="popular">最受欢迎</a-select-option>
            <a-select-option value="views">浏览最多</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <div class="tag-filter">
            <a-tag
              v-for="tag in popularTags"
              :key="tag"
              :color="selectedTags.includes(tag) ? 'blue' : 'default'"
              style="cursor: pointer; margin-bottom: 8px;"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </a-tag>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 文章列表 -->
      <div class="articles-section">
        <a-spin :spinning="loading">
          <a-row :gutter="[0, 16]">
            <a-col :span="24" v-for="article in articles" :key="article.id">
              <a-card hoverable class="article-card" @click="goToDetail(article.id)">
                <div class="article-content">
                  <div class="article-cover">
                    <img :src="article.coverImage" :alt="article.title" />
                  </div>
                  
                  <div class="article-info">
                    <div class="article-header">
                      <h3 class="article-title">{{ article.title }}</h3>
                      <div class="article-tags">
                        <a-tag v-for="tag in article.tags" :key="tag" color="blue">{{ tag }}</a-tag>
                      </div>
                    </div>
                    
                    <p class="article-summary">{{ article.summary }}</p>
                    
                    <div class="article-meta">
                      <div class="author-info">
                        <a-avatar :src="article.author.avatar" :size="32" />
                        <span class="author-name">{{ article.author.name }}</span>
                        <span class="publish-time">{{ formatTime(article.createdAt) }}</span>
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
            </a-col>
          </a-row>
          
          <!-- 空状态 -->
          <a-empty v-if="!loading && articles.length === 0" description="暂无文章" />
        </a-spin>

        <!-- 分页 -->
        <div class="pagination-section" v-if="articles.length > 0">
          <a-pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :show-total="(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
            @change="handlePageChange"
            @show-size-change="handlePageSizeChange"
          />
        </div>
      </div>

      <!-- 推荐文章侧边栏 -->
      <div class="sidebar">
        <a-card title="热门文章" size="small">
          <div class="hot-articles">
            <div
              v-for="(article, index) in hotArticles"
              :key="article.id"
              class="hot-article-item"
              @click="goToDetail(article.id)"
            >
              <span class="rank-number" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <div class="hot-article-info">
                <h4>{{ article.title }}</h4>
                <div class="hot-article-stats">
                  <span>{{ article.stats.views }} 阅读</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
        
        <a-card title="热门标签" size="small" style="margin-top: 16px;">
          <div class="hot-tags">
            <a-tag
              v-for="tag in hotTags"
              :key="tag.name"
              color="blue"
              style="margin-bottom: 8px; cursor: pointer;"
              @click="filterByTag(tag.name)"
            >
              {{ tag.name }} ({{ tag.count }})
            </a-tag>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const sortBy = ref('latest')
const selectedTags = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 分类数据
const categories = ref([
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'ai', name: '人工智能' },
  { id: 'blockchain', name: '区块链' },
  { id: 'devops', name: 'DevOps' }
])

// 热门标签
const popularTags = ref(['Vue', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Docker', 'Kubernetes'])

// 文章列表数据（模拟）
const articles = ref([
  {
    id: 1,
    title: 'Vue 3.4 正式发布：性能优化与新特性详解',
    summary: 'Vue 3.4 带来了显著的性能提升和多项新特性，包括更好的TypeScript支持、优化的响应式系统等。本文将详细介绍这些改进...',
    coverImage: 'https://via.placeholder.com/300x200/4fc08d/ffffff?text=Vue+3.4',
    tags: ['Vue', '前端', '性能优化'],
    author: {
      name: '前端小王',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 1250,
      likes: 89,
      comments: 23
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: '微服务架构实战：从单体到分布式的演进之路',
    summary: '本文将分享我们团队从单体应用迁移到微服务架构的完整经验，包括技术选型、架构设计、部署策略等实战内容...',
    coverImage: 'https://via.placeholder.com/300x200/1890ff/ffffff?text=Microservices',
    tags: ['微服务', '架构', 'Spring Cloud'],
    author: {
      name: '架构师老李',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 2100,
      likes: 156,
      comments: 45
    },
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    title: 'React 18 并发特性深度解析',
    summary: 'React 18 引入了并发渲染、Suspense 改进等重要特性。本文将深入探讨这些特性的原理和使用场景...',
    coverImage: 'https://via.placeholder.com/300x200/61dafb/ffffff?text=React+18',
    tags: ['React', '并发', '性能'],
    author: {
      name: 'React专家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 1800,
      likes: 134,
      comments: 67
    },
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    title: 'Docker 容器化部署最佳实践',
    summary: '容器化已成为现代应用部署的标准。本文总结了 Docker 在生产环境中的最佳实践，包括镜像优化、安全配置等...',
    coverImage: 'https://via.placeholder.com/300x200/2496ed/ffffff?text=Docker',
    tags: ['Docker', 'DevOps', '容器化'],
    author: {
      name: 'DevOps工程师',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 1650,
      likes: 98,
      comments: 34
    },
    createdAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 5,
    title: 'Python 数据分析实战：从数据清洗到可视化',
    summary: '使用 Python 进行数据分析的完整流程，包括数据获取、清洗、分析和可视化。适合数据分析初学者...',
    coverImage: 'https://via.placeholder.com/300x200/3776ab/ffffff?text=Python+Data',
    tags: ['Python', '数据分析', 'Pandas'],
    author: {
      name: '数据科学家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 2300,
      likes: 187,
      comments: 56
    },
    createdAt: '2024-01-11T11:20:00Z'
  }
])

// 热门文章
const hotArticles = ref([
  { id: 1, title: 'Vue 3.4 正式发布：性能优化与新特性详解', stats: { views: 1250 } },
  { id: 2, title: '微服务架构实战：从单体到分布式的演进之路', stats: { views: 2100 } },
  { id: 3, title: 'React 18 并发特性深度解析', stats: { views: 1800 } },
  { id: 4, title: 'Docker 容器化部署最佳实践', stats: { views: 1650 } },
  { id: 5, title: 'Python 数据分析实战：从数据清洗到可视化', stats: { views: 2300 } }
])

// 热门标签
const hotTags = ref([
  { name: 'Vue', count: 156 },
  { name: 'React', count: 134 },
  { name: 'Node.js', count: 98 },
  { name: 'Python', count: 187 },
  { name: 'Docker', count: 76 },
  { name: '微服务', count: 65 }
])

// 方法
const handleSearch = () => {
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

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
  fetchArticles()
}

const filterByTag = (tag) => {
  selectedTags.value = [tag]
  currentPage.value = 1
  fetchArticles()
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

const goToDetail = (id) => {
  router.push(`/user/news/${id}`)
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
    total.value = 50
    
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped lang="less">
.news-list-page {
  .search-section {
    margin-bottom: 24px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .tag-filter {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
  
  .main-content {
    display: flex;
    gap: 24px;
    
    .articles-section {
      flex: 1;
      
      .article-card {
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        :deep(.ant-card-body) {
          padding: 20px;
        }
      }
      
      .article-content {
        display: flex;
        gap: 20px;
        
        .article-cover {
          width: 200px;
          height: 120px;
          flex-shrink: 0;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
          }
        }
        
        .article-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          
          .article-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            
            .article-title {
              font-size: 18px;
              font-weight: 600;
              margin: 0;
              color: #333;
              line-height: 1.4;
              flex: 1;
              margin-right: 16px;
              
              &:hover {
                color: #1890ff;
              }
            }
            
            .article-tags {
              flex-shrink: 0;
            }
          }
          
          .article-summary {
            color: #666;
            line-height: 1.6;
            margin-bottom: 16px;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-size: 14px;
          }
          
          .article-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .author-info {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .author-name {
                font-weight: 500;
                color: #333;
                font-size: 14px;
              }
              
              .publish-time {
                color: #999;
                font-size: 12px;
              }
            }
            
            .article-stats {
              display: flex;
              gap: 16px;
              
              .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #666;
                font-size: 12px;
                
                .anticon {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
      
      .pagination-section {
        margin-top: 32px;
        text-align: center;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
    
    .sidebar {
      width: 300px;
      flex-shrink: 0;
      
      .ant-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .hot-articles {
        .hot-article-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.3s;
          
          &:last-child {
            border-bottom: none;
          }
          
          &:hover {
            background-color: #f5f5f5;
            margin: 0 -12px;
            padding: 12px;
            border-radius: 6px;
          }
          
          .rank-number {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            color: #666;
            font-size: 12px;
            font-weight: bold;
            border-radius: 50%;
            flex-shrink: 0;
            
            &.top {
              background: #ff4d4f;
              color: white;
            }
          }
          
          .hot-article-info {
            flex: 1;
            
            h4 {
              font-size: 14px;
              margin: 0 0 4px 0;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              color: #333;
              
              &:hover {
                color: #1890ff;
              }
            }
            
            .hot-article-stats {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
      
      .hot-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
}

@media (max-width: 1200px) {
  .news-list-page {
    .main-content {
      .sidebar {
        width: 280px;
      }
    }
  }
}

@media (max-width: 992px) {
  .news-list-page {
    .main-content {
      flex-direction: column;
      
      .sidebar {
        width: 100%;
        order: -1;
      }
    }
    
    .search-section {
      :deep(.ant-row) {
        flex-direction: column;
        gap: 16px;
        
        .ant-col {
          width: 100% !important;
          max-width: 100% !important;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .news-list-page {
    .articles-section {
      .article-content {
        flex-direction: column;
        
        .article-cover {
          width: 100%;
          height: 200px;
        }
        
        .article-info {
          .article-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            
            .article-title {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>