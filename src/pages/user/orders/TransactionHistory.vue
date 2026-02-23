<template>
  <div class="transaction-history-page">
    <div class="page-header">
      <h2>交易记录</h2>
      <a-button type="primary" :loading="exporting" @click="handleExport">
        <template #icon><DownloadOutlined /></template>
        导出 Excel
      </a-button>
    </div>

    <!-- 搜索筛选 -->
    <SearchFilter :filters="filterConfig" @search="handleSearch" @reset="handleReset" />

    <!-- 交易流水表格 -->
    <a-card>
      <a-table
        :columns="columns"
        :data-source="transactions"
        :loading="loading"
        :pagination="false"
        row-key="id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            <span :class="record.amount > 0 ? 'amount-in' : 'amount-out'">
              {{ record.amount > 0 ? '+' : '' }}¥{{ Math.abs(record.amount).toFixed(2) }}
            </span>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag :color="typeColorMap[record.type] || 'default'">{{ typeMap[record.type] || record.type }}</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-badge :status="statusBadgeMap[record.status] || 'default'" :text="statusMap[record.status] || record.status" />
          </template>
          <template v-else-if="column.key === 'time'">
            {{ formatTime(record.createdAt) }}
          </template>
        </template>
      </a-table>

      <PaginationWrapper
        v-if="pagination.total > 0"
        :total="pagination.total"
        :current="pagination.current"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { useOrderStore } from '@/stores/order'
import SearchFilter from '@/components/common/SearchFilter.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'

const orderStore = useOrderStore()

const loading = ref(false)
const exporting = ref(false)
const transactions = ref([])
const searchParams = ref({})

const pagination = reactive({ current: 1, pageSize: 20, total: 0 })

const filterConfig = [
  {
    type: 'date',
    field: 'dateRange',
    label: '时间范围',
  },
  {
    type: 'select',
    field: 'type',
    label: '交易类型',
    options: [
      { value: 'payment', label: '支付' },
      { value: 'income', label: '收入' },
      { value: 'refund', label: '退款' },
      { value: 'withdraw', label: '提现' },
    ],
  },
]

const columns = [
  { title: '交易时间', key: 'time', width: 180 },
  { title: '交易类型', key: 'type', width: 100 },
  { title: '订单号', dataIndex: 'orderNo', width: 160 },
  { title: '金额', key: 'amount', width: 140 },
  { title: '状态', key: 'status', width: 100 },
  { title: '对方信息', dataIndex: 'counterparty', width: 150 },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
]

const typeMap = { payment: '支付', income: '收入', refund: '退款', withdraw: '提现' }
const typeColorMap = { payment: 'red', income: 'green', refund: 'orange', withdraw: 'blue' }
const statusMap = { success: '成功', pending: '处理中', failed: '失败' }
const statusBadgeMap = { success: 'success', pending: 'processing', failed: 'error' }

const formatTime = (t) => (t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : '-')

const fetchTransactions = async () => {
  loading.value = true
  try {
    const res = await orderStore.fetchTransactions({
      ...searchParams.value,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    if (res) {
      transactions.value = res.list || res.data || []
      pagination.total = res.total || 0
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = (params) => {
  searchParams.value = params
  pagination.current = 1
  fetchTransactions()
}

const handleReset = () => {
  searchParams.value = {}
  pagination.current = 1
  fetchTransactions()
}

const handlePageChange = (page, pageSize) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchTransactions()
}

const handleExport = async () => {
  exporting.value = true
  try {
    // Try store export first, fallback to client-side export
    const data = transactions.value.map((t) => ({
      交易时间: formatTime(t.createdAt),
      交易类型: typeMap[t.type] || t.type,
      订单号: t.orderNo || '',
      金额: t.amount,
      状态: statusMap[t.status] || t.status,
      对方信息: t.counterparty || '',
      备注: t.remark || '',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '交易记录')
    XLSX.writeFile(wb, `交易记录_${dayjs().format('YYYYMMDD')}.xlsx`)
    message.success('导出成功')
  } catch {
    message.error('导出失败')
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped lang="less">
.transaction-history-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
  }
  .amount-in {
    color: #52c41a;
    font-weight: 600;
  }
  .amount-out {
    color: #ff4d4f;
    font-weight: 600;
  }
}
</style>
