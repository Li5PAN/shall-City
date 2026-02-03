<template>
  <div class="service-list-page">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索服务名称、描述..."
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
        <a-col :span="6">
          <a-slider
            v-model:value="priceRange"
            range
            :min="0"
            :max="50000"
            :step="100"
            @change="handlePriceChange"
          />
          <div class="price-range-text">
            价格范围: ¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}
          </div>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="sortBy"
            size="large"
            style="width: 100%"
            @change="handleSortChange"
          >
            <a-select-option value="latest">最新发布</a-select-option>
            <a-select-option value="price_asc">价格从低到高</a-select-option>
            <a-select-option value="price_desc">价格从高到低</a-select-option>
            <a-select-option value="rating">评分最高</a-select-option>
            <a-select-option value="sales">销量最高</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-space>
            <a-button :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
              <template #icon><AppstoreOutlined /></template>
            </a-button>
            <a-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
              <template #icon><BarsOutlined /></template>
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <!-- 服务列表 -->
    <div class="services-section">
      <a-spin :spinning="loading">
        <!-- 网格视图 -->
        <a-row :gutter="[24, 24]" v-if="viewMode === 'grid'">
          <a-col :span="6" v-for="service in services" :key="service.id">
            <a-card hoverable class="service-card" @click="goToDetail(service.id)">
              <template #cover>
                <img :src="service.coverImage" :alt="service.title" />
              </template>
              
              <a-card-meta :title="service.title" :description="service.description" />
              
              <div class="service-footer">
                <div class="price-info">
                  <span class="current-price">¥{{ service.price }}</span>
                  <span v-if="service.originalPrice > service.price" class="original-price">
                    ¥{{ service.originalPrice }}
                  </span>
                </div>
                
                <div class="service-stats">
                  <a-rate :value="service.rating" disabled allow-half size="small" />
                  <span class="rating-text">({{ service.reviews }})</span>
                </div>
                
                <div class="provider-info">
                  <a-avatar :src="service.provider.avatar" :size="24" />
                  <span class="provider-name">{{ service.provider.username }}</span>
                </div>
                
                <div class="service-tags">
                  <a-tag v-for="tag in service.tags.slice(0, 2)" :key="tag" size="small">
                    {{ tag }}
                  </a-tag>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
        
        <!-- 列表视图 -->
        <div v-else class="list-view">
          <a-list
            :data-source="services"
            item-layout="horizontal"
          >
            <template #renderItem="{ item }">
              <a-list-item class="service-list-item" @click="goToDetail(item.id)">
                <template #actions>
                  <a-button type="primary">查看详情</a-button>
                </template>
                
                <a-list-item-meta>
                  <template #avatar>
                    <img :src="item.coverImage" :alt="item.title" class="service-cover" />
                  </template>
                  
                  <template #title>
                    <div class="service-title-row">
                      <h3>{{ item.title }}</h3>
                      <div class="price-info">
                        <span class="current-price">¥{{ item.price }}</span>
                        <span v-if="item.originalPrice > item.price" class="original-price">
                          ¥{{ item.originalPrice }}
                        </span>
                      </div>
                    </div>
                  </template>
                  
                  <template #description>
                    <div class="service-description">
                      <p>{{ item.description }}</p>
                      
                      <div class="service-meta">
                        <div class="provider-info">
                          <a-avatar :src="item.provider.avatar" :size="24" />
                          <span class="provider-name">{{ item.provider.username }}</span>
                          <span class="delivery-time">{{ item.deliveryDays }}天交付</span>
                        </div>
                        
                        <div class="service-stats">
                          <a-rate :value="item.rating" disabled allow-half size="small" />
                          <span class="rating-text">({{ item.reviews }})</span>
                          <span class="sales-text">已售{{ item.sales }}件</span>
                        </div>
                        
                        <div class="service-tags">
                          <a-tag v-for="tag in item.tags" :key="tag" size="small">
                            {{ tag }}
                          </a-tag>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
        
        <!-- 空状态 -->
        <a-empty v-if="!loading && services.length === 0" description="暂无服务" />
      </a-spin>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="services.length > 0">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  AppstoreOutlined,
  BarsOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('')
const priceRange = ref([0, 50000])
const sortBy = ref('latest')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 分类数据
const categories = ref([
  { id: 'web', name: '网站开发' },
  { id: 'mobile', name: '移动应用' },
  { id: 'ui', name: 'UI设计' },
  { id: 'data', name: '数据分析' },
  { id: 'ai', name: '人工智能' },
  { id: 'blockchain', name: '区块链' }
])

// 服务列表数据（模拟）
const services = ref([
  {
    id: 1,
    title: '企业官网开发',
    description: '专业的企业官网开发服务，响应式设计，SEO优化，后台管理系统',
    coverImage: 'https://via.placeholder.com/300x200/1890ff/ffffff?text=Web+Dev',
    price: 8999,
    originalPrice: 12999,
    rating: 4.8,
    reviews: 128,
    sales: 89,
    deliveryDays: 15,
    tags: ['网站开发', 'Vue', 'Node.js'],
    provider: {
      username: '前端专家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    }
  },
  {
    id: 2,
    title: '移动应用UI设计',
    description: '专业的移动应用UI设计，包含原型设计、视觉设计、交互设计',
    coverImage: 'https://via.placeholder.com/300x200/52c41a/ffffff?text=UI+Design',
    price: 4999,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 89,
    sales: 156,
    deliveryDays: 7,
    tags: ['UI设计', 'Figma', '原型设计'],
    provider: {
      username: 'UI设计师',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    }
  },
  {
    id: 3,
    title: '数据分析与可视化',
    description: '专业的数据分析服务，包含数据清洗、分析建模、可视化报表',
    coverImage: 'https://via.placeholder.com/300x200/722ed1/ffffff?text=Data+Analysis',
    price: 6999,
    originalPrice: 8999,
    rating: 4.7,
    reviews: 203,
    sales: 67,
    deliveryDays: 10,
    tags: ['数据分析', 'Python', 'Tableau'],
    provider: {
      username: '数据科学家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    }
  },
  {
    id: 4,
    title: '微信小程序开发',
    description: '专业的微信小程序开发，包含前端开发、后端接口、部署上线',
    coverImage: 'https://via.placeholder.com/300x200/fa8c16/ffffff?text=Mini+Program',
    price: 5999,
    originalPrice: 7999,
    rating: 4.6,
    reviews: 145,
    sales: 234,
    deliveryDays: 12,
    tags: ['小程序', '微信开发', 'JavaScript'],
    provider: {
      username: '小程序专家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    }
  }
])

// 方法
const handleSearch = () => {
  currentPage.value = 1
  fetchServices()
}

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchServices()
}

const handlePriceChange = () => {
  currentPage.value = 1
  fetchServices()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchServices()
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchServices()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchServices()
}

const goToDetail = (id) => {
  router.push(`/user/services/${id}`)
}

const fetchServices = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该根据筛选条件调用实际API
    total.value = 48
    
  } catch (error) {
    console.error('获取服务列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped lang="less">
.service-list-page {
  .search-section {
    margin-bottom: 24px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .price-range-text {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
  }
  
  .services-section {
    margin-bottom: 24px;
    
    .service-card {
      height: 100%;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
      
      :deep(.ant-card-cover) img {
        height: 200px;
        object-fit: cover;
      }
      
      :deep(.ant-card-body) {
        display: flex;
        flex-direction: column;
        height: calc(100% - 200px);
      }
      
      :deep(.ant-card-meta) {
        flex: 1;
        margin-bottom: 16px;
        
        .ant-card-meta-title {
          font-size: 16px;
          font-weight: 600;
        }
        
        .ant-card-meta-description {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      
      .service-footer {
        .price-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          
          .current-price {
            font-size: 18px;
            font-weight: bold;
            color: #f5222d;
          }
          
          .original-price {
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
          }
        }
        
        .service-stats {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
          
          .rating-text {
            font-size: 12px;
            color: #666;
          }
        }
        
        .provider-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          
          .provider-name {
            font-size: 12px;
            color: #666;
          }
        }
        
        .service-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
      }
    }
    
    .list-view {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .service-list-item {
        cursor: pointer;
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: #f5f5f5;
        }
        
        .service-cover {
          width: 120px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .service-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
          
          .price-info {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .current-price {
              font-size: 18px;
              font-weight: bold;
              color: #f5222d;
            }
            
            .original-price {
              font-size: 14px;
              color: #999;
              text-decoration: line-through;
            }
          }
        }
        
        .service-description {
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .service-meta {
            display: flex;
            flex-direction: column;
            gap: 8px;
            
            .provider-info {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .provider-name {
                font-weight: 500;
                color: #333;
              }
              
              .delivery-time {
                color: #666;
                font-size: 12px;
              }
            }
            
            .service-stats {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .rating-text,
              .sales-text {
                font-size: 12px;
                color: #666;
              }
            }
            
            .service-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
            }
          }
        }
      }
    }
  }
  
  .pagination-section {
    text-align: center;
  }
}
</style>