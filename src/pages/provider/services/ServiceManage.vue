<template>
  <div class="service-manage-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h2>我的服务</h2>
        <a-button type="primary" @click="$router.push('/provider/services/create')">
          <template #icon><PlusOutlined /></template>
          创建服务
        </a-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索服务名称..."
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="statusFilter"
            placeholder="服务状态"
            style="width: 100%"
            @change="handleStatusChange"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="active">已上架</a-select-option>
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="rejected">已拒绝</a-select-option>
            <a-select-option value="offline">已下架</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="categoryFilter"
            placeholder="服务分类"
            style="width: 100%"
            @change="handleCategoryChange"
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option value="web">网站开发</a-select-option>
            <a-select-option value="mobile">移动应用</a-select-option>
            <a-select-option value="ui">UI设计</a-select-option>
            <a-select-option value="data">数据分析</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-card>

    <!-- 服务列表 -->
    <a-card class="service-list-card">
      <a-table
        :columns="columns"
        :data-source="services"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'service'">
            <div class="service-info">
              <img :src="record.coverImage" :alt="record.title" class="service-cover" />
              <div class="service-details">
                <h4>{{ record.title }}</h4>
                <p>{{ record.description }}</p>
                <div class="service-tags">
                  <a-tag v-for="tag in record.tags" :key="tag" size="small">{{ tag }}</a-tag>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'price'">
            <span class="price">¥{{ record.price.toLocaleString() }}</span>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'stats'">
            <div class="service-stats">
              <div>销量: {{ record.sales }}</div>
              <div>评分: {{ record.rating }}</div>
              <div>评价: {{ record.reviews }}</div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="editService(record.id)">编辑</a-button>
              <a-button type="link" size="small" @click="viewOrders(record.id)">订单</a-button>
              <a-dropdown>
                <a-button type="link" size="small">
                  更多 <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="copy" @click="copyService(record.id)">复制服务</a-menu-item>
                    <a-menu-item key="offline" @click="toggleStatus(record.id, record.status)">
                      {{ record.status === 'active' ? '下架' : '上架' }}
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="delete" danger @click="deleteService(record.id)">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PlusOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

// 表格列定义
const columns = [
  {
    title: '服务信息',
    key: 'service',
    width: 400
  },
  {
    title: '价格',
    key: 'price',
    width: 100,
    sorter: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100
  },
  {
    title: '统计',
    key: 'stats',
    width: 120
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 120,
    sorter: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150
  }
]

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
})

// 服务列表数据（模拟）
const services = ref([
  {
    id: 1,
    title: '企业官网开发',
    description: '专业的企业官网开发服务，响应式设计，SEO优化',
    coverImage: 'https://via.placeholder.com/80x60/1890ff/ffffff?text=Web',
    price: 8999,
    status: 'active',
    sales: 89,
    rating: 4.8,
    reviews: 128,
    tags: ['网站开发', 'Vue', 'Node.js'],
    createdAt: '2024-01-10T10:30:00Z'
  },
  {
    id: 2,
    title: '移动应用UI设计',
    description: '专业的移动应用UI设计，包含原型设计、视觉设计',
    coverImage: 'https://via.placeholder.com/80x60/52c41a/ffffff?text=UI',
    price: 4999,
    status: 'pending',
    sales: 156,
    rating: 4.9,
    reviews: 89,
    tags: ['UI设计', 'Figma'],
    createdAt: '2024-01-08T14:20:00Z'
  },
  {
    id: 3,
    title: '数据分析服务',
    description: '专业的数据分析服务，包含数据清洗、分析建模',
    coverImage: 'https://via.placeholder.com/80x60/722ed1/ffffff?text=Data',
    price: 6999,
    status: 'offline',
    sales: 67,
    rating: 4.7,
    reviews: 203,
    tags: ['数据分析', 'Python'],
    createdAt: '2024-01-05T09:15:00Z'
  }
])

// 方法
const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    pending: 'orange',
    rejected: 'red',
    offline: 'default'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    active: '已上架',
    pending: '待审核',
    rejected: '已拒绝',
    offline: '已下架'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

const handleSearch = () => {
  fetchServices()
}

const handleStatusChange = () => {
  fetchServices()
}

const handleCategoryChange = () => {
  fetchServices()
}

const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchServices()
}

const editService = (id) => {
  router.push(`/provider/services/edit/${id}`)
}

const viewOrders = (id) => {
  router.push(`/provider/orders?serviceId=${id}`)
}

const copyService = (id) => {
  message.success('服务复制成功')
}

const toggleStatus = (id, currentStatus) => {
  const action = currentStatus === 'active' ? '下架' : '上架'
  Modal.confirm({
    title: `确认${action}服务？`,
    content: `您确定要${action}这个服务吗？`,
    onOk() {
      message.success(`服务${action}成功`)
      fetchServices()
    }
  })
}

const deleteService = (id) => {
  Modal.confirm({
    title: '确认删除服务？',
    content: '删除后无法恢复，确定要删除这个服务吗？',
    okType: 'danger',
    onOk() {
      message.success('服务删除成功')
      fetchServices()
    }
  })
}

const fetchServices = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    pagination.value.total = 25
  } catch (error) {
    message.error('获取服务列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped lang="less">
.service-manage-page {
  .page-header {
    margin-bottom: 24px;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  
  .filter-card {
    margin-bottom: 24px;
  }
  
  .service-list-card {
    .service-info {
      display: flex;
      gap: 12px;
      
      .service-cover {
        width: 80px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
        flex-shrink: 0;
      }
      
      .service-details {
        flex: 1;
        
        h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
        }
        
        p {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #666;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .service-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
      }
    }
    
    .price {
      font-weight: 600;
      color: #f5222d;
      font-size: 16px;
    }
    
    .service-stats {
      font-size: 12px;
      color: #666;
      
      div {
        margin-bottom: 2px;
      }
    }
  }
}
</style>