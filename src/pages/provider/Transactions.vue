<template>
  <div class="transactions-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>交易记录</h2>
      <a-button type="primary" @click="exportTransactions">
        <template #icon><DownloadOutlined /></template>
        导出记录
      </a-button>
    </div>

    <!-- 统计卡片 -->
    <a-row :gutter="24" class="stats-cards">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总收入"
            :value="125680"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#3f8600' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="本月收入"
            :value="28900"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="待结算"
            :value="5600"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#fa8c16' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="已提现"
            :value="120080"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- 筛选区域 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索订单号、服务名称..."
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="typeFilter"
            placeholder="交易类型"
            style="width: 100%"
            @change="handleTypeChange"
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option value="income">收入</a-select-option>
            <a-select-option value="withdraw">提现</a-select-option>
            <a-select-option value="refund">退款</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="statusFilter"
            placeholder="交易状态"
            style="width: 100%"
            @change="handleStatusChange"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="pending">处理中</a-select-option>
            <a-select-option value="failed">失败</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-range-picker
            v-model:value="dateRange"
            @change="handleDateChange"
          />
        </a-col>
      </a-row>
    </a-card>

    <!-- 交易列表 -->
    <a-card class="transaction-list-card">
      <a-table
        :columns="columns"
        :data-source="transactions"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'transaction'">
            <div class="transaction-info">
              <div class="transaction-header">
                <span class="transaction-id">{{ record.id }}</span>
                <span class="transaction-time">{{ formatDateTime(record.createdAt) }}</span>
              </div>
              <div class="transaction-details">
                <div class="service-name">{{ record.serviceName }}</div>
                <div class="order-id">订单号: {{ record.orderId }}</div>
              </div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">
              {{ getTypeText(record.type) }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'amount'">
            <span :class="['amount', record.type === 'income' ? 'income' : 'expense']">
              {{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount.toLocaleString() }}
            </span>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewTransaction(record.id)">查看详情</a-button>
              <a-button 
                v-if="record.type === 'income' && record.status === 'completed'"
                type="link" 
                size="small" 
                @click="requestWithdraw(record.id)"
              >
                申请提现
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 交易详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="交易详情"
      :footer="null"
      width="600px"
    >
      <div v-if="currentTransaction" class="transaction-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="交易ID">{{ currentTransaction.id }}</a-descriptions-item>
          <a-descriptions-item label="交易类型">
            <a-tag :color="getTypeColor(currentTransaction.type)">
              {{ getTypeText(currentTransaction.type) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="交易金额">
            <span :class="['amount', currentTransaction.type === 'income' ? 'income' : 'expense']">
              {{ currentTransaction.type === 'income' ? '+' : '-' }}¥{{ currentTransaction.amount.toLocaleString() }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item label="交易状态">
            <a-tag :color="getStatusColor(currentTransaction.status)">
              {{ getStatusText(currentTransaction.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="服务名称">{{ currentTransaction.serviceName }}</a-descriptions-item>
          <a-descriptions-item label="关联订单">{{ currentTransaction.orderId }}</a-descriptions-item>
          <a-descriptions-item label="交易时间" :span="2">
            {{ formatDateTime(currentTransaction.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">
            {{ currentTransaction.remark || '无' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  DownloadOutlined
} from '@ant-design/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const detailModalVisible = ref(false)
const currentTransaction = ref(null)

// 表格列定义
const columns = [
  {
    title: '交易信息',
    key: 'transaction',
    width: 300
  },
  {
    title: '类型',
    key: 'type',
    width: 100
  },
  {
    title: '金额',
    key: 'amount',
    width: 120,
    sorter: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100
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

// 交易记录数据（模拟）
const transactions = ref([
  {
    id: 'TXN202401001',
    type: 'income',
    amount: 8999,
    status: 'completed',
    serviceName: '企业官网开发',
    orderId: 'ORD202401001',
    remark: '订单完成收入',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'TXN202401002',
    type: 'withdraw',
    amount: 5000,
    status: 'pending',
    serviceName: '-',
    orderId: '-',
    remark: '提现申请',
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 'TXN202401003',
    type: 'income',
    amount: 4999,
    status: 'completed',
    serviceName: '移动应用UI设计',
    orderId: 'ORD202401002',
    remark: '订单完成收入',
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 'TXN202401004',
    type: 'refund',
    amount: 2000,
    status: 'completed',
    serviceName: '数据分析服务',
    orderId: 'ORD202401003',
    remark: '客户申请退款',
    createdAt: '2024-01-12T16:45:00Z'
  }
])

// 方法
const getTypeColor = (type) => {
  const colors = {
    income: 'green',
    withdraw: 'blue',
    refund: 'orange'
  }
  return colors[type] || 'default'
}

const getTypeText = (type) => {
  const texts = {
    income: '收入',
    withdraw: '提现',
    refund: '退款'
  }
  return texts[type] || type
}

const getStatusColor = (status) => {
  const colors = {
    completed: 'green',
    pending: 'orange',
    failed: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    completed: '已完成',
    pending: '处理中',
    failed: '失败'
  }
  return texts[status] || status
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')
}

const handleSearch = () => {
  fetchTransactions()
}

const handleTypeChange = () => {
  fetchTransactions()
}

const handleStatusChange = () => {
  fetchTransactions()
}

const handleDateChange = () => {
  fetchTransactions()
}

const handleTableChange = (pag, filters, sorter) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchTransactions()
}

const viewTransaction = (transactionId) => {
  const transaction = transactions.value.find(t => t.id === transactionId)
  if (transaction) {
    currentTransaction.value = transaction
    detailModalVisible.value = true
  }
}

const requestWithdraw = (transactionId) => {
  message.success('提现申请功能开发中...')
}

const exportTransactions = () => {
  message.success('交易记录导出功能开发中...')
}

const fetchTransactions = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    pagination.value.total = 45
  } catch (error) {
    message.error('获取交易记录失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped lang="less">
.transactions-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
  }
  
  .stats-cards {
    margin-bottom: 24px;
  }
  
  .filter-card {
    margin-bottom: 24px;
  }
  
  .transaction-list-card {
    .transaction-info {
      .transaction-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .transaction-id {
          font-weight: 600;
          color: #1890ff;
        }
        
        .transaction-time {
          font-size: 12px;
          color: #999;
        }
      }
      
      .transaction-details {
        .service-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        
        .order-id {
          font-size: 12px;
          color: #666;
        }
      }
    }
    
    .amount {
      font-weight: 600;
      font-size: 16px;
      
      &.income {
        color: #52c41a;
      }
      
      &.expense {
        color: #f5222d;
      }
    }
  }
  
  .transaction-detail {
    .amount {
      font-weight: 600;
      
      &.income {
        color: #52c41a;
      }
      
      &.expense {
        color: #f5222d;
      }
    }
  }
}
</style>