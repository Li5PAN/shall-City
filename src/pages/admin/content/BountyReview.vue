<template>
  <div class="bounty-review">
    <!-- 搜索筛选 -->
    <SearchFilter :filters="filterConfig" @search="handleSearch" @reset="handleReset" />

    <!-- 需求审核列表 -->
    <a-table
      :columns="columns"
      :data-source="bountyList"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'budget'">
          <span class="budget-text">¥{{ record.budget?.toLocaleString() }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <StatusTag :status="record.status" type="audit" />
        </template>
        <template v-else-if="column.key === 'submitTime'">
          {{ formatTime(record.submitTime) }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="showDetail(record)">查看详情</a-button>
            <a-button
              v-if="record.status === 'pending'"
              type="link"
              size="small"
              style="color: #52c41a"
              @click="handleApprove(record)"
            >通过</a-button>
            <a-button
              v-if="record.status === 'pending'"
              type="link"
              size="small"
              danger
              @click="openRejectModal(record)"
            >驳回</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <PaginationWrapper
      :current="pagination.current"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @change="handlePageChange"
    />

    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="需求详情" :footer="null" width="680px">
      <a-descriptions :column="2" bordered v-if="currentRecord">
        <a-descriptions-item label="需求标题" :span="2">{{ currentRecord.title }}</a-descriptions-item>
        <a-descriptions-item label="分类">{{ currentRecord.category }}</a-descriptions-item>
        <a-descriptions-item label="预算">¥{{ currentRecord.budget?.toLocaleString() }}</a-descriptions-item>
        <a-descriptions-item label="提交人">{{ currentRecord.submitter }}</a-descriptions-item>
        <a-descriptions-item label="提交时间">{{ formatTime(currentRecord.submitTime) }}</a-descriptions-item>
        <a-descriptions-item label="截止日期">{{ currentRecord.deadline }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <StatusTag :status="currentRecord.status" type="audit" />
        </a-descriptions-item>
        <a-descriptions-item label="需求描述" :span="2">{{ currentRecord.description }}</a-descriptions-item>
      </a-descriptions>
      <div v-if="currentRecord?.status === 'pending'" style="margin-top: 16px; text-align: right">
        <a-space>
          <a-button type="primary" @click="handleApprove(currentRecord); detailVisible = false">
            通过
          </a-button>
          <a-button danger @click="detailVisible = false; openRejectModal(currentRecord)">
            驳回
          </a-button>
        </a-space>
      </div>
    </a-modal>

    <!-- 驳回原因弹窗 -->
    <a-modal
      v-model:open="rejectVisible"
      title="驳回原因"
      @ok="handleReject"
      :confirm-loading="rejectLoading"
    >
      <a-form :model="rejectForm" layout="vertical">
        <a-form-item label="驳回原因" required>
          <a-textarea
            v-model:value="rejectForm.reason"
            :rows="4"
            placeholder="请输入驳回原因"
            :maxlength="500"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import SearchFilter from '@/components/common/SearchFilter.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import StatusTag from '@/components/business/StatusTag.vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const loading = ref(false)
const detailVisible = ref(false)
const rejectVisible = ref(false)
const rejectLoading = ref(false)
const currentRecord = ref(null)
const rejectForm = reactive({ reason: '' })

const filterConfig = [
  { type: 'input', field: 'keyword', label: '关键词', placeholder: '搜索需求标题/提交人' },
  {
    type: 'select',
    field: 'status',
    label: '审核状态',
    options: [
      { label: '待审核', value: 'pending' },
      { label: '已通过', value: 'approved' },
      { label: '已驳回', value: 'rejected' },
    ],
  },
  {
    type: 'select',
    field: 'category',
    label: '分类',
    options: [
      { label: '网站开发', value: 'web' },
      { label: 'UI设计', value: 'design' },
      { label: '移动应用', value: 'mobile' },
      { label: '数据分析', value: 'data' },
    ],
  },
]

const columns = [
  { title: '需求标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '分类', dataIndex: 'category', key: 'category', width: 100 },
  { title: '预算', dataIndex: 'budget', key: 'budget', width: 120 },
  { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 100 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 170 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' },
]

const bountyList = ref([
  { id: 1, title: '企业官网开发', category: '网站开发', budget: 15000, submitter: '张三', submitTime: '2024-01-15T10:00:00Z', status: 'pending', deadline: '2024-02-15', description: '需要开发一个企业官方网站，包含首页、产品展示、新闻中心等模块。' },
  { id: 2, title: '移动端APP设计', category: 'UI设计', budget: 8000, submitter: '李四', submitTime: '2024-01-14T14:00:00Z', status: 'pending', deadline: '2024-02-10', description: '需要设计一套移动端APP的UI界面，包含20个页面。' },
  { id: 3, title: '数据可视化大屏', category: '数据分析', budget: 20000, submitter: '王五', submitTime: '2024-01-13T09:00:00Z', status: 'approved', deadline: '2024-03-01', description: '需要开发一个数据可视化大屏展示系统。' },
])

const pagination = reactive({ current: 1, pageSize: 10, total: 3 })

const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm')

const handleSearch = (params) => {
  pagination.current = 1
  fetchList()
}

const handleReset = () => {
  pagination.current = 1
  fetchList()
}

const handlePageChange = (page, pageSize) => {
  pagination.current = page
  pagination.pageSize = pageSize
  fetchList()
}

const fetchList = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

const showDetail = (record) => {
  currentRecord.value = record
  detailVisible.value = true
}

const handleApprove = async (record) => {
  try {
    await adminStore.reviewContent('bounty', record.id, 'approve')
    record.status = 'approved'
  } catch {
    // error handled in store
  }
}

const openRejectModal = (record) => {
  currentRecord.value = record
  rejectForm.reason = ''
  rejectVisible.value = true
}

const handleReject = async () => {
  if (!rejectForm.reason.trim()) {
    message.warning('请输入驳回原因')
    return
  }
  rejectLoading.value = true
  try {
    await adminStore.reviewContent('bounty', currentRecord.value.id, 'reject', rejectForm.reason)
    currentRecord.value.status = 'rejected'
    rejectVisible.value = false
  } catch {
    // error handled in store
  } finally {
    rejectLoading.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="less">
.bounty-review {
  background: #fff;
  padding: 24px;
  border-radius: 8px;

  .budget-text {
    color: #fa8c16;
    font-weight: 600;
  }
}
</style>
