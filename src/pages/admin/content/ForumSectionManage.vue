<template>
  <div class="forum-section-manage">
    <div class="page-header">
      <h3>论坛板块管理</h3>
      <a-button type="primary" @click="openCreateModal">
        <template #icon><PlusOutlined /></template>
        新建板块
      </a-button>
    </div>

    <!-- 搜索筛选 -->
    <SearchFilter :filters="filterConfig" @search="handleSearch" @reset="handleReset" />

    <!-- 板块列表 -->
    <a-table
      :columns="columns"
      :data-source="sectionList"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'sortOrder'">
          <a-input-number
            :value="record.sortOrder"
            :min="0"
            size="small"
            style="width: 80px"
            @change="(val) => handleSortChange(record, val)"
          />
        </template>
        <template v-else-if="column.key === 'postCount'">
          <a-tag color="blue">{{ record.postCount }}</a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'active' ? 'green' : 'default'">
            {{ record.status === 'active' ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
            <a-button
              type="link"
              size="small"
              :style="{ color: record.status === 'active' ? '#ff4d4f' : '#52c41a' }"
              @click="handleToggleStatus(record)"
            >
              {{ record.status === 'active' ? '禁用' : '启用' }}
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 创建/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑板块' : '新建板块'"
      @ok="handleSave"
      :confirm-loading="saveLoading"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item label="板块名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入板块名称" :maxlength="50" />
        </a-form-item>
        <a-form-item label="板块描述">
          <a-textarea v-model:value="formData.description" :rows="3" placeholder="请输入板块描述" :maxlength="200" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model:value="formData.sortOrder" :min="0" placeholder="排序值越小越靠前" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import SearchFilter from '@/components/common/SearchFilter.vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const loading = ref(false)
const modalVisible = ref(false)
const saveLoading = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: null,
  name: '',
  description: '',
  sortOrder: 0,
})

const filterConfig = [
  { type: 'input', field: 'keyword', label: '关键词', placeholder: '搜索板块名称' },
  {
    type: 'select',
    field: 'status',
    label: '状态',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
]

const columns = [
  { title: '板块名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 120 },
  { title: '帖子数', dataIndex: 'postCount', key: 'postCount', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', key: 'actions', width: 150 },
]

const sectionList = ref([
  { id: 1, name: '技术讨论', description: '前端、后端、移动端等技术话题讨论', sortOrder: 1, postCount: 1256, status: 'active' },
  { id: 2, name: '项目经验', description: '分享项目开发经验和心得', sortOrder: 2, postCount: 890, status: 'active' },
  { id: 3, name: '求职招聘', description: 'IT行业求职招聘信息发布', sortOrder: 3, postCount: 456, status: 'active' },
  { id: 4, name: '资源分享', description: '开发工具、学习资源分享', sortOrder: 4, postCount: 678, status: 'active' },
  { id: 5, name: '灌水闲聊', description: '轻松话题，自由交流', sortOrder: 5, postCount: 2340, status: 'inactive' },
])

const handleSearch = () => {
  fetchList()
}

const handleReset = () => {
  fetchList()
}

const fetchList = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

const openCreateModal = () => {
  isEdit.value = false
  formData.id = null
  formData.name = ''
  formData.description = ''
  formData.sortOrder = 0
  modalVisible.value = true
}

const openEditModal = (record) => {
  isEdit.value = true
  formData.id = record.id
  formData.name = record.name
  formData.description = record.description
  formData.sortOrder = record.sortOrder
  modalVisible.value = true
}

const handleSave = async () => {
  if (!formData.name.trim()) {
    message.warning('请输入板块名称')
    return
  }
  saveLoading.value = true
  try {
    const action = isEdit.value ? 'update' : 'create'
    await adminStore.manageForumSection(action, {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      sortOrder: formData.sortOrder,
    })
    if (isEdit.value) {
      const target = sectionList.value.find((s) => s.id === formData.id)
      if (target) {
        target.name = formData.name
        target.description = formData.description
        target.sortOrder = formData.sortOrder
      }
    } else {
      sectionList.value.push({
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        sortOrder: formData.sortOrder,
        postCount: 0,
        status: 'active',
      })
    }
    modalVisible.value = false
  } catch {
    // error handled in store
  } finally {
    saveLoading.value = false
  }
}

const handleSortChange = async (record, val) => {
  try {
    await adminStore.manageForumSection('sort', { id: record.id, sortOrder: val })
    record.sortOrder = val
  } catch {
    // error handled in store
  }
}

const handleToggleStatus = async (record) => {
  const newStatus = record.status === 'active' ? 'inactive' : 'active'
  try {
    await adminStore.manageForumSection(newStatus === 'active' ? 'enable' : 'disable', { id: record.id })
    record.status = newStatus
  } catch {
    // error handled in store
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="less">
.forum-section-manage {
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
}
</style>
