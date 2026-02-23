<template>
  <div :class="['audit-result-panel', `audit-result-panel--${status}`]">
    <a-result
      :status="resultStatus"
      :title="resultTitle"
      :sub-title="resultSubTitle"
    >
      <template #extra>
        <div v-if="status === 'rejected' && reason" class="audit-result-panel__reason">
          <a-alert type="error" show-icon>
            <template #message>驳回原因</template>
            <template #description>{{ reason }}</template>
          </a-alert>
        </div>
        <div v-if="auditTime" class="audit-result-panel__time">
          审核时间：{{ formatTime(auditTime) }}
        </div>
        <div class="audit-result-panel__actions">
          <a-button
            v-if="status === 'rejected' && allowResubmit"
            type="primary"
            @click="handleResubmit"
          >
            修改后重新提交
          </a-button>
        </div>
      </template>
    </a-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (val) => ['pending', 'approved', 'rejected'].includes(val)
  },
  reason: {
    type: String,
    default: ''
  },
  auditTime: {
    type: String,
    default: ''
  },
  allowResubmit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['resubmit'])

const statusConfig = {
  pending: { status: 'info', title: '审核中', subTitle: '您提交的内容正在审核中，请耐心等待' },
  approved: { status: 'success', title: '审核通过', subTitle: '恭喜，您提交的内容已通过审核' },
  rejected: { status: 'error', title: '审核未通过', subTitle: '很抱歉，您提交的内容未通过审核' }
}

const resultStatus = computed(() => statusConfig[props.status]?.status || 'info')
const resultTitle = computed(() => statusConfig[props.status]?.title || '')
const resultSubTitle = computed(() => statusConfig[props.status]?.subTitle || '')

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
}

const handleResubmit = () => {
  emit('resubmit')
}
</script>

<style scoped lang="less">
.audit-result-panel {
  padding: 24px;
  background: #fff;
  border-radius: 8px;

  &__reason {
    margin-bottom: 16px;
    text-align: left;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  &__time {
    color: #999;
    font-size: 13px;
    margin-bottom: 16px;
  }

  &__actions {
    margin-top: 8px;
  }
}
</style>
