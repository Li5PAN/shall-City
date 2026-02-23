<template>
  <div class="announcements-manage">
    <div class="page-header">
      <h3>公告管理</h3>
      <a-button type="primary" @click="openCreateModal">
        <template #icon><PlusOutlined /></template>
        创建公告
      </a-button>
    </div>

    <!-- 公告列表 -->
    <a-table
      :columns="columns"
      :data-source="announcementList"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'content'">
          <span class="content-preview">{{ record.content?.substring(0, 50) }}{{ record.content?.length > 50 ? '...' : '' }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'published' ? 'green' : 'default'">
            {{ record.status === 'published' ? '已发布' : '草稿' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'publishTime'">
          {{ record.publishTime ? formatTime(record.publishTime) : '-' }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-button
              v-if="record.status === 'draft'"
              type="link"
              size="small"
              style="color: #52c41a"
              @click="handlePublish(record)"
            >发布</a-button>
            <a-button
              v-if="record.status === 'published'"
              type="link"
              size="small"
              @click="handleUnpublish(record)"
            >下架</a-button>
            <a-popconfirm title="确定删除该公告？" @confirm="handleDelete(record)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 创建/编辑公告弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑公告' : '创建公告'"
      width="720px"
      @ok="handleSave"
      :confirm-loading="saveLoading"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item label="公告标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入公告标题" :maxlength="100" />
        </a-form-item>
        <a-form-item label="公告内容" required>
          <RichTextEditor v-model="formData.content" placeholder="请输入公告内容" :rows="8" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model:value="formData.status">
            <a-radio value="draft">草稿</a-radio>
            <a-radio value="published">发布</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { PlusOutlined } from '@ant-design/icons-vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const loading = ref(false)
const modalVisible = ref(false)
const saveLoading = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: null,
  title: '',
  content: '',
  status: 'draft',
})

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
  { title: '内容预览', dataIndex: 'content', key: 'content', ellipsis: true, width: 250 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', width: 170 },
  { title: '操作', key: 'actions', width: 220, fixed: 'right' },
]

const announcementList = ref([
  { id: 1, title: '平台升级公告', content: '平台将于本周六凌晨2:00-6:00进行系统升级维护，届时部分功能可能暂时不可用，请提前做好准备。', status: 'published', publishTime: '2024-01-15T10:00:00Z' },
  { id: 2, title: '春节放假通知', content: '2024年春节假期为2月10日至2月17日，期间客服暂停服务，紧急问题请发送邮件。', status: 'published', publishTime: '2024-01-10T09:00:00Z' },
  { id: 3, title: '新功能上线预告', content: '即将上线论坛板块功能，支持技术讨论和经验分享，敬请期待。', status: 'draft', publishTime: null },
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 3,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
})

const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm')

const handleTableChange = (pag) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

const openCreateModal = () => {
  isEdit.value = false
  formData.id = null
  formData.title = ''
  formData.content = ''
  formData.status = 'draft'
  modalVisible.value = true
}

const openEditModal = (record) => {
  isEdit.value = true
  formData.id = record.id
  formData.title = record.title
  formData.content = record.content
  formData.status = record.status
  modalVisible.value = true
}

const handleSave = async () => {
  if (!formData.title.trim()) {
    message.warning('请输入公告标题')
    return
  }
  if (!formData.content.trim()) {
    message.warning('请输入公告内容')
    return
  }
  saveLoading.value = true
  try {
    const action = isEdit.value ? 'update' : 'create'
    await adminStore.manageAnnouncement(action, {
      id: formData.id,
      title: formData.title,
      content: formData.content,
      status: formData.status,
    })
    if (isEdit.value) {
      const target = announcementList.value.find((a) => a.id === formData.id)
      if (target) {
        target.title = formData.title
        target.content = formData.content
        target.status = formData.status
        if (formData.status === 'published' && !target.publishTime) {
          target.publishTime = new Date().toISOString()
        }
      }
    } else {
      announcementList.value.unshift({
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        status: formData.status,
        publishTime: formData.status === 'published' ? new Date().toISOString() : null,
      })
      pagination.total++
    }
    modalVisible.value = false
  } catch {
    // error handled in store
  } finally {
    saveLoading.value = false
  }
}

const handlePublish = async (record) => {
  try {
    await adminStore.manageAnnouncement('publish', { id: record.id })
    record.status = 'published'
    record.publishTime = new Date().toISOString()
  } catch {
    // error handled in store
  }
}

const handleUnpublish = async (record) => {
  try {
    await adminStore.manageAnnouncement('unpublish', { id: record.id })
    record.status = 'draft'
  } catch {
    // error handled in store
  }
}

const handleDelete = async (record) => {
  try {
    await adminStore.manageAnnouncement('delete', { id: record.id })
    announcementList.value = announcementList.value.filter((a) => a.id !== record.id)
    pagination.total--
  } catch {
    // error handled in store
  }
}

onMounted(() => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
})
</script>

<style scoped lang="less">
.announcements-manage {
  background: #fff;
  padding: 24px;
  border-radius: 8px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
    }
  }

  .content-preview {
    color: #666;
  }
}
</style>
