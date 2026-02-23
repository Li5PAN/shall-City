<template>
  <div class="order-card" @click="handleClick">
    <div class="order-card__header">
      <span class="order-card__no">订单号：{{ order.orderNo }}</span>
      <StatusTag :status="order.status" type="order" />
    </div>
    <div class="order-card__body">
      <h4 class="order-card__title">{{ order.title }}</h4>
      <div class="order-card__info">
        <span class="order-card__amount">¥{{ order.amount }}</span>
        <span class="order-card__time">{{ formatTime(order.createdAt) }}</span>
      </div>
      <div v-if="role === 'user' && order.provider" class="order-card__party">
        服务商：{{ order.provider }}
      </div>
      <div v-if="role === 'provider' && order.user" class="order-card__party">
        用户：{{ order.user }}
      </div>
    </div>
    <div class="order-card__actions">
      <template v-if="role === 'user'">
        <a-button v-if="order.status === 'pending'" size="small" type="primary" @click.stop="handleAction('pay')">去支付</a-button>
        <a-button v-if="order.status === 'delivering'" size="small" type="primary" @click.stop="handleAction('accept')">验收</a-button>
        <a-button v-if="order.status === 'completed'" size="small" @click.stop="handleAction('review')">评价</a-button>
        <a-button v-if="['processing', 'delivering'].includes(order.status)" size="small" danger @click.stop="handleAction('appeal')">申诉</a-button>
      </template>
      <template v-if="role === 'provider'">
        <a-button v-if="order.status === 'pending'" size="small" type="primary" @click.stop="handleAction('confirm')">确认接单</a-button>
        <a-button v-if="order.status === 'processing'" size="small" type="primary" @click.stop="handleAction('deliver')">提交交付</a-button>
      </template>
      <template v-if="role === 'admin'">
        <a-button v-if="order.status === 'appealing'" size="small" type="primary" @click.stop="handleAction('arbitrate')">仲裁</a-button>
        <a-button size="small" @click.stop="handleAction('detail')">查看详情</a-button>
      </template>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import StatusTag from './StatusTag.vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  },
  role: {
    type: String,
    default: 'user',
    validator: (val) => ['user', 'provider', 'admin'].includes(val)
  }
})

const emit = defineEmits(['click', 'action'])

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''
}

const handleClick = () => {
  emit('click', props.order.id)
}

const handleAction = (type) => {
  emit('action', type, props.order.id)
}
</script>

<style scoped lang="less">
.order-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.3s;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__no {
    font-size: 13px;
    color: #999;
  }

  &__title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin: 0 0 8px;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  &__amount {
    font-size: 16px;
    font-weight: 600;
    color: #ff4d4f;
  }

  &__time {
    font-size: 13px;
    color: #999;
  }

  &__party {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
