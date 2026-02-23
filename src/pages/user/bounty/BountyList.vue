<template>
  <div class="bounty-list-page">
    <!-- 页面头部 -->
    <a-card class="header-card">
      <a-row :gutter="24" align="middle">
        <a-col :span="12">
          <div class="page-header">
            <h2>需求悬赏</h2>
            <div class="stats-info">
              <a-statistic title="总悬赏数" :value="stats.total" />
              <a-statistic title="进行中" :value="stats.active" />
              <a-statistic title="已完成" :value="stats.completed" />
              <a-statistic title="总金额" :value="stats.totalAmount" prefix="¥" />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="header-actions">
            <a-button type="primary" @click="goToCreate">
              <PlusOutlined />
              发布悬赏
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 搜索筛选栏 -->
    <SearchFilter
      :filters="filterConfig"
      :default-values="defaultFilterValues"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 悬赏列表 -->
    <a-spin :spinning="bountyStore.loading">
      <div class="bounties-container">
        <BountyCard
          v-for="bounty in bountyStore.bountyList"
          :key="bounty.id"
          :bounty="bounty"
          @click="goToDetail"
        />
      </div>

      <EmptyState
        v-if="!bountyStore.loading && bountyStore.bountyList.length === 0"
        description="暂无悬赏"
        :show-action="true"
        @action="goToCreate"
      >
        <template #action>
          <a-button type="primary" @click="goToCreate">发布第一个悬赏</a-button>
        </template>
      </EmptyState>
    </a-spin>

    <!-- 分页 -->
    <PaginationWrapper
      v-if="bountyStore.bountyList.length > 0"
      :total="bountyStore.pagination.total"
      :current="bountyStore.pagination.current"
      :page-size="bountyStore.pagination.pageSize"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusOutlined } from '@ant-design/icons-vue'
import SearchFilter from '@/components/common/SearchFilter.vue'
import BountyCard from '@/components/business/BountyCard.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useBountyStore } from '@/stores/bounty'

const router = useRouter()
const bountyStore = useBountyStore()

const stats = ref({ total: 0, active: 0, completed: 0, totalAmount: 0 })

const filterConfig = ref([
  {
    type: 'select',
    field: 'category',
    label: '分类',
    options: [
      { value: 'web', label: 'Web开发' },
      { value: 'mobile', label: '移动开发' },
      { value: 'desktop', label: '桌面应用' },
      { value: 'ai', label: '人工智能' },
      { value: 'blockchain', label: '区块链' },
      { value: 'game', label: '游戏开发' },
      { value: 'design', label: '设计' },
      { value: 'other', label: '其他' },
    ],
  },
  {
    type: 'range',
    field: 'budgetRange',
    label: '预算范围',
    min: 0,
    max: 50000,
  },
  {
    type: 'select',
    field: 'status',
    label: '状态',
    options: [
      { value: 'published', label: '招募中' },
      { value: 'processing', label: '进行中' },
      { value: 'completed', label: '已完成' },
      { value: 'cancelled', label: '已取消' },
    ],
  },
  {
    type: 'select',
    field: 'sortBy',
    label: '排序',
    options: [
      { value: 'latest', label: '最新发布' },
      { value: 'budget_high', label: '预算从高到低' },
      { value: 'budget_low', label: '预算从低到高' },
      { value: 'deadline', label: '截止时间' },
    ],
  },
])

const defaultFilterValues = reactive({
  category: undefined,
  budgetRange: [0, 50000],
  status: undefined,
  sortBy: 'latest',
})

const handleSearch = (params) => {
  bountyStore.filters = { ...bountyStore.filters, ...params }
  bountyStore.pagination.current = 1
  bountyStore.fetchBountyList()
}

const handleReset = () => {
  bountyStore.filters = { category: '', status: '', budgetRange: [0, 50000], keyword: '' }
  bountyStore.pagination.current = 1
  bountyStore.fetchBountyList()
}

const handlePageChange = (page, pageSize) => {
  bountyStore.pagination.current = page
  bountyStore.pagination.pageSize = pageSize
  bountyStore.fetchBountyList()
}

const goToCreate = () => {
  router.push('/user/bounty/create')
}

const goToDetail = (id) => {
  router.push(`/user/bounty/${id}`)
}

onMounted(() => {
  bountyStore.fetchBountyList()
})
</script>

<style scoped lang="less">
.bounty-list-page {
  .header-card {
    margin-bottom: 16px;

    .page-header {
      h2 {
        margin-bottom: 16px;
        color: #333;
      }

      .stats-info {
        display: flex;
        gap: 32px;

        :deep(.ant-statistic) {
          text-align: center;
        }
      }
    }

    .header-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .bounties-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .bounty-list-page {
    .bounties-container {
      grid-template-columns: 1fr;
    }
  }
}
</style>
