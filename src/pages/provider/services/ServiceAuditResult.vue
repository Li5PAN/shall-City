<template>
  <div class="service-audit-result-page">
    <a-spin :spinning="loading">
      <!-- 审核结果面板 -->
      <AuditResultPanel
        :status="auditStatus"
        :reason="auditReason"
        :audit-time="auditTime"
        :allow-resubmit="auditStatus === 'rejected'"
        @resubmit="handleResubmit"
      />

      <!-- 服务摘要 -->
      <a-card v-if="serviceStore.currentService" title="服务摘要" class="summary-card">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="服务名称">
            {{ serviceStore.currentService.title }}
          </a-descriptions-item>
          <a-descriptions-item label="服务分类">
            {{ serviceStore.currentService.category }}
          </a-descriptions-item>
          <a-descriptions-item label="服务价格">
            ¥{{ serviceStore.currentService.price }}
          </a-descriptions-item>
          <a-descriptions-item label="交付周期">
            {{ serviceStore.currentService.deliveryDays || '-' }} 天
          </a-descriptions-item>
          <a-descriptions-item label="服务描述" :span="2">
            {{ serviceStore.currentService.description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-space>
          <a-button @click="goBack">返回服务管理</a-button>
          <a-button
            v-if="auditStatus === 'approved'"
            type="primary"
            @click="goToDetail"
          >
            查看服务详情
          </a-button>
        </a-space>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuditResultPanel from '@/components/business/AuditResultPanel.vue'
import { useServiceStore } from '@/stores/service'

const route = useRoute()
const router = useRouter()
const serviceStore = useServiceStore()
const loading = ref(false)

const serviceId = computed(() => route.params.id)

const auditStatus = computed(() => {
  const status = serviceStore.currentService?.auditStatus
  if (status === 'approved' || status === 'rejected' || status === 'pending') return status
  return 'pending'
})

const auditReason = computed(() => serviceStore.currentService?.rejectReason || '')
const auditTime = computed(() => serviceStore.currentService?.auditTime || '')

const handleResubmit = () => {
  router.push({ path: `/provider/services/edit/${serviceId.value}` })
}

const goBack = () => {
  router.push('/provider/services')
}

const goToDetail = () => {
  router.push(`/user/services/${serviceId.value}`)
}

onMounted(async () => {
  if (serviceId.value) {
    loading.value = true
    await serviceStore.fetchServiceDetail(serviceId.value)
    loading.value = false
  }
})
</script>

<style scoped lang="less">
.service-audit-result-page {
  .summary-card {
    margin-top: 24px;
  }

  .action-bar {
    margin-top: 24px;
    text-align: center;
  }
}
</style>
