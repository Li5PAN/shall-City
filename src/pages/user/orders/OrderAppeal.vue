<template>
  <div class="order-appeal-page">
    <a-spin :spinning="orderStore.loading">
      <template v-if="order">
        <!-- 订单信息摘要 -->
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

        <!-- 申诉表单 -->
        <a-card title="申诉信息" class="section-card">
          <a-form layout="vertical" :model="formState">
            <a-form-item label="申诉类型" required>
              <a-select v-model:value="formState.type" placeholder="请选择申诉类型">
                <a-select-option v-for="t in appealTypes" :key="t.value" :value="t.value">
                  {{ t.label }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="申诉原因描述" required>
              <RichTextEditor
                v-model="formState.reason"
                placeholder="请详细描述申诉原因..."
                :rows="8"
                :max-length="3000"
              />
            </a-form-item>

            <a-form-item label="证据上传">
              <ImageUpload
                :max-count="9"
                :max-size="10"
                accept="image/*,.pdf,.doc,.docx,.zip"
                @change="handleEvidenceChange"
              />
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 提交按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="router.back()">取消</a-button>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">提交申诉</a-button>
          </a-space>
        </div>
      </template>
      <a-empty v-else-if="!orderStore.loading" description="订单不存在" />
    </a-spin>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useOrderStore } from '@/stores/order'
import ImageUpload from '@/components/common/ImageUpload.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)
const submitting = ref(false)

const appealTypes = [
  { value: 'quality', label: '服务质量不达标' },
  { value: 'delay', label: '未按时交付' },
  { value: 'communication', label: '沟通问题' },
  { value: 'other', label: '其他' },
]

const formState = reactive({
  type: undefined,
  reason: '',
  evidence: [],
})

const handleEvidenceChange = (files) => {
  formState.evidence = files
}

const handleSubmit = async () => {
  if (!formState.type) {
    message.warning('请选择申诉类型')
    return
  }
  if (!formState.reason.trim()) {
    message.warning('请填写申诉原因')
    return
  }

  submitting.value = true
  try {
    await orderStore.appealOrder(route.params.id, {
      type: formState.type,
      reason: formState.reason,
      evidence: formState.evidence.map((f) => f.response?.url || f.url || f.name),
    })
    router.push(`/user/orders/${route.params.id}`)
  } catch {
    // handled in store
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  orderStore.fetchOrderDetail(route.params.id)
})
</script>

<style scoped lang="less">
.order-appeal-page {
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
