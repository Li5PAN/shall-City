<template>
  <div class="order-manage-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>订单管理</h2>
    </div>

    <!-- 筛选区域 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索订单号、客户名称..."
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="statusFilter"
            placeholder="订单状态"
            style="width: 100%"
            @change="handleStatusChange"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="pending">待处理</a-select-option>
            <a-select-option value="in_progress">进行中</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateChange"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="exportOrders">
            <template #icon><DownloadOutlined /></template>
            导出订单
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- 订单列表 -->
    <a-card class="order-list-card">
      <a-table
        :columns="columns"
        :data-source="orders"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'order'">
            <div class="order-info">
              <div class="order-header">
                <span class="order-id">{{ record.id }}</span>
                <span class="order-time">{{ formatDateTime(record.createdAt) }}</span>
              </div>
              <div class="service-info">
                <img :src="record.service.coverImage" :alt="record.service.title" class="service-cover" />
                <div class="service-details">
                  <h4>{{ record.service.title }}</h4>
                  <p>{{ record.service.category }}</p>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'customer'">
            <div class="customer-info">
              <a-avatar :src="record.customer.avatar" :size="32" />
              <div class="customer-details">
                <div class="customer-name">{{ record.customer.name }}</div>
                <div class="customer-contact">{{ record.customer.phone }}</div>
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'amount'">
            <span class="amount">¥{{ record.amount.toLocaleString() }}</span>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'deadline'">
            <span :class="{ 'deadline-warning': isDeadlineWarning(record.deadline) }">
              {{ formatDate(record.deadline) }}
            </span>
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewOrder(record.id)">查看</a-button>
              <a-dropdown v-if="record.status === 'pending'">
                <a-button type="link" size="small">
                  处理 <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="accept" @click="acceptOrder(record.id)">接受订单</a-menu-item>
                    <a-menu-item key="reject" @click="rejectOrder(record.id)">拒绝订单</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-button 
                v-else-if="record.status === 'in_progress'" 
                type="link" 
                size="small" 
                @click="completeOrder(record.id)"
              >
                完成订单
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 拒绝订单弹窗 -->
    <a-modal
      v-model:open="rejectModalVisible"
      title="拒绝订单"
      @ok="handleRejectOrder"
      :confirm-loading="rejecting"
    >
      <a-form layout="vertical">
        <a-form-item label="拒绝原因" required>
          <a-textarea
            v-model:value="rejectReason"
            placeholder="请说明拒绝订单的原因"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  DownloadOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const rejectModalVisible = ref(false)
const rejectReason = ref('')
const rejecting = ref(false)
const currentRejectOrderId = ref(null)

// 表格列定义
const columns = [
  {
    title: '订单信息',
    key: 'order',
    width: 300
  },
  {
    title: '客户',
    key: 'customer',
    width: 150
  },
  {
    title: '金额',
    key: 'amount',
    width: 100,
    sorter: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100
  },
  {
    title: '交付期限',
    key: 'deadline',
    width: 120
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

// 订单列表数据（模拟）
const orders = ref([
  {
    id: 'ORD202401001',
    service: {
      title: '企业官网开发',
      category: '网站开发',
      coverImage: 'https://via.placeholder.com/60x40/1890ff/ffffff?text=Web'
    },
    customer: {
      name: '张三',
      phone: '138****8888',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    amount: 8999,
    status: 'pending',
    deadline: '2024-02-01',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD202401002',
    service: {
      title: '移动应用UI设计',
      category: 'UI设计',
      coverImage: 'https://via.placeholder.com/60x40/52c41a/ffffff?text=UI'
    },
    customer: {
      name: '李四',
      phone: '139****9999',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    amount: 4999,
    status: 'in_progress',
    deadline: '2024-01-25',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 'ORD202401003',
    service: {
      title: '数据分析报告',
      category: '数据分析',
      coverImage: 'https://via.placeholder.com/60x40/722ed1/ffffff?text=Data'
    },
    customer: {
      name: '王五',
      phone: '137****7777',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    amount: 6999,
    status: 'completed',
    deadline: '2024-01-20',
    createdAt: '2024-01-05T09:15:00Z'
  }
])

// 方法
const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('MM-DD HH:mm')
}

const isDeadlineWarning = (deadline) => {
  const now = dayjs()
  const deadlineDate = dayjs(deadline)
  return deadlineDate.diff(now, 'day') <= 3
}

const handleSearch = () => {
  fetchOrders()
}

const handleStatusChange = () => {
  fetchOrders()
}

const handleDateChange = () => {
  fetchOrders()
}

const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchOrders()
}

const viewOrder = (orderId) => {
  router.push(`/provider/orders/${orderId}`)
}

const acceptOrder = (orderId) => {
  Modal.confirm({
    title: '确认接受订单？',
    content: '接受后订单将进入进行中状态，请确保能按时完成。',
    onOk() {
      message.success('订单接受成功')
      fetchOrders()
    }
  })
}

const rejectOrder = (orderId) => {
  currentRejectOrderId.value = orderId
  rejectModalVisible.value = true
}

const handleRejectOrder = async () => {
  if (!rejectReason.value.trim()) {
    message.warning('请填写拒绝原因')
    return
  }
  
  rejecting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('订单拒绝成功')
    rejectModalVisible.value = false
    rejectReason.value = ''
    fetchOrders()
    
  } catch (error) {
    message.error('操作失败，请稍后重试')
  } finally {
    rejecting.value = false
  }
}

const completeOrder = (orderId) => {
  Modal.confirm({
    title: '确认完成订单？',
    content: '确认订单已完成并交付给客户？',
    onOk() {
      message.success('订单完成成功')
      fetchOrders()
    }
  })
}

const exportOrders = () => {
  message.success('订单导出功能开发中...')
}

const fetchOrders = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    pagination.value.total = 25
  } catch (error) {
    message.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="less">
.order-manage-page {
  .page-header {
    margin-bottom: 24px;
    
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  .filter-card {
    margin-bottom: 24px;
  }
  
  .order-list-card {
    .order-info {
      .order-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .order-id {
          font-weight: 600;
          color: #1890ff;
        }
        
        .order-time {
          font-size: 12px;
          color: #999;
        }
      }
      
      .service-info {
        display: flex;
        gap: 12px;
        
        .service-cover {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
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
            margin: 0;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
    
    .customer-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .customer-details {
        .customer-name {
          font-weight: 500;
          color: #333;
        }
        
        .customer-contact {
          font-size: 12px;
          color: #666;
        }
      }
    }
    
    .amount {
      font-weight: 600;
      color: #f5222d;
      font-size: 16px;
    }
    
    .deadline-warning {
      color: #fa8c16;
      font-weight: 500;
    }
  }
}
</style>