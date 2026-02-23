<template>
  <div class="order-detail-page">
    <a-spin :spinning="orderStore.loading">
      <template v-if="order">
        <!-- 订单状态进度条 -->
        <a-card class="status-card">
          <a-steps :current="currentStep" size="small">
            <a-step title="下单" :description="order.createdAt ? formatTime(order.createdAt) : ''" />
            <a-step title="接单" :description="order.acceptedAt ? formatTime(order.acceptedAt) : ''" />
            <a-step title="交付" :description="order.deliveredAt ? formatTime(order.deliveredAt) : ''" />
            <a-step title="验收" :description="order.acceptanceAt ? formatTime(order.acceptanceAt) : ''" />
            <a-step title="完成" :description="order.completedAt ? formatTime(order.completedAt) : ''" />
          </a-steps>
        </a-card>

        <!-- 订单基本信息 -->
        <a-card title="订单信息" class="info-card">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="订单号">{{ order.orderNo }}</a-descriptions-item>
            <a-descriptions-item label="订单状态">
              <StatusTag :status="order.status" type="order" />
            </a-descriptions-item>
            <a-descriptions-item label="订单金额">
              <span class="amount">¥{{ order.amount }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ formatTime(order.createdAt) }}</a-descriptions-item>
            <a-descriptions-item label="客户">{{ order.user || '-' }}</a-descriptions-item>
            <a-descriptions-item label="交付期限">{{ order.deadline || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 服务/需求信息 -->
        <a-card title="服务信息" class="info-card">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="服务名称">{{ order.title }}</a-descriptions-item>
            <a-descriptions-item label="服务描述">{{ order.description || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 交付物区域 -->
        <a-card v-if="order.deliverables && order.deliverables.length" title="交付物" class="info-card">
          <a-list :data-source="order.deliverables" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.name" :description="item.description" />
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="router.back()">返回</a-button>
            <a-button v-if="order.status === 'pending'" type="primary" @click="handleAccept">确认接单</a-button>
            <a-button v-if="order.status === 'processing'" type="primary" @click="handleDeliver">提交交付</a-button>
            <a-button v-if="order.status === 'pending'" danger @click="handleReject">拒绝订单</a-button>
          </a-space>
        </div>
      </template>
      <a-empty v-else-if="!orderStore.loading" description="订单不存在" />
    </a-spin>

    <!-- 拒绝弹窗 -->
    <a-modal v-model:open="rejectVisible" title="拒绝订单" @ok="submitReject" :confirm-loading="rejecting">
      <a-form layout="vertical">
        <a-form-item label="拒绝原因" required>
          <a-textarea v-model:value="rejectReason" placeholder="请说明拒绝原因" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useOrderStore } from '@/stores/order'
import StatusTag from '@/components/business/StatusTag.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)
const rejectVisible = ref(false)
const rejectReason = ref('')
const rejecting = ref(false)

const stepMap = { pending: 0, processing: 1, delivering: 2, completed: 4, cancelled: -1, appealing: 2 }
const currentStep = computed(() => {
  if (!order.value) return 0
  return stepMap[order.value.status] ?? 0
})

const formatTime = (t) => (t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '')

const handleAccept = () => {
  Modal.confirm({
    title: '确认接单',
    content: '接受后订单将进入进行中状态，请确保能按时完成。',
    onOk() {
      message.success('接单成功')
      orderStore.fetchOrderDetail(route.params.id)
    },
  })
}

const handleDeliver = () => {
  router.push(`/provider/orders/${route.params.id}/delivery`)
}

const handleReject = () => {
  rejectVisible.value = true
}

const submitReject = async () => {
  if (!rejectReason.value.trim()) {
    message.warning('请填写拒绝原因')
    return
  }
  rejecting.value = true
  try {
    await orderStore.rejectOrder(route.params.id, rejectReason.value)
    rejectVisible.value = false
    rejectReason.value = ''
    orderStore.fetchOrderDetail(route.params.id)
  } finally {
    rejecting.value = false
  }
}

onMounted(() => {
  orderStore.fetchOrderDetail(route.params.id)
})
</script>

<style scoped lang="less">
.order-detail-page {
  .status-card {
    margin-bottom: 16px;
  }
  .info-card {
    margin-bottom: 16px;
  }
  .amount {
    font-size: 18px;
    font-weight: 600;
    color: #ff4d4f;
  }
  .action-bar {
    padding: 16px 0;
    text-align: right;
  }
}
</style>
