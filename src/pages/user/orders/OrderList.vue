<template>
  <div class="order-list-page">
    <div class="page-header">
      <h2>我的订单</h2>
    </div>

    <!-- 状态标签页 -->
    <a-tabs v-model:activeKey="activeStatus" @change="handleStatusChange">
      <a-tab-pane v-for="tab in statusTabs" :key="tab.key" :tab="tab.label" />
    </a-tabs>

    <!-- 订单列表 -->
    <a-spin :spinning="orderStore.loading">
      <div v-if="orderStore.orderList.length" class="order-list">
        <OrderCard
          v-for="order in orderStore.orderList"
          :key="order.id"
          :order="order"
          role="user"
          @click="handleOrderClick"
          @action="handleOrderAction"
        />
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
import { useOrderStore } from '@/stores/order'
import OrderCard from '@/components/business/OrderCard.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'

const router = useRouter()
const orderStore = useOrderStore()

const activeStatus = ref('all')

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待支付' },
  { key: 'processing', label: '进行中' },
  { key: 'delivering', label: '待验收' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
  { key: 'appealing', label: '申诉中' },
]

const fetchOrders = () => {
  orderStore.statusFilter = activeStatus.value
  orderStore.fetchOrderList({ role: 'user' })
}

const handleStatusChange = () => {
  orderStore.pagination.current = 1
  fetchOrders()
}

const handlePageChange = (page, pageSize) => {
  orderStore.pagination.current = page
  orderStore.pagination.pageSize = pageSize
  fetchOrders()
}

const handleOrderClick = (id) => {
  router.push(`/user/orders/${id}`)
}

const handleOrderAction = (type, id) => {
  if (type === 'pay') {
    router.push(`/user/orders/${id}`)
  } else if (type === 'accept') {
    router.push(`/user/orders/${id}/acceptance`)
  } else if (type === 'appeal') {
    router.push(`/user/orders/${id}/appeal`)
  } else if (type === 'review') {
    router.push(`/user/orders/${id}`)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="less">
.order-list-page {
  .page-header {
    margin-bottom: 16px;
    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
  }

  .order-list {
    min-height: 200px;
  }
}
</style>
