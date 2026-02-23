<template>
  <div class="order-arbitration-page">
    <a-spin :spinning="orderStore.loading">
      <template v-if="order">
        <!-- 订单信息 -->
        <a-card title="订单信息" class="section-card">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="订单号">{{ order.orderNo }}</a-descriptions-item>
            <a-descriptions-item label="订单状态">
              <StatusTag :status="order.status" type="order" />
            </a-descriptions-item>
            <a-descriptions-item label="订单金额">
              <span class="amount">¥{{ order.amount }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="服务名称">{{ order.title }}</a-descriptions-item>
            <a-descriptions-item label="买方">{{ order.user || '-' }}</a-descriptions-item>
            <a-descriptions-item label="卖方">{{ order.provider || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- 买方证据 -->
        <a-card title="买方证据" class="section-card">
          <div v-if="order.appeal" class="evidence-section">
            <p><strong>申诉类型：</strong>{{ getAppealTypeLabel(order.appeal.type) }}</p>
            <p><strong>申诉原因：</strong></p>
            <div class="evidence-content">{{ order.appeal.reason || '无' }}</div>
            <div v-if="order.appeal.evidence && order.appeal.evidence.length" class="evidence-files">
              <p><strong>证据附件：</strong></p>
              <a-space wrap>
                <a v-for="(file, idx) in order.appeal.evidence" :key="idx" :href="file" target="_blank">
                  附件{{ idx + 1 }}
                </a>
              </a-space>
            </div>
          </div>
          <a-empty v-else description="暂无买方证据" />
        </a-card>

        <!-- 卖方证据 -->
        <a-card title="卖方证据" class="section-card">
          <div v-if="order.providerEvidence" class="evidence-section">
            <div class="evidence-content">{{ order.providerEvidence.description || '无' }}</div>
            <div v-if="order.providerEvidence.files && order.providerEvidence.files.length" class="evidence-files">
              <p><strong>证据附件：</strong></p>
              <a-space wrap>
                <a v-for="(file, idx) in order.providerEvidence.files" :key="idx" :href="file" target="_blank">
                  附件{{ idx + 1 }}
                </a>
              </a-space>
            </div>
          </div>
          <a-empty v-else description="暂无卖方证据" />
        </a-card>

        <!-- 仲裁意见 -->
        <a-card title="仲裁处理" class="section-card">
          <a-form layout="vertical" :model="formState">
            <a-form-item label="仲裁意见" required>
              <RichTextEditor
                v-model="formState.opinion"
                placeholder="请输入仲裁意见..."
                :rows="6"
                :max-length="3000"
              />
            </a-form-item>

            <a-form-item label="仲裁结果" required>
              <a-radio-group v-model:value="formState.result">
                <a-radio-button value="buyer">支持买方（退款）</a-radio-button>
                <a-radio-button value="seller">支持卖方（放款）</a-radio-button>
                <a-radio-button value="partial">部分退款</a-radio-button>
              </a-radio-group>
            </a-form-item>

            <a-form-item v-if="formState.result === 'partial'" label="退款金额" required>
              <a-input-number
                v-model:value="formState.refundAmount"
                :min="0"
                :max="order.amount"
                :precision="2"
                prefix="¥"
                style="width: 200px"
              />
            </a-form-item>
          </a-form>
        </a-card>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <a-space>
            <a-button @click="router.back()">返回</a-button>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">提交仲裁结果</a-button>
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
import StatusTag from '@/components/business/StatusTag.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = computed(() => orderStore.currentOrder)
const submitting = ref(false)

const formState = reactive({
  opinion: '',
  result: undefined,
  refundAmount: 0,
})

const appealTypeMap = {
  quality: '服务质量不达标',
  delay: '未按时交付',
  communication: '沟通问题',
  other: '其他',
}

const getAppealTypeLabel = (type) => appealTypeMap[type] || type || '未知'

const handleSubmit = async () => {
  if (!formState.opinion.trim()) {
    message.warning('请填写仲裁意见')
    return
  }
  if (!formState.result) {
    message.warning('请选择仲裁结果')
    return
  }
  if (formState.result === 'partial' && (!formState.refundAmount || formState.refundAmount <= 0)) {
    message.warning('请输入有效的退款金额')
    return
  }

  submitting.value = true
  try {
    await orderStore.arbitrateOrder(route.params.id, {
      opinion: formState.opinion,
      result: formState.result,
      refundAmount: formState.result === 'partial' ? formState.refundAmount : undefined,
    })
    router.push('/admin/orders/appeals')
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
.order-arbitration-page {
  .section-card {
    margin-bottom: 16px;
  }
  .amount {
    font-weight: 600;
    color: #ff4d4f;
  }
  .evidence-section {
    .evidence-content {
      background: #fafafa;
      padding: 12px;
      border-radius: 4px;
      margin: 8px 0;
      white-space: pre-wrap;
    }
    .evidence-files {
      margin-top: 12px;
    }
  }
  .action-bar {
    padding: 16px 0;
    text-align: right;
  }
}
</style>
