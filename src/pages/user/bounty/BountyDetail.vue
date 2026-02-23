<template>
  <div class="bounty-detail-page">
    <a-spin :spinning="bountyStore.loading">
      <template v-if="bounty">
        <a-card class="bounty-header-card">
          <div class="bounty-header">
            <div class="bounty-header__left">
              <h2 class="bounty-title">{{ bounty.title }}</h2>
              <div class="bounty-tags">
                <StatusTag :status="bounty.status" type="bounty" />
                <a-tag v-if="bounty.category">{{ bounty.category }}</a-tag>
              </div>
              <div class="bounty-meta">
                <span><CalendarOutlined /> {{ formatTime(bounty.createdAt) }}</span>
                <span><ClockCircleOutlined /> 截止 {{ formatTime(bounty.deadline) }}</span>
                <span><TeamOutlined /> {{ bounty.responseCount || 0 }}人响应</span>
              </div>
            </div>
            <div class="bounty-header__right">
              <div class="budget-amount">¥{{ bounty.budget }}</div>
              <div class="budget-type">{{ bounty.budgetType === 'fixed' ? '固定价格' : '预算范围' }}</div>
            </div>
          </div>
        </a-card>


        <a-card title="需求详情" class="detail-card">
          <div class="bounty-description">{{ bounty.description }}</div>
          <div v-if="bounty.skills && bounty.skills.length" class="bounty-skills">
            <span class="label">技能要求：</span>
            <a-tag v-for="skill in bounty.skills" :key="skill" color="blue">{{ skill }}</a-tag>
          </div>
        </a-card>

        <a-card v-if="isOwner" title="响应列表" class="detail-card">
          <a-table :columns="bidColumns" :data-source="bidList" :loading="bidLoading" :pagination="false" row-key="id">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'provider'">
                <a-space>
                  <a-avatar :src="record.provider?.avatar" :size="28" />
                  {{ record.provider?.name }}
                </a-space>
              </template>
              <template v-else-if="column.dataIndex === 'amount'">¥{{ record.amount }}</template>
              <template v-else-if="column.dataIndex === 'createdAt'">{{ formatTime(record.createdAt) }}</template>
              <template v-else-if="column.key === 'action'">
                <a-button v-if="bounty.status === 'published'" type="primary" size="small" @click="handleSelectBidder(record.id)">
                  选为中标者
                </a-button>
              </template>
            </template>
          </a-table>
        </a-card>

        <a-card v-if="isProvider && bounty.status === 'published'" title="提交响应方案" class="detail-card">
          <a-form :model="bidForm" layout="vertical" @finish="handleBid">
            <a-form-item label="报价金额" name="amount" :rules="[{ required: true, message: '请输入报价金额' }]">
              <a-input-number v-model:value="bidForm.amount" :min="1" :precision="0" prefix="¥" style="width: 200px" placeholder="请输入报价" />
            </a-form-item>
            <a-form-item label="方案说明" name="proposal" :rules="[{ required: true, message: '请输入方案说明' }]">
              <a-textarea v-model:value="bidForm.proposal" :rows="4" placeholder="请描述您的解决方案、预计工期等" :maxlength="1000" show-count />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit" :loading="bidSubmitting">提交响应</a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="讨论区" class="detail-card">
          <CommentList :comments="bounty.comments || []" :allow-reply="true" @submit="handleCommentSubmit" @like="handleCommentLike" @delete="handleCommentDelete" />
        </a-card>
      </template>
    </a-spin>
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons-vue'
import StatusTag from '@/components/business/StatusTag.vue'
import CommentList from '@/components/business/CommentList.vue'
import { useBountyStore } from '@/stores/bounty'
import { useAuthStore } from '@/stores/auth'
import { getBidList, selectBidder } from '@/api/bounty'

const route = useRoute()
const bountyStore = useBountyStore()
const authStore = useAuthStore()

const bounty = computed(() => bountyStore.currentBounty)
const bidList = ref([])
const bidLoading = ref(false)
const bidSubmitting = ref(false)
const bidForm = reactive({ amount: null, proposal: '' })

const isOwner = computed(() => bounty.value?.publisherId === authStore.userId)
const isProvider = computed(() => authStore.userRole === 'provider' && !isOwner.value)

const bidColumns = [
  { title: '服务商', dataIndex: 'provider' },
  { title: '报价', dataIndex: 'amount', width: 120 },
  { title: '方案说明', dataIndex: 'proposal', ellipsis: true },
  { title: '投标时间', dataIndex: 'createdAt', width: 160 },
  { title: '操作', key: 'action', width: 120 },
]

const formatTime = (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'

const fetchBidList = async () => {
  if (!isOwner.value) return
  bidLoading.value = true
  try {
    const res = await getBidList(route.params.id)
    bidList.value = res.list || res.data || res || []
  } catch { /* silent */ } finally {
    bidLoading.value = false
  }
}

const handleSelectBidder = async (bidId) => {
  try {
    await selectBidder(route.params.id, bidId)
    message.success('已选择中标者')
    await bountyStore.fetchBountyDetail(route.params.id)
    await fetchBidList()
  } catch {
    message.error('操作失败')
  }
}

const handleBid = async () => {
  bidSubmitting.value = true
  try {
    await bountyStore.bidBounty(route.params.id, bidForm)
    bidForm.amount = null
    bidForm.proposal = ''
    await bountyStore.fetchBountyDetail(route.params.id)
  } finally {
    bidSubmitting.value = false
  }
}

const handleCommentSubmit = (content, parentId) => { message.info('评论功能开发中') }
const handleCommentLike = (commentId) => { message.info('点赞功能开发中') }
const handleCommentDelete = (commentId) => { message.info('删除功能开发中') }

onMounted(async () => {
  await bountyStore.fetchBountyDetail(route.params.id)
  await fetchBidList()
})
</script>

<style scoped lang="less">
.bounty-detail-page {
  .bounty-header-card {
    margin-bottom: 16px;
  }

  .bounty-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &__left {
      flex: 1;

      .bounty-title {
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 12px;
      }

      .bounty-tags {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }

      .bounty-meta {
        display: flex;
        gap: 24px;
        color: #666;
        font-size: 13px;

        span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    &__right {
      text-align: right;
      flex-shrink: 0;

      .budget-amount {
        font-size: 28px;
        font-weight: bold;
        color: #f5222d;
      }

      .budget-type {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }
    }
  }

  .detail-card {
    margin-bottom: 16px;
  }

  .bounty-description {
    line-height: 1.8;
    color: #333;
    white-space: pre-wrap;
    margin-bottom: 16px;
  }

  .bounty-skills {
    .label {
      color: #666;
      margin-right: 8px;
    }
  }
}
</style>
