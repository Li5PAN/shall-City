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
            <a-descriptions-item label="服务商">{{ order.provider || '-' }}</a-descriptions-item>
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
                <template #actions>
                  <a-button type="link" size="small" @click="downloadFile(item)">下载</a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="router.back()">返回</a-button>
            <a-button v-if="order.status === 'pending'" type="primary" @click="handlePay">去支付</a-button>
            <a-button v-if="order.status === 'delivering'" type="primary" @click="handleAcceptance">验收</a-button>
            <a-button v-if="['processing', 'delivering'].includes(order.status)" danger @click="handleAppeal">申诉</a-button>
            <a-button v-if="order.status === 'pending'" @click="handleCancel">取消订单</a-button>
          </a-space>
        </div>
      </template>
      <a-empty v-else-if="!orderStore.loading" description="订单不存在" />
    </a-spin>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useOrderStore } from '@/stores/order'
import StatusTag from '@/components/business/StatusTag.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)

const stepMap = { pending: 0, processing: 1, delivering: 2, completed: 4, cancelled: -1, appealing: 2 }
const currentStep = computed(() => {
  if (!order.value) return 0
  return stepMap[order.value.status] ?? 0
})

const formatTime = (t) => (t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '')

const downloadFile = (item) => {
  if (item.url) window.open(item.url)
  else message.info('文件暂不可下载')
}

const handlePay = () => message.info('支付功能开发中')
const handleAcceptance = () => router.push(`/user/orders/${route.params.id}/acceptance`)
const handleAppeal = () => router.push(`/user/orders/${route.params.id}/appeal`)
const handleCancel = () => {
  Modal.confirm({
    title: '确认取消订单？',
    content: '取消后不可恢复',
    onOk() { message.success('订单已取消') },
  })
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
