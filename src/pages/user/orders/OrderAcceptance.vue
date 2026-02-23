<template>
  <div class="order-acceptance-page">
    <a-spin :spinning="orderStore.loading">
      <template v-if="order">
        <!-- 订单信息 -->
        <a-card title="订单信息" class="section-card">
          <a-descriptions :column="2" size="small">
            <a-descriptions-item label="订单号">{{ order.orderNo }}</a-descriptions-item>
            <a-descriptions-item label="服务名称">{{ order.title }}</a-descriptions-item>
            <a-descriptions-item label="订单金额">
              <span class="amount">¥{{ order.amount }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务商">{{ order.provider || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 交付物查看/下载 -->
        <a-card title="交付物" class="section-card">
          <a-list v-if="order.deliverables && order.deliverables.length" :data-source="order.deliverables" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :title="item.name" :description="item.description" />
                <template #actions>
                  <a-button type="link" size="small" @click="downloadFile(item)">下载</a-button>
                </template>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="暂无交付物" />
        </a-card>

        <!-- 验收评分 -->
        <a-card title="验收评分" class="section-card">
          <a-form layout="vertical">
            <a-form-item label="服务质量">
              <a-rate v-model:value="ratings.quality" allow-half />
            </a-form-item>
            <a-form-item label="沟通效率">
              <a-rate v-model:value="ratings.communication" allow-half />
            </a-form-item>
            <a-form-item label="交付速度">
              <a-rate v-model:value="ratings.speed" allow-half />
            </a-form-item>
            <a-form-item label="验收备注">
              <a-textarea v-model:value="acceptNote" placeholder="请输入验收备注（可选）" :rows="3" />
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="router.back()">返回</a-button>
            <a-button danger @click="showRejectModal">拒绝验收</a-button>
            <a-button type="primary" :loading="submitting" @click="handleAccept">验收通过</a-button>
          </a-space>
        </div>
      </template>
      <a-empty v-else-if="!orderStore.loading" description="订单不存在" />
    </a-spin>

    <!-- 拒绝验收弹窗 -->
    <a-modal v-model:open="rejectVisible" title="拒绝验收" @ok="handleReject" :confirm-loading="rejecting">
      <a-form layout="vertical">
        <a-form-item label="拒绝原因" required>
          <a-textarea v-model:value="rejectReason" placeholder="请详细说明拒绝验收的原因" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)
const submitting = ref(false)
const rejectVisible = ref(false)
const rejectReason = ref('')
const rejecting = ref(false)
const acceptNote = ref('')

const ratings = reactive({
  quality: 5,
  communication: 5,
  speed: 5,
})

const downloadFile = (item) => {
  if (item.url) window.open(item.url)
  else message.info('文件暂不可下载')
}

const handleAccept = async () => {
  submitting.value = true
  try {
    await orderStore.acceptOrder(route.params.id, {
      ratings: { ...ratings },
      note: acceptNote.value,
    })
    router.push(`/user/orders/${route.params.id}`)
  } catch {
    // handled in store
  } finally {
    submitting.value = false
  }
}

const showRejectModal = () => {
  rejectVisible.value = true
}

const handleReject = async () => {
  if (!rejectReason.value.trim()) {
    message.warning('请填写拒绝原因')
    return
  }
  rejecting.value = true
  try {
    await orderStore.rejectOrder(route.params.id, rejectReason.value)
    rejectVisible.value = false
    router.push(`/user/orders/${route.params.id}`)
  } catch {
    // handled in store
  } finally {
    rejecting.value = false
  }
}

onMounted(() => {
  orderStore.fetchOrderDetail(route.params.id)
})
</script>

<style scoped lang="less">
.order-acceptance-page {
  .section-card {
    margin-bottom: 16px;
  }
  .amount {
    font-weight: 600;
    color: #ff4d4f;
  }
  .action-bar {
    padding: 16px 0;
    text-align: right;
  }
}
</style>
