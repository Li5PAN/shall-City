<template>
  <div class="service-purchase-page">
    <a-spin :spinning="loading">
      <!-- 订单确认区 -->
      <a-card title="订单确认" class="section-card" v-if="service">
        <div class="order-summary">
          <div class="service-info">
            <img :src="service.coverImage" :alt="service.title" class="service-cover" />
            <div class="service-detail">
              <h3>{{ service.title }}</h3>
              <p class="service-desc">{{ service.description }}</p>
              <div class="service-provider">
                <a-avatar :src="service.provider?.avatar" :size="20" />
                <span>{{ service.provider?.username }}</span>
              </div>
            </div>
            <div class="service-price">
              <span class="unit-price">¥{{ service.price }}</span>
            </div>
          </div>

          <a-divider />

          <a-row :gutter="16" align="middle" class="quantity-row">
            <a-col :span="4"><span class="label">购买数量</span></a-col>
            <a-col :span="8">
              <a-input-number v-model:value="quantity" :min="1" :max="99" />
            </a-col>
          </a-row>

          <a-divider />

          <div class="total-section">
            <span class="total-label">合计金额：</span>
            <span class="total-price">¥{{ totalPrice }}</span>
          </div>
        </div>
      </a-card>

      <!-- 支付方式选择 -->
      <a-card title="支付方式" class="section-card" v-if="service">
        <a-radio-group v-model:value="paymentMethod" class="payment-methods">
          <a-radio value="alipay" class="payment-option">
            <div class="payment-item">
              <AlipayCircleOutlined class="payment-icon alipay-icon" />
              <span>支付宝</span>
            </div>
          </a-radio>
          <a-radio value="wechat" class="payment-option">
            <div class="payment-item">
              <WechatOutlined class="payment-icon wechat-icon" />
              <span>微信支付</span>
            </div>
          </a-radio>
          <a-radio value="balance" class="payment-option">
            <div class="payment-item">
              <WalletOutlined class="payment-icon balance-icon" />
              <span>余额支付</span>
            </div>
          </a-radio>
        </a-radio-group>
      </a-card>

      <!-- 确认支付 -->
      <div class="submit-section" v-if="service">
        <div class="submit-info">
          <span>应付金额：</span>
          <span class="submit-price">¥{{ totalPrice }}</span>
        </div>
        <a-button
          type="primary"
          size="large"
          :loading="submitting"
          class="submit-btn"
          @click="handleSubmit"
        >
          确认支付
        </a-button>
      </div>

      <!-- 空状态 -->
      <a-empty v-if="!loading && !service" description="服务信息加载失败">
        <a-button type="primary" @click="$router.back()">返回</a-button>
      </a-empty>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { AlipayCircleOutlined, WechatOutlined, WalletOutlined } from '@ant-design/icons-vue'
import { useServiceStore } from '@/stores/service'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const serviceStore = useServiceStore()
const orderStore = useOrderStore()

const serviceId = computed(() => route.params.id)
const loading = computed(() => serviceStore.loading)
const service = computed(() => serviceStore.currentService)

const quantity = ref(1)
const paymentMethod = ref('alipay')
const submitting = ref(false)

const totalPrice = computed(() => {
  if (!service.value) return 0
  return (service.value.price * quantity.value).toFixed(2)
})

const handleSubmit = async () => {
  if (!paymentMethod.value) {
    message.warning('请选择支付方式')
    return
  }

  submitting.value = true
  try {
    const res = await orderStore.createOrder({
      serviceId: serviceId.value,
      quantity: quantity.value,
      paymentMethod: paymentMethod.value,
      totalAmount: totalPrice.value,
    })
    const orderId = res?.id || res?.orderId
    if (orderId) {
      router.push(`/user/orders/${orderId}`)
    } else {
      router.push('/user/orders')
    }
  } catch {
    // error handled in store
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (serviceId.value) {
    await serviceStore.fetchServiceDetail(serviceId.value)
  }
})
</script>

<style scoped lang="less">
.service-purchase-page {
  max-width: 800px;
  margin: 0 auto;

  .section-card {
    margin-bottom: 24px;
  }

  .order-summary {
    .service-info {
      display: flex;
      gap: 16px;
      align-items: flex-start;

      .service-cover {
        width: 120px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        flex-shrink: 0;
      }

      .service-detail {
        flex: 1;

        h3 {
          margin: 0 0 8px;
          font-size: 16px;
        }

        .service-desc {
          color: #666;
          font-size: 13px;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .service-provider {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999;
          font-size: 13px;
        }
      }

      .service-price {
        flex-shrink: 0;

        .unit-price {
          font-size: 20px;
          font-weight: bold;
          color: #f5222d;
        }
      }
    }

    .quantity-row {
      .label {
        font-size: 14px;
        color: #333;
      }
    }

    .total-section {
      text-align: right;

      .total-label {
        font-size: 16px;
        color: #333;
      }

      .total-price {
        font-size: 24px;
        font-weight: bold;
        color: #f5222d;
      }
    }
  }

  .payment-methods {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .payment-option {
      .payment-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;

        .payment-icon {
          font-size: 24px;
        }

        .alipay-icon {
          color: #1677ff;
        }

        .wechat-icon {
          color: #07c160;
        }

        .balance-icon {
          color: #faad14;
        }
      }
    }
  }

  .submit-section {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;

    .submit-info {
      font-size: 16px;

      .submit-price {
        font-size: 24px;
        font-weight: bold;
        color: #f5222d;
      }
    }

    .submit-btn {
      width: 160px;
      height: 44px;
      font-size: 16px;
    }
  }
}
</style>
