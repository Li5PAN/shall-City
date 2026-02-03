<template>
  <div class="favorites-page">
    <!-- 筛选和搜索 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索收藏内容..."
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="selectedType"
            placeholder="内容类型"
            style="width: 100%"
            @change="handleTypeChange"
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option value="article">文章</a-select-option>
            <a-select-option value="service">服务</a-select-option>
            <a-select-option value="post">帖子</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="sortBy"
            style="width: 100%"
            @change="handleSortChange"
          >
            <a-select-option value="latest">最新收藏</a-select-option>
            <a-select-option value="oldest">最早收藏</a-select-option>
            <a-select-option value="popular">最受欢迎</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="10">
          <div class="stats-info">
            <a-statistic-countdown
              title="总收藏数"
              :value="total"
              format="HH:mm:ss"
              style="display: inline-block; margin-right: 32px;"
            />
            <span class="last-update">最后更新: {{ lastUpdate }}</span>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 收藏列表 -->
    <a-spin :spinning="loading">
      <a-row :gutter="[16, 16]" style="margin-top: 16px;">
        <a-col :span="24" v-for="item in favorites" :key="item.id">
          <a-card hoverable class="favorite-card">
            <div class="favorite-content">
              <div class="favorite-cover">
                <img :src="item.cover" :alt="item.title" />
                <div class="favorite-type">
                  <a-tag :color="getTypeColor(item.type)">
                    {{ getTypeName(item.type) }}
                  </a-tag>
                </div>
              </div>
              
              <div class="favorite-info">
                <div class="favorite-header">
                  <h3 class="favorite-title" @click="goToDetail(item)">
                    {{ item.title }}
                  </h3>
                  <div class="favorite-actions">
                    <a-button type="text" @click="toggleFavorite(item)">
                      <HeartFilled style="color: #ff4d4f;" />
                    </a-button>
                    <a-dropdown>
                      <a-button type="text">
                        <MoreOutlined />
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click="shareItem(item)">
                            <ShareAltOutlined />
                            分享
                          </a-menu-item>
                          <a-menu-item @click="removeFavorite(item)">
                            <DeleteOutlined />
                            取消收藏
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </div>
                
                <p class="favorite-description">{{ item.description }}</p>
                
                <div class="favorite-meta">
                  <div class="author-info">
                    <a-avatar :src="item.author.avatar" :size="24" />
                    <span class="author-name">{{ item.author.name }}</span>
                    <span class="favorite-time">收藏于 {{ formatTime(item.favoriteTime) }}</span>
                  </div>
                  
                  <div class="favorite-stats">
                    <span class="stat-item">
                      <EyeOutlined />
                      {{ item.stats.views }}
                    </span>
                    <span class="stat-item">
                      <LikeOutlined />
                      {{ item.stats.likes }}
                    </span>
                    <span class="stat-item">
                      <MessageOutlined />
                      {{ item.stats.comments }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
      
      <!-- 空状态 -->
      <a-empty v-if="!loading && favorites.length === 0" description="暂无收藏内容">
        <a-button type="primary" @click="goToBrowse">去逛逛</a-button>
      </a-empty>
    </a-spin>

    <!-- 分页 -->
    <div class="pagination-section" v-if="favorites.length > 0">
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  HeartFilled,
  MoreOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const lastUpdate = ref(dayjs().format('YYYY-MM-DD HH:mm'))

// 收藏列表数据（模拟）
const favorites = ref([
  {
    id: 1,
    type: 'article',
    title: 'Vue 3.4 正式发布：性能优化与新特性详解',
    description: 'Vue 3.4 带来了显著的性能提升和多项新特性，包括更好的TypeScript支持、优化的响应式系统等...',
    cover: 'https://via.placeholder.com/200x120/4fc08d/ffffff?text=Vue+3.4',
    author: {
      name: '前端小王',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 1250,
      likes: 89,
      comments: 23
    },
    favoriteTime: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'service',
    title: '企业级Vue项目开发服务',
    description: '提供专业的Vue.js企业级项目开发服务，包括架构设计、组件开发、性能优化等...',
    cover: 'https://via.placeholder.com/200x120/1890ff/ffffff?text=Vue+Service',
    author: {
      name: '全栈开发者',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 856,
      likes: 45,
      comments: 12
    },
    favoriteTime: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    type: 'post',
    title: '如何优雅地处理Vue组件间通信？',
    description: '分享一些Vue组件间通信的最佳实践，包括props、emit、provide/inject等方式的使用场景...',
    cover: 'https://via.placeholder.com/200x120/52c41a/ffffff?text=Vue+Tips',
    author: {
      name: 'Vue专家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    stats: {
      views: 2100,
      likes: 156,
      comments: 67
    },
    favoriteTime: '2024-01-13T09:15:00Z'
  }
])

// 方法
const handleSearch = () => {
  currentPage.value = 1
  fetchFavorites()
}

const handleTypeChange = () => {
  currentPage.value = 1
  fetchFavorites()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchFavorites()
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchFavorites()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchFavorites()
}

const getTypeColor = (type) => {
  const colors = {
    article: 'blue',
    service: 'green',
    post: 'orange'
  }
  return colors[type] || 'default'
}

const getTypeName = (type) => {
  const names = {
    article: '文章',
    service: '服务',
    post: '帖子'
  }
  return names[type] || '未知'
}

const goToDetail = (item) => {
  const routes = {
    article: `/user/news/${item.id}`,
    service: `/user/services/${item.id}`,
    post: `/user/forum/post/${item.id}`
  }
  router.push(routes[item.type] || '/')
}

const toggleFavorite = (item) => {
  message.success('已取消收藏')
  // 从列表中移除
  const index = favorites.value.findIndex(fav => fav.id === item.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
    total.value--
  }
}

const removeFavorite = (item) => {
  toggleFavorite(item)
}

const shareItem = (item) => {
  // 复制链接到剪贴板
  const url = window.location.origin + (item.type === 'article' ? `/user/news/${item.id}` : `/user/services/${item.id}`)
  navigator.clipboard.writeText(url).then(() => {
    message.success('链接已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}

const goToBrowse = () => {
  router.push('/user/news')
}

const formatTime = (timeString) => {
  return dayjs(timeString).format('MM-DD HH:mm')
}

const fetchFavorites = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该根据筛选条件调用实际API
    total.value = 25
    
  } catch (error) {
    message.error('获取收藏列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped lang="less">
.favorites-page {
  .filter-card {
    margin-bottom: 16px;
    
    .stats-info {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      
      .last-update {
        color: #666;
        font-size: 12px;
      }
    }
  }
  
  .favorite-card {
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .favorite-content {
      display: flex;
      gap: 16px;
      
      .favorite-cover {
        width: 200px;
        height: 120px;
        flex-shrink: 0;
        position: relative;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .favorite-type {
          position: absolute;
          top: 8px;
          left: 8px;
        }
      }
      
      .favorite-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .favorite-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          
          .favorite-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #333;
            line-height: 1.4;
            flex: 1;
            cursor: pointer;
            
            &:hover {
              color: #1890ff;
            }
          }
          
          .favorite-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
          }
        }
        
        .favorite-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 12px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .favorite-meta {
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
            
            .favorite-time {
              color: #999;
              font-size: 12px;
            }
          }
          
          .favorite-stats {
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
  }
  
  .pagination-section {
    margin-top: 32px;
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .favorites-page {
    .favorite-card {
      .favorite-content {
        flex-direction: column;
        
        .favorite-cover {
          width: 100%;
          height: 200px;
        }
      }
    }
  }
}
</style>