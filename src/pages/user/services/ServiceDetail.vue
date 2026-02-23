<template>
  <div class="service-detail-page">
    <a-spin :spinning="loading">
      <!-- 服务封面 + 基本信息 -->
      <div class="service-header" v-if="service">
        <a-row :gutter="32">
          <a-col :span="10">
            <div class="cover-wrapper">
              <img :src="service.coverImage" :alt="service.title" class="cover-image" />
            </div>
          </a-col>
          <a-col :span="14">
            <div class="basic-info">
              <h1 class="service-title">{{ service.title }}</h1>
              <div class="service-tags">
                <StatusTag :status="service.status || 'active'" type="service" />
                <a-tag v-for="tag in (service.tags || [])" :key="tag" color="blue">{{ tag }}</a-tag>
              </div>
              <div class="price-section">
                <span class="current-price">¥{{ service.price }}</span>
                <span v-if="service.originalPrice > service.price" class="original-price">
                  ¥{{ service.originalPrice }}
                </span>
              </div>
              <div class="stats-row">
                <a-rate :value="service.rating || 0" disabled allow-half />
                <span class="rating-text">{{ service.rating || 0 }} 分</span>
                <a-divider type="vertical" />
                <span>{{ service.reviews || 0 }} 条评价</span>
                <a-divider type="vertical" />
                <span>已售 {{ service.sales || 0 }} 件</span>
              </div>
              <a-descriptions :column="2" class="info-descriptions">
                <a-descriptions-item label="服务分类">{{ service.category || '-' }}</a-descriptions-item>
                <a-descriptions-item label="交付周期">{{ service.deliveryDays || '-' }} 天</a-descriptions-item>
              </a-descriptions>
              <a-button type="primary" size="large" class="purchase-btn" @click="handlePurchase">
                <ShoppingCartOutlined /> 立即购买
              </a-button>
            </div>
          </a-col>
        </a-row>
      </div>

      <!-- 详细描述 -->
      <a-card title="服务详情" class="section-card" v-if="service">
        <div class="description-content" v-html="service.detailDescription || service.description || '暂无详细描述'"></div>
      </a-card>

      <!-- 提供方信息 -->
      <a-card title="服务提供方" class="section-card" v-if="service?.provider">
        <div class="provider-section">
          <div class="provider-profile">
            <a-avatar :src="service.provider.avatar" :size="64">
              {{ service.provider.username?.charAt(0) }}
            </a-avatar>
            <div class="provider-detail">
              <h3>{{ service.provider.username }}</h3>
              <p class="provider-bio">{{ service.provider.bio || '暂无简介' }}</p>
              <div class="provider-stats">
                <span>服务数: {{ service.provider.serviceCount || 0 }}</span>
                <a-divider type="vertical" />
                <span>好评率: {{ service.provider.goodRate || '100%' }}</span>
                <a-divider type="vertical" />
                <span>入驻时间: {{ formatDate(service.provider.joinDate) }}</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <!-- 用户评价 -->
      <a-card title="用户评价" class="section-card" v-if="service">
        <CommentList
          :comments="service.commentList || []"
          :loading="false"
          :allow-reply="true"
          @submit="handleCommentSubmit"
          @like="handleCommentLike"
          @delete="handleCommentDelete"
        />
      </a-card>

      <!-- 空状态 -->
      <a-empty v-if="!loading && !service" description="服务不存在或已下架" />
    </a-spin>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCartOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useServiceStore } from '@/stores/service'
import CommentList from '@/components/business/CommentList.vue'
import StatusTag from '@/components/business/StatusTag.vue'

const route = useRoute()
const router = useRouter()
const serviceStore = useServiceStore()

const serviceId = computed(() => route.params.id)
const loading = computed(() => serviceStore.loading)
const service = computed(() => serviceStore.currentService)

const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '-'
}

const handlePurchase = () => {
  router.push(`/user/services/${serviceId.value}/purchase`)
}

const handleCommentSubmit = (content, parentId) => {
  console.log('提交评论:', content, parentId)
}

const handleCommentLike = (commentId) => {
  console.log('点赞评论:', commentId)
}

const handleCommentDelete = (commentId) => {
  console.log('删除评论:', commentId)
}

onMounted(async () => {
  if (serviceId.value) {
    await serviceStore.fetchServiceDetail(serviceId.value)
  }
})
</script>

<style scoped lang="less">
.service-detail-page {
  .service-header {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;

    .cover-wrapper {
      border-radius: 8px;
      overflow: hidden;

      .cover-image {
        width: 100%;
        height: 320px;
        object-fit: cover;
        display: block;
      }
    }

    .basic-info {
      .service-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #333;
      }

      .service-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      }

      .price-section {
        margin-bottom: 16px;

        .current-price {
          font-size: 28px;
          font-weight: bold;
          color: #f5222d;
        }

        .original-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
          margin-left: 12px;
        }
      }

      .stats-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        color: #666;
        font-size: 14px;

        .rating-text {
          font-weight: 500;
          color: #faad14;
        }
      }

      .info-descriptions {
        margin-bottom: 24px;
      }

      .purchase-btn {
        width: 200px;
        height: 44px;
        font-size: 16px;
      }
    }
  }

  .section-card {
    margin-bottom: 24px;
  }

  .description-content {
    line-height: 1.8;
    color: #333;
    font-size: 14px;
  }

  .provider-section {
    .provider-profile {
      display: flex;
      gap: 20px;
      align-items: flex-start;

      .provider-detail {
        flex: 1;

        h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .provider-bio {
          color: #666;
          margin-bottom: 12px;
        }

        .provider-stats {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
