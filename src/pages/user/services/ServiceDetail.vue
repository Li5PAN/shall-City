<template>
  <div class="service-detail-page">
    <a-spin :spinning="loading">
      <div v-if="service" class="detail-content">
        <!-- 顶部：左侧展示 + 右侧购买信息 -->
        <div class="top-section">
          <div class="left-panel">
            <!-- 服务商信息条 -->
            <div class="shop-bar">
              <span class="shop-name">{{ service.provider?.shopName || 'YC智能开发站' }}</span>
              <span class="shop-tag">{{ service.provider?.tag || '开店3年' }}</span>
            </div>
            <!-- 主图展示 -->
            <div class="main-preview">
              <div class="preview-left">
                <h4 class="preview-title">{{ service.subTitle || '商城DIY装修' }}</h4>
                <p class="preview-desc">{{ service.shortDesc || '微信平台定制化商城开发，包含前端页面、后台管理、支付对接等完整功能' }}</p>
              </div>
              <div class="preview-right">
                <img :src="service.coverImage" :alt="service.title" class="preview-img" />
              </div>
            </div>
            <!-- 缩略图列表 -->
            <div class="thumb-list">
              <div
                v-for="(img, idx) in service.gallery || defaultGallery"
                :key="idx"
                :class="['thumb-item', { active: activeThumb === idx }]"
                @click="activeThumb = idx"
              >
                <img :src="img" :alt="`预览${idx + 1}`" />
              </div>
            </div>
          </div>

          <div class="right-panel">
            <h2 class="service-title">{{ service.title }}</h2>
            <div class="price-row">
              <span class="price">¥{{ service.price }}</span>
              <div class="price-note">
                <span>◎ 当天支付</span>
                <span>预计最快{{ service.deliveryDays || 7 }}个工作日交付</span>
              </div>
            </div>
            <div class="price-divider"></div>

            <!-- 配置选项 -->
            <div class="config-section">
              <div class="config-row">
                <span class="config-label">项目经理</span>
                <span class="config-value">{{ service.config?.pm || 1 }}名</span>
              </div>
              <div class="config-row">
                <span class="config-label">UI设计|师</span>
                <span class="config-value">{{ service.config?.designer || 1 }}名</span>
              </div>
              <div class="config-row">
                <span class="config-label">后端开发</span>
                <span class="config-value">{{ service.config?.developer || 1 }}名</span>
              </div>
              <div class="config-row">
                <span class="config-label">类型选|择</span>
                <a-select v-model:value="selectedType" size="small" style="width: 120px">
                  <a-select-option value="standard">成品类型</a-select-option>
                  <a-select-option value="custom">定制类型</a-select-option>
                </a-select>
              </div>
              <div class="config-row">
                <span class="config-label">交期(含交付时间)</span>
                <span class="config-value">{{ service.config?.period || 3 }}</span>
              </div>
            </div>

            <!-- 购买数量 -->
            <div class="quantity-section">
              <span class="quantity-label">购买数量</span>
              <div class="quantity-control">
                <a-button size="small" @click="quantity > 1 && quantity--">-</a-button>
                <span class="quantity-num">{{ quantity }}</span>
                <a-button size="small" @click="quantity++">+</a-button>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <a-button size="large" class="btn-consult" @click="handleConsult">在线咨询</a-button>
              <a-button type="primary" size="large" class="btn-buy" @click="handlePurchase">立即购买</a-button>
            </div>
          </div>
        </div>

        <!-- 服务详情 -->
        <div class="detail-section">
          <h3 class="section-title">服务详情</h3>
          <div class="detail-body">
            <p class="detail-intro">{{ service.detailIntro || '服务为企业级综合性平台' }}</p>
            <div class="detail-desc" v-html="service.detailDescription || defaultDescription"></div>
          </div>
        </div>

        <!-- 客户评价 -->
        <div class="review-section">
          <h3 class="section-title">客户评价</h3>
          <div class="review-summary">
            <div class="review-score">
              <span class="score-label">数字评分与评价</span>
              <div class="score-display">
                <span class="score-num">{{ service.rating || '5.00' }}</span>
                <a-rate :value="service.rating || 5" disabled allow-half />
              </div>
            </div>
            <div class="review-tags">
              <a-button v-for="tag in reviewTags" :key="tag.label" :type="activeReviewTag === tag.label ? 'primary' : 'default'" size="small" shape="round" @click="activeReviewTag = tag.label">
                {{ tag.label }}({{ tag.count }})
              </a-button>
            </div>
          </div>

          <!-- 评论排序 -->
          <div class="review-sort">
            <span :class="{ active: reviewSort === 'default' }" @click="reviewSort = 'default'">主题评价({{ service.reviewCount || 44 }}条)</span>
            <span>本店月售{{ service.monthlySales || 200 }}+</span>
            <a class="review-filter">筛选/排序评价</a>
          </div>

          <!-- 评论列表 -->
          <div class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-item__header">
                <a-avatar :size="36">{{ review.author?.charAt(0) || 'U' }}</a-avatar>
                <div class="review-item__info">
                  <span class="review-author">{{ review.author }}</span>
                  <div class="review-item__tags">
                    <a-tag v-for="t in review.tags" :key="t" size="small">{{ t }}</a-tag>
                  </div>
                </div>
              </div>
              <p class="review-item__content">{{ review.content }}</p>
              <div class="review-item__footer">
                <span>来源: {{ review.source || '在线购' }}</span>
                <span>{{ review.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-empty v-if="!loading && !service" description="服务不存在或已下架" />
    </a-spin>

    <!-- 底部保障栏 -->
    <div class="bottom-guarantee">
      <div class="guarantee-item"><span class="g-icon">👥</span><div><div class="g-title">海量人才 品类多</div><div class="g-desc">800+精选品类，700万+专业人才在线接单</div></div></div>
      <div class="guarantee-item"><span class="g-icon">⚡</span><div><div class="g-title">高效服务 相信快</div><div class="g-desc">快速响应需求</div></div></div>
      <div class="guarantee-item"><span class="g-icon">👍</span><div><div class="g-title">品质保障 服务好</div><div class="g-desc">专业服务团队，助力项目成功</div></div></div>
      <div class="guarantee-item"><span class="g-icon">🔒</span><div><div class="g-title">平台交易 更放心</div><div class="g-desc">全程担保交易，保障资金安全</div></div></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServiceStore } from '@/stores/service'

const route = useRoute()
const router = useRouter()
const serviceStore = useServiceStore()

const serviceId = computed(() => route.params.id)
const loading = computed(() => serviceStore.loading)

const activeThumb = ref(0)
const selectedType = ref('standard')
const quantity = ref(1)
const activeReviewTag = ref('全部好评')
const reviewSort = ref('default')

const defaultGallery = [
  'https://via.placeholder.com/100x70/f0f0f0/999?text=1',
  'https://via.placeholder.com/100x70/f0f0f0/999?text=2',
  'https://via.placeholder.com/100x70/f0f0f0/999?text=3',
  'https://via.placeholder.com/100x70/f0f0f0/999?text=4',
  'https://via.placeholder.com/100x70/f0f0f0/999?text=5',
]

const defaultDescription = `<p>本服务为企业级综合性平台开发服务，涵盖以下内容：</p>
<ol>
<li>UI/UX：小程序界面、购物页面、首页界面、品牌首页、会员管理</li>
<li>前端开发：全端适配、H5/小程序/APP管理、广告管理、支付对接、会员体系、积分系统</li>
<li>后端开发：订单管理、商品管理、数据统计、物流对接、营销工具</li>
<li>部署上线：服务器部署、域名配置、SSL证书、性能优化</li>
</ol>`

const service = computed(() => {
  return serviceStore.currentService || {
    id: serviceId.value,
    title: '微信小程序开发定制微分销外卖商城移动端开发',
    subTitle: '商城DIY装修',
    shortDesc: '微信平台定制化商城开发，包含前端页面、后台管理、支付对接等完整功能',
    coverImage: 'https://via.placeholder.com/320x240/ff6b35/ffffff?text=商城开发',
    price: 471.02,
    deliveryDays: 7,
    rating: 5.00,
    reviewCount: 44,
    monthlySales: 200,
    config: { pm: 1, designer: 1, developer: 1, period: 3 },
    provider: { shopName: 'YC智能开发站', tag: '开店3年' },
    gallery: defaultGallery,
    detailDescription: defaultDescription,
  }
})

const reviewTags = [
  { label: '全部好评', count: 2414 },
  { label: '品质精良', count: 179 },
  { label: '不厌其烦', count: 1073 },
  { label: '专业高效', count: 107 },
  { label: '态度友善', count: 77 },
  { label: '有交流沟通', count: 119 },
]

const reviews = ref([
  {
    id: 1,
    author: '小李同学',
    content: '小程序做的非常好，下单之后很快就有人来对接了，整体的UI设计很好看，后端功能也很完善，一直在沟通需求直到满意为止，非常推荐这家店铺。',
    tags: ['产品', '前端', '满意度高'],
    source: '在线购',
    date: '2025-1-29',
  },
  {
    id: 2,
    author: '张先生',
    content: '实力非常强的开发团队，定制开发的商城系统，用户上手非常流畅，按时交付且质量很高，沟通也很顺畅。',
    tags: ['产品', '专业能力', '按时交付', '沟通顺畅', '值得推荐'],
    source: '在线购',
    date: '2025-1-28',
  },
])

const handlePurchase = () => {
  router.push(`/home/services/purchase/${serviceId.value}`)
}

const handleConsult = () => {
  router.push('/home/messages')
}

onMounted(async () => {
  if (serviceId.value) {
    await serviceStore.fetchServiceDetail(serviceId.value)
  }
})
</script>

<style scoped lang="less">
.service-detail-page {
  .top-section {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
  }

  .left-panel {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;

    .shop-bar {
      background: #ff6b35;
      color: #fff;
      padding: 8px 16px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      .shop-name { font-weight: 600; }
      .shop-tag { font-size: 11px; opacity: 0.85; }
    }

    .main-preview {
      display: flex;
      padding: 16px;
      gap: 16px;
      min-height: 220px;

      .preview-left {
        flex: 1;
        .preview-title { font-size: 16px; font-weight: 600; color: #333; margin: 0 0 8px; }
        .preview-desc { font-size: 13px; color: #666; line-height: 1.6; }
      }
      .preview-right {
        width: 200px;
        flex-shrink: 0;
        .preview-img { width: 100%; height: 180px; object-fit: cover; border-radius: 6px; }
      }
    }

    .thumb-list {
      display: flex;
      gap: 8px;
      padding: 0 16px 16px;
      overflow-x: auto;

      .thumb-item {
        width: 80px;
        height: 56px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        flex-shrink: 0;
        transition: border-color 0.2s;

        &.active, &:hover { border-color: #ff6b35; }
        img { width: 100%; height: 100%; object-fit: cover; }
      }
    }
  }

  .right-panel {
    width: 360px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 8px;
    padding: 20px;

    .service-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px;
      line-height: 1.4;
    }

    .price-row {
      margin-bottom: 12px;
      .price { font-size: 28px; font-weight: 700; color: #ff4d00; }
      .price-note {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }

    .price-divider {
      height: 3px;
      background: linear-gradient(90deg, #52c41a, #95de64);
      border-radius: 2px;
      margin-bottom: 16px;
    }

    .config-section {
      margin-bottom: 16px;

      .config-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f5f5f5;

        .config-label { font-size: 13px; color: #666; }
        .config-value { font-size: 13px; color: #333; }
      }
    }

    .quantity-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      margin-bottom: 16px;

      .quantity-label { font-size: 14px; font-weight: 600; color: #333; }
      .quantity-control {
        display: flex;
        align-items: center;
        gap: 8px;
        .quantity-num { font-size: 14px; font-weight: 600; min-width: 24px; text-align: center; }
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      .btn-consult {
        flex: 1;
        border-color: #ff6b35;
        color: #ff6b35;
        &:hover { background: #fff7f0; }
      }
      .btn-buy {
        flex: 1;
        background: #ff6b35;
        border-color: #ff6b35;
        &:hover { background: #e85d2c; border-color: #e85d2c; }
      }
    }
  }

  .detail-section, .review-section {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  .detail-body {
    .detail-intro { font-size: 13px; color: #666; margin-bottom: 12px; }
    .detail-desc { font-size: 13px; color: #333; line-height: 1.8; }
  }

  .review-summary {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .review-score {
      .score-label { font-size: 12px; color: #999; display: block; margin-bottom: 4px; }
      .score-display {
        display: flex;
        align-items: center;
        gap: 8px;
        .score-num { font-size: 28px; font-weight: 700; color: #ff4d00; }
      }
    }

    .review-tags {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .review-sort {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: #666;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    span { cursor: pointer; &.active { color: #333; font-weight: 600; } }
    .review-filter { margin-left: auto; color: #1890ff; cursor: pointer; }
  }

  .review-list {
    .review-item {
      padding: 16px 0;
      border-bottom: 1px solid #f5f5f5;
      &:last-child { border-bottom: none; }

      &__header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      &__info { display: flex; flex-direction: column; gap: 4px; }
      .review-author { font-size: 13px; font-weight: 500; color: #333; }
      &__tags { display: flex; gap: 4px; flex-wrap: wrap; }
      &__content { font-size: 13px; color: #333; line-height: 1.6; margin: 0 0 8px; }
      &__footer {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .bottom-guarantee {
    display: flex;
    justify-content: space-between;
    background: #fafafa;
    border-radius: 8px;
    padding: 20px 24px;
    border: 1px solid #f0f0f0;

    .guarantee-item {
      display: flex;
      align-items: center;
      gap: 8px;
      .g-icon { font-size: 28px; }
      .g-title { font-size: 13px; font-weight: 600; color: #333; }
      .g-desc { font-size: 11px; color: #999; }
    }
  }
}
</style>
