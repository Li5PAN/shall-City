<template>
  <a-tag :color="tagColor">{{ tagLabel }}</a-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'order',
    validator: (val) => ['order', 'bounty', 'service', 'audit'].includes(val)
  }
})

const statusMap = {
  order: {
    pending: { color: 'orange', label: '待支付' },
    processing: { color: 'blue', label: '进行中' },
    delivering: { color: 'cyan', label: '待验收' },
    completed: { color: 'green', label: '已完成' },
    cancelled: { color: 'default', label: '已取消' },
    appealing: { color: 'red', label: '申诉中' },
    refunded: { color: 'purple', label: '已退款' }
  },
  bounty: {
    draft: { color: 'default', label: '草稿' },
    pending: { color: 'orange', label: '待审核' },
    published: { color: 'blue', label: '招募中' },
    processing: { color: 'cyan', label: '进行中' },
    completed: { color: 'green', label: '已完成' },
    cancelled: { color: 'default', label: '已取消' },
    rejected: { color: 'red', label: '已驳回' }
  },
  service: {
    draft: { color: 'default', label: '草稿' },
    pending: { color: 'orange', label: '待审核' },
    active: { color: 'green', label: '已上架' },
    inactive: { color: 'default', label: '已下架' },
    rejected: { color: 'red', label: '已驳回' }
  },
  audit: {
    pending: { color: 'orange', label: '待审核' },
    approved: { color: 'green', label: '已通过' },
    rejected: { color: 'red', label: '已驳回' }
  }
}

const tagColor = computed(() => {
  const map = statusMap[props.type] || {}
  return map[props.status]?.color || 'default'
})

const tagLabel = computed(() => {
  const map = statusMap[props.type] || {}
  return map[props.status]?.label || props.status
})
</script>
