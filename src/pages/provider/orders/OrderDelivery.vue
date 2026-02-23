<template>
  <div class="order-delivery-page">
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
            <a-descriptions-item label="交付期限">{{ order.deadline || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 交付物上传区域 -->
        <a-card title="交付物上传" class="section-card">
          <a-form layout="vertical">
            <a-form-item label="上传文件（支持多文件：代码、文档、设计稿等）">
              <ImageUpload
                :max-count="10"
                :max-size="50"
                accept="*"
                @change="handleFileChange"
              />
            </a-form-item>

            <a-form-item label="交付说明">
              <a-textarea
                v-model:value="deliveryNote"
                placeholder="请描述交付物内容、使用说明等..."
                :rows="6"
                :maxlength="2000"
                show-count
              />
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 提交按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="router.back()">取消</a-button>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">提交交付</a-button>
          </a-space>
        </div>
      </template>
      <a-empty v-else-if="!orderStore.loading" description="订单不存在" />
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useOrderStore } from '@/stores/order'
import ImageUpload from '@/components/common/ImageUpload.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)
const deliveryNote = ref('')
const fileList = ref([])
const submitting = ref(false)

const handleFileChange = (files) => {
  fileList.value = files
}

const handleSubmit = async () => {
  if (!fileList.value.length) {
    message.warning('请至少上传一个交付文件')
    return
  }
  if (!deliveryNote.value.trim()) {
    message.warning('请填写交付说明')
    return
  }

  submitting.value = true
  try {
    await orderStore.deliverOrder(route.params.id, {
      files: fileList.value.map((f) => f.response?.url || f.url || f.name),
      note: deliveryNote.value,
    })
    router.push(`/provider/orders/${route.params.id}`)
  } catch {
    // error handled in store
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  orderStore.fetchOrderDetail(route.params.id)
})
</script>

<style scoped lang="less">
.order-delivery-page {
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
