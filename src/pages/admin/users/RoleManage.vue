<template>
  <div class="role-manage">
    <div class="page-header">
      <h3>角色管理</h3>
      <a-button type="primary" @click="openCreateModal">
        <template #icon><PlusOutlined /></template>
        新建角色
      </a-button>
    </div>

    <!-- 角色列表 -->
    <a-table
      :columns="columns"
      :data-source="roleList"
      :loading="loading"
      :pagination="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userCount'">
          <a-tag color="blue">{{ record.userCount }} 人</a-tag>
        </template>
        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" size="small" @click="openPermissionModal(record)">
              权限配置
            </a-button>
            <a-button type="link" size="small" @click="openEditModal(record)">
              编辑
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 创建/编辑角色弹窗 -->
    <a-modal
      v-model:open="roleModalVisible"
      :title="isEdit ? '编辑角色' : '新建角色'"
      @ok="handleSaveRole"
      :confirm-loading="saveLoading"
    >
      <a-form :model="roleForm" layout="vertical">
        <a-form-item label="角色名称" required>
          <a-input v-model:value="roleForm.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色描述">
          <a-textarea v-model:value="roleForm.description" :rows="3" placeholder="请输入角色描述" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限配置弹窗 -->
    <a-modal
      v-model:open="permissionVisible"
      title="权限配置"
      width="600px"
      @ok="handleSavePermissions"
      :confirm-loading="permSaveLoading"
    >
      <div v-if="currentRole" style="margin-bottom: 12px">
        <span>当前角色：</span>
        <a-tag color="blue">{{ currentRole.name }}</a-tag>
      </div>
      <a-tree
        v-model:checkedKeys="checkedPermissions"
        :tree-data="permissionTree"
        checkable
        default-expand-all
        :field-names="{ title: 'label', key: 'value' }"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getRoleList, updateRolePermissions } from '@/api/admin'

const loading = ref(false)
const roleModalVisible = ref(false)
const permissionVisible = ref(false)
const saveLoading = ref(false)
const permSaveLoading = ref(false)
const isEdit = ref(false)
const currentRole = ref(null)
const checkedPermissions = ref([])

const roleForm = reactive({ id: null, name: '', description: '' })

const columns = [
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '用户数', dataIndex: 'userCount', key: 'userCount', width: 100 },
  { title: '操作', key: 'actions', width: 200 },
]

const roleList = ref([
  { id: 1, name: '普通用户', description: '注册后的默认角色，可浏览资讯、发布需求、购买服务', userCount: 8560 },
  { id: 2, name: '服务提供方', description: '通过审核的角色，可发布服务、管理订单', userCount: 1230 },
  { id: 3, name: '管理员', description: '系统管理角色，负责审核、用户管理、数据统计', userCount: 15 },
])

const permissionTree = [
  {
    label: '资讯管理',
    value: 'news',
    children: [
      { label: '查看资讯', value: 'news:view' },
      { label: '发布资讯', value: 'news:create' },
      { label: '编辑资讯', value: 'news:edit' },
    ],
  },
  {
    label: '需求悬赏',
    value: 'bounty',
    children: [
      { label: '查看需求', value: 'bounty:view' },
      { label: '发布需求', value: 'bounty:create' },
      { label: '审核需求', value: 'bounty:review' },
    ],
  },
  {
    label: '服务管理',
    value: 'service',
    children: [
      { label: '查看服务', value: 'service:view' },
      { label: '发布服务', value: 'service:create' },
      { label: '审核服务', value: 'service:review' },
    ],
  },
  {
    label: '订单管理',
    value: 'order',
    children: [
      { label: '查看订单', value: 'order:view' },
      { label: '管理订单', value: 'order:manage' },
      { label: '仲裁订单', value: 'order:arbitrate' },
    ],
  },
  {
    label: '用户管理',
    value: 'user',
    children: [
      { label: '查看用户', value: 'user:view' },
      { label: '管理用户', value: 'user:manage' },
      { label: '角色分配', value: 'user:role' },
    ],
  },
  {
    label: '系统管理',
    value: 'system',
    children: [
      { label: '数据统计', value: 'system:statistics' },
      { label: '系统日志', value: 'system:logs' },
      { label: '公告管理', value: 'system:announcement' },
    ],
  },
]

const openCreateModal = () => {
  isEdit.value = false
  roleForm.id = null
  roleForm.name = ''
  roleForm.description = ''
  roleModalVisible.value = true
}

const openEditModal = (record) => {
  isEdit.value = true
  roleForm.id = record.id
  roleForm.name = record.name
  roleForm.description = record.description
  roleModalVisible.value = true
}

const handleSaveRole = async () => {
  if (!roleForm.name.trim()) {
    message.warning('请输入角色名称')
    return
  }
  saveLoading.value = true
  try {
    if (isEdit.value) {
      const target = roleList.value.find((r) => r.id === roleForm.id)
      if (target) {
        target.name = roleForm.name
        target.description = roleForm.description
      }
    } else {
      roleList.value.push({
        id: Date.now(),
        name: roleForm.name,
        description: roleForm.description,
        userCount: 0,
      })
    }
    message.success(isEdit.value ? '角色更新成功' : '角色创建成功')
    roleModalVisible.value = false
  } finally {
    saveLoading.value = false
  }
}

const openPermissionModal = (record) => {
  currentRole.value = record
  checkedPermissions.value = record.permissions || []
  permissionVisible.value = true
}

const handleSavePermissions = async () => {
  if (!currentRole.value) return
  permSaveLoading.value = true
  try {
    await updateRolePermissions(currentRole.value.id, { permissions: checkedPermissions.value })
    currentRole.value.permissions = [...checkedPermissions.value]
    message.success('权限配置已保存')
    permissionVisible.value = false
  } catch {
    // error handled by interceptor
  } finally {
    permSaveLoading.value = false
  }
}

const fetchRoles = async () => {
  loading.value = true
  try {
    const res = await getRoleList()
    if (res && Array.isArray(res)) {
      roleList.value = res
    }
  } catch {
    // use mock data on failure
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped lang="less">
.role-manage {
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
