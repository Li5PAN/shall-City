<template>
  <div class="my-posts">
    <a-card title="我的帖子">
      <a-spin :spinning="forumStore.loading">
        <a-table
          v-if="forumStore.myPosts.length > 0"
          :columns="columns"
          :data-source="forumStore.myPosts"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'title'">
              <a @click="goToDetail(record.id)">{{ record.title }}</a>
            </template>
            <template v-if="column.key === 'section'">
              <a-tag color="blue">{{ record.section || '未分类' }}</a-tag>
            </template>
            <template v-if="column.key === 'createdAt'">
              {{ formatTime(record.createdAt) }}
            </template>
            <template v-if="column.key === 'views'">
              {{ record.views || 0 }}
            </template>
            <template v-if="column.key === 'commentCount'">
              {{ record.commentCount || 0 }}
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  <EditOutlined /> 编辑
                </a-button>
                <a-popconfirm title="确定删除此帖子？" @confirm="handleDelete(record.id)">
                  <a-button type="link" size="small" danger>
                    <DeleteOutlined /> 删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>

        <EmptyState v-if="!forumStore.loading && forumStore.myPosts.length === 0" description="暂无帖子">
          <template #action>
            <a-button type="primary" @click="goToCreate">发布帖子</a-button>
          </template>
        </EmptyState>
      </a-spin>

      <PaginationWrapper
        v-if="forumStore.myPosts.length > 0"
        :total="forumStore.pagination.total"
        :current="forumStore.pagination.current"
        :page-size="forumStore.pagination.pageSize"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useForumStore } from '@/stores/forum'

const router = useRouter()
const forumStore = useForumStore()

const columns = [
  { title: '标题', key: 'title', dataIndex: 'title', ellipsis: true },
  { title: '板块', key: 'section', dataIndex: 'section', width: 120 },
  { title: '发布时间', key: 'createdAt', dataIndex: 'createdAt', width: 160 },
  { title: '浏览量', key: 'views', dataIndex: 'views', width: 90, align: 'center' },
  { title: '评论数', key: 'commentCount', dataIndex: 'commentCount', width: 90, align: 'center' },
  { title: '操作', key: 'action', width: 160, align: 'center' },
]

const handlePageChange = (page, pageSize) => {
  forumStore.pagination.current = page
  forumStore.pagination.pageSize = pageSize
  forumStore.fetchMyPosts({ current: page, pageSize })
}

const goToDetail = (id) => router.push(`/user/forum/post/${id}`)
const goToCreate = () => router.push('/user/forum/create')

const handleEdit = (record) => {
  router.push(`/user/forum/create?editId=${record.id}`)
}

const handleDelete = (id) => {
  message.success('帖子已删除')
  forumStore.fetchMyPosts()
}

const formatTime = (t) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''

onMounted(() => {
  forumStore.fetchMyPosts()
})
</script>

<style scoped lang="less">
.my-posts {
  a {
    color: #1890ff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
