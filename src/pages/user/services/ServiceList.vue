<template>
  <div class="service-market">
    <!-- 标题 -->
    <h2 class="market-title">服务市场</h2>

    <!-- 分类标签栏 -->
    <div class="category-bar">
      <span
        v-for="cat in categories"
        :key="cat"
        :class="['category-item', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >{{ cat }}</span>
      <a class="category-more">更多 &gt;</a>
    </div>

    <!-- 服务卡片网格 -->
    <a-spin :spinning="loading">
      <div class="service-grid">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
          @click="$router.push(`/home/services/${service.id}`)"
        >
          <div class="service-card__cover">
            <img :src="service.coverImage" :alt="service.title" />
          </div>
          <div class="service-card__body">
            <p class="service-card__desc">{{ service.description }}</p>
            <div class="service-card__footer">
              <span class="service-card__price">¥ {{ service.price }}</span>
              <div class="service-card__stats">
                <span>好评率·{{ service.goodRate }}%</span>
                <span>成交量·{{ service.sales }}+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-empty v-if="!loading && services.length === 0" description="暂无服务" />
    </a-spin>

    <!-- 分页 -->
    <div class="pagination-section" v-if="services.length > 0">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
        @change="handlePageChange"
      />
    </div>

    <!-- 底部保障栏 -->
    <div class="guarantee-bar">
      <div class="guarantee-item">
        <span class="guarantee-icon">🛡️</span>
        <div>
          <div class="guarantee-title">平台保障</div>
          <div class="guarantee-desc">担保交易100%保障</div>
        </div>
      </div>
      <div class="guarantee-item">
        <span class="guarantee-icon">✅</span>
        <div>
          <div class="guarantee-title">商家认证</div>
          <div class="guarantee-desc">资质认证·实名审核</div>
        </div>
      </div>
      <div class="guarantee-item">
        <span class="guarantee-icon">📋</span>
        <div>
          <div class="guarantee-title">服务有标准</div>
          <div class="guarantee-desc">标准化服务·可量化交付</div>
        </div>
      </div>
      <div class="guarantee-item">
        <span class="guarantee-icon">🔒</span>
        <div>
          <div class="guarantee-title">资金更安全</div>
          <div class="guarantee-desc">一对一担保交易</div>
        </div>
      </div>
      <div class="guarantee-item">
        <span class="guarantee-icon">🎯</span>
        <div>
          <div class="guarantee-title">购买必有保障</div>
          <div class="guarantee-desc">不满意可退款</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(false)
const activeCategory = ref('全部')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(48)

const categories = [
  '全部', '大数据云计算', '算法与数据结构', '数据科学',
  '数据网', '项目管理与协作工具', '区块链技术', '人工智能'
]

const services = ref([
  { id: 1, title: 'Java大厂面试题', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/e74c3c/ffffff?text=Java+面试题', price: 399, goodRate: 100, sales: 1000 },
  { id: 2, title: 'MySQL 10天精通', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/27ae60/ffffff?text=MySQL精通', price: 399, goodRate: 100, sales: 1000 },
  { id: 3, title: '酷炫前端动效', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/2980b9/ffffff?text=前端动效', price: 399, goodRate: 100, sales: 1000 },
  { id: 4, title: 'RabbitMQ 2天入门到实战', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/8e44ad/ffffff?text=RabbitMQ', price: 339, goodRate: 100, sales: 1000 },
  { id: 5, title: 'Java大厂面试题', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/e74c3c/ffffff?text=Java+面试题', price: 399, goodRate: 100, sales: 1000 },
  { id: 6, title: 'MySQL 10天精通', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/27ae60/ffffff?text=MySQL精通', price: 399, goodRate: 100, sales: 1000 },
  { id: 7, title: '酷炫前端动效', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/2980b9/ffffff?text=前端动效', price: 399, goodRate: 100, sales: 1000 },
  { id: 8, title: 'RabbitMQ 2天入门到实战', description: '涵盖各logo设计·精光动画logo设计·品牌logo与cgo...', coverImage: 'https://via.placeholder.com/280x160/8e44ad/ffffff?text=RabbitMQ', price: 339, goodRate: 100, sales: 1000 },
])

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
}

const fetchServices = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    total.value = 48
  } catch (error) {
    console.error('获取服务列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped lang="less">
.service-market {
  .market-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin: 0 0 16px;
  }

  .category-bar {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    flex-wrap: wrap;

    .category-item {
      font-size: 14px;
      color: #666;
      cursor: pointer;
      padding-bottom: 4px;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover { color: #1890ff; }
      &.active {
        color: #1890ff;
        font-weight: 600;
        border-bottom-color: #1890ff;
      }
    }

    .category-more {
      font-size: 13px;
      color: #999;
      cursor: pointer;
      margin-left: auto;
      white-space: nowrap;
      &:hover { color: #1890ff; }
    }
  }

  .service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .service-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
    border: 1px solid #f0f0f0;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    &__cover {
      width: 100%;
      height: 150px;
      overflow: hidden;
      background: #f5f5f5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__body {
      padding: 12px;
    }

    &__desc {
      font-size: 12px;
      color: #666;
      margin: 0 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    &__price {
      font-size: 16px;
      font-weight: 700;
      color: #ff4d00;
    }

    &__stats {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: 11px;
      color: #999;
    }
  }

  .pagination-section {
    text-align: center;
    margin-bottom: 24px;
  }

  .guarantee-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
    border-radius: 8px;
    padding: 16px 24px;
    border: 1px solid #f0f0f0;

    .guarantee-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .guarantee-icon {
        font-size: 24px;
      }

      .guarantee-title {
        font-size: 13px;
        font-weight: 600;
        color: #333;
      }

      .guarantee-desc {
        font-size: 11px;
        color: #999;
      }
    }
  }
}
</style>
