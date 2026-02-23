<template>
  <div class="order-manage-page">
    <div class="page-header">
      <h2>订单管理</h2>
      <div class="batch-actions" v-if="selectedIds.length">
        <a-space>
          <span>已选 {{ selectedIds.length }} 项</span>
          <a-button type="primary" size="small" @click="batchConfirm">批量确认接单</a-button>
          <a-button size="small" @click="batchDeliver">批量标记发货</a-button>
          <a-button size="small" @click="selectedIds = []">取消选择</a-button>
        </a-space>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <SearchFilter :filters="filterConfig" @search="handleSearch" @reset="handleReset" />

    <!-- 状态标签页 -->
    <a-tabs v-model:activeKey="activeStatus" @change="handleStatusChange">
      <a-tab-pane v-for="tab in statusTabs" :key="tab.key" :tab="tab.label" />
    </a-tabs>

    <!-- 订单列表 -->
    <a-spin :spinning="orderStore.loading">
      <div v-if="orderStore.orderList.length" class="order-list">
        <div v-for="order in orderStore.orderList" :key="order.id" class="order-item">
          <a-checkbox
            :checked="selectedIds.includes(order.id)"
            @change="toggleSelect(order.id)"
            class="order-checkbox"
          />
          <div class="order-card-wrap">
            <OrderCard
              :order="order"
              role="provider"
              @click="handleOrderClick"
              @action="handleOrderAction"
            />
          </div>
        </div>
      </div>
      <a-empty v-else description="暂无订单" />
    </a-spin>

    <!-- 分页 -->
    <PaginationWrapper
      v-if="orderStore.pagination.total > 0"
      :total="orderStore.pagination.total"
      :current="orderStore.pagination.current"
      :page-size="orderStore.pagination.pageSize"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useOrderStore } from '@/stores/order'
import OrderCard from '@/components/business/OrderCard.vue'
import SearchFilter from '@/components/common/SearchFilter.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'

const router = useRouter()
const orderStore = useOrderStore()

const activeStatus = ref('all')
const selectedIds = ref([])
const searchParams = ref({})

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '进行中' },
  { key: 'delivering', label: '待验收' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'appealing', label: '申诉中' },
]

const filterConfig = [
  { type: 'input', field: 'keyword', label: '关键词', placeholder: '搜索订单号、服务名称...' },
  { type: 'date', field: 'dateRange', label: '日期范围' },
]

const fetchOrders = () => {
  orderStore.statusFilter = activeStatus.value
  orderStore.fetchOrderList({ role: 'provider', ...searchParams.value })
}

const handleSearch = (params) => {
  searchParams.value = params
  orderStore.pagination.current = 1
  fetchOrders()
}

const handleReset = () => {
  searchParams.value = {}
  orderStore.pagination.current = 1
  fetchOrders()
}

const handleStatusChange = () => {
  selectedIds.value = []
  orderStore.pagination.current = 1
  fetchOrders()
}

const handlePageChange = (page, pageSize) => {
  orderStore.pagination.current = page
  orderStore.pagination.pageSize = pageSize
  fetchOrders()
}

const toggleSelect = (id) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const batchConfirm = () => {
  Modal.confirm({
    title: '批量确认接单',
    content: `确认接受选中的 ${selectedIds.value.length} 个订单？`,
    onOk() {
      message.success('批量接单成功')
      selectedIds.value = []
      fetchOrders()
    },
  })
}

const batchDeliver = () => {
  Modal.confirm({
    title: '批量标记发货',
    content: `确认将选中的 ${selectedIds.value.length} 个订单标记为已发货？`,
    onOk() {
      message.success('批量标记发货成功')
      selectedIds.value = []
      fetchOrders()
    },
  })
}

const handleOrderClick = (id) => {
  router.push(`/provider/orders/${id}`)
}

const handleOrderAction = (type, id) => {
  if (type === 'confirm') {
    Modal.confirm({
      title: '确认接单',
      content: '确认接受此订单？',
      onOk() {
        message.success('接单成功')
        fetchOrders()
      },
    })
  } else if (type === 'deliver') {
    router.push(`/provider/orders/${id}/delivery`)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="less">
.order-manage-page {
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

  .order-list {
    .order-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      .order-checkbox {
        margin-top: 20px;
      }

      .order-card-wrap {
        flex: 1;
      }
    }
  }
}
</style>
