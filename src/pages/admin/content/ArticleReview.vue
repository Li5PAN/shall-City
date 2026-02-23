<template>
  <div class="article-review">
    <!-- 类型筛选标签页 -->
    <a-tabs v-model:activeKey="activeType" @change="handleTypeChange">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane key="bounty" tab="需求" />
      <a-tab-pane key="service" tab="服务" />
      <a-tab-pane key="article" tab="文章" />
      <a-tab-pane key="post" tab="帖子" />
    </a-tabs>

    <!-- 搜索筛选 -->
    <SearchFilter :filters="filterConfig" @search="handleSearch" @reset="handleReset" />

    <!-- 审核列表 -->
    <a-table
      :columns="columns"
      :data-source="reviewList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'">
          <a-tag :color="typeColorMap[record.type]">{{ typeLabelMap[record.type] }}</a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <StatusTag :status="record.status" type="audit" />
        </template>
        <template v-else-if="column.key === 'submitTime'">
          {{ formatTime(record.submitTime) }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="showDetail(record)">查看</a-button>
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

    <!-- 详情弹窗 -->
    <a-modal v-model:open="detailVisible" title="内容详情" :footer="null" width="640px">
      <a-descriptions :column="1" bordered v-if="currentRecord">
        <a-descriptions-item label="标题">{{ currentRecord.title }}</a-descriptions-item>
        <a-descriptions-item label="类型">
          <a-tag :color="typeColorMap[currentRecord.type]">{{ typeLabelMap[currentRecord.type] }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="提交人">{{ currentRecord.submitter }}</a-descriptions-item>
        <a-descriptions-item label="提交时间">{{ formatTime(currentRecord.submitTime) }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <StatusTag :status="currentRecord.status" type="audit" />
        </a-descriptions-item>
        <a-descriptions-item label="内容摘要">{{ currentRecord.summary }}</a-descriptions-item>
      </a-descriptions>
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
import StatusTag from '@/components/business/StatusTag.vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const loading = ref(false)
const activeType = ref('all')
const detailVisible = ref(false)
const rejectVisible = ref(false)
const rejectLoading = ref(false)
const currentRecord = ref(null)
const rejectForm = reactive({ reason: '' })

const filterConfig = [
  { type: 'input', field: 'keyword', label: '关键词', placeholder: '搜索标题/提交人' },
  {
    type: 'select',
    field: 'status',
    label: '状态',
    options: [
      { label: '待审核', value: 'pending' },
      { label: '已通过', value: 'approved' },
      { label: '已驳回', value: 'rejected' },
    ],
  },
]

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 120 },
  { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' },
]

const typeLabelMap = { bounty: '需求', service: '服务', article: '文章', post: '帖子' }
const typeColorMap = { bounty: 'orange', service: 'blue', article: 'green', post: 'purple' }

const reviewList = ref([
  { id: 1, title: 'Vue3项目开发需求', type: 'bounty', submitter: '张三', submitTime: '2024-01-15T10:00:00Z', status: 'pending', summary: '需要开发一个Vue3管理后台系统' },
  { id: 2, title: '网站UI设计服务', type: 'service', submitter: '李四', submitTime: '2024-01-14T14:00:00Z', status: 'pending', summary: '提供专业的网站UI设计服务' },
  { id: 3, title: 'React vs Vue 技术对比', type: 'article', submitter: '王五', submitTime: '2024-01-13T09:00:00Z', status: 'approved', summary: '深入对比React和Vue两大前端框架' },
  { id: 4, title: '求助：Webpack配置问题', type: 'post', submitter: '赵六', submitTime: '2024-01-12T16:00:00Z', status: 'rejected', summary: '关于Webpack5配置的问题讨论' },
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 4,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
})

const searchParams = reactive({ keyword: '', status: '' })

const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm')

const handleTypeChange = () => {
  pagination.current = 1
  fetchList()
}

const handleSearch = (params) => {
  Object.assign(searchParams, params)
  pagination.current = 1
  fetchList()
}

const handleReset = () => {
  searchParams.keyword = ''
  searchParams.status = ''
  pagination.current = 1
  fetchList()
}

const handleTableChange = (pag) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
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
    await adminStore.reviewContent(record.type, record.id, 'approve')
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
    await adminStore.reviewContent(currentRecord.value.type, currentRecord.value.id, 'reject', rejectForm.reason)
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
.article-review {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
</style>
