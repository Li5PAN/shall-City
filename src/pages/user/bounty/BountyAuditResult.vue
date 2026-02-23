<template>
  <div class="bounty-audit-result-page">
    <a-spin :spinning="loading">
      <!-- 审核结果面板 -->
      <AuditResultPanel
        :status="auditStatus"
        :reason="auditReason"
        :audit-time="auditTime"
        :allow-resubmit="auditStatus === 'rejected'"
        @resubmit="handleResubmit"
      />

      <!-- 需求摘要 -->
      <a-card v-if="bountyStore.currentBounty" title="需求摘要" class="summary-card">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="需求标题">
            {{ bountyStore.currentBounty.title }}
          </a-descriptions-item>
          <a-descriptions-item label="分类">
            {{ bountyStore.currentBounty.category }}
          </a-descriptions-item>
          <a-descriptions-item label="预算">
            ¥{{ bountyStore.currentBounty.budget }}
          </a-descriptions-item>
          <a-descriptions-item label="截止日期">
            {{ formatTime(bountyStore.currentBounty.deadline) }}
          </a-descriptions-item>
          <a-descriptions-item label="需求描述" :span="2">
            {{ bountyStore.currentBounty.description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-space>
          <a-button @click="goBack">返回列表</a-button>
          <a-button
            v-if="auditStatus === 'approved'"
            type="primary"
            @click="goToDetail"
          >
            查看悬赏详情
          </a-button>
        </a-space>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import AuditResultPanel from '@/components/business/AuditResultPanel.vue'
import { useBountyStore } from '@/stores/bounty'

const route = useRoute()
const router = useRouter()
const bountyStore = useBountyStore()
const loading = ref(false)

const bountyId = computed(() => route.params.id)

const auditStatus = computed(() => {
  const status = bountyStore.currentBounty?.auditStatus
  if (status === 'approved' || status === 'rejected' || status === 'pending') return status
  return 'pending'
})

const auditReason = computed(() => bountyStore.currentBounty?.rejectReason || '')
const auditTime = computed(() => bountyStore.currentBounty?.auditTime || '')

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD') : '-'
}

const handleResubmit = () => {
  router.push({ path: '/user/bounty/create', query: { editId: bountyId.value } })
}

const goBack = () => {
  router.push('/user/bounty')
}

const goToDetail = () => {
  router.push(`/user/bounty/${bountyId.value}`)
}

onMounted(async () => {
  if (bountyId.value) {
    loading.value = true
    await bountyStore.fetchBountyDetail(bountyId.value)
    loading.value = false
  }
})
</script>

<style scoped lang="less">
.bounty-audit-result-page {
  .summary-card {
    margin-top: 24px;
  }

  .action-bar {
    margin-top: 24px;
    text-align: center;
  }
}
</style>
