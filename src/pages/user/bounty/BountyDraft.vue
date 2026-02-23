<template>
  <div class="bounty-draft-page">
    <a-card title="需求草稿箱">
      <a-spin :spinning="bountyStore.loading">
        <a-table
          v-if="bountyStore.drafts.length > 0"
          :columns="columns"
          :data-source="bountyStore.drafts"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'title'">
              <a @click="handleEdit(record)">{{ record.title || '未命名草稿' }}</a>
            </template>
            <template v-else-if="column.dataIndex === 'category'">
              {{ record.category || '-' }}
            </template>
            <template v-else-if="column.dataIndex === 'updatedAt'">
              {{ formatTime(record.updatedAt) }}
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  <EditOutlined /> 继续编辑
                </a-button>
                <a-popconfirm title="确定删除该草稿？" @confirm="handleDelete(record.id)">
                  <a-button type="link" size="small" danger>
                    <DeleteOutlined /> 删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>

        <EmptyState
          v-if="!bountyStore.loading && bountyStore.drafts.length === 0"
          description="暂无草稿"
          :show-action="true"
          @action="goToCreate"
        >
          <template #action>
            <a-button type="primary" @click="goToCreate">去发布悬赏</a-button>
          </template>
        </EmptyState>
      </a-spin>

      <PaginationWrapper
        v-if="bountyStore.drafts.length > 0"
        :total="bountyStore.pagination.total"
        :current="bountyStore.pagination.current"
        :page-size="bountyStore.pagination.pageSize"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import { useBountyStore } from '@/stores/bounty'

const router = useRouter()
const bountyStore = useBountyStore()

const columns = [
  { title: '标题', dataIndex: 'title', ellipsis: true },
  { title: '分类', dataIndex: 'category', width: 120 },
  { title: '保存时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', key: 'action', width: 200 },
]

const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
}

const handleEdit = (record) => {
  router.push({ path: '/user/bounty/create', query: { draftId: record.id } })
}

const handleDelete = async (id) => {
  await bountyStore.deleteDraft(id)
}

const handlePageChange = (page, pageSize) => {
  bountyStore.pagination.current = page
  bountyStore.pagination.pageSize = pageSize
  bountyStore.fetchDrafts()
}

const goToCreate = () => {
  router.push('/user/bounty/create')
}

onMounted(() => {
  bountyStore.fetchDrafts()
})
</script>

<style scoped lang="less">
.bounty-draft-page {
  :deep(.ant-table) {
    .ant-table-cell a {
      color: #1890ff;
    }
  }
}
</style>
