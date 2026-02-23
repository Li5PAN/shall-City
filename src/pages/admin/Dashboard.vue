<template>
  <div class="admin-dashboard">
    <!-- 审核待办统计 -->
    <a-row :gutter="[16, 16]" class="pending-cards">
      <a-col :span="6" v-for="item in pendingItems" :key="item.key">
        <a-card hoverable @click="goToReview(item.route)">
          <a-statistic
            :title="item.title"
            :value="item.count"
            :value-style="{ color: item.color }"
          >
            <template #prefix>
              <component :is="item.icon" />
            </template>
            <template #suffix>
              <span class="suffix-text">条待审核</span>
            </template>
          </a-statistic>
          <div class="card-action">
            <a-button type="link" size="small">去审核 →</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 平台概览 -->
    <a-row :gutter="[16, 16]" class="stats-cards">
      <a-col :span="6" v-for="stat in statsItems" :key="stat.key">
        <a-card>
          <a-statistic
            :title="stat.title"
            :value="stat.value"
            :precision="stat.precision || 0"
            :value-style="{ color: stat.color }"
          >
            <template #prefix>
              <component :is="stat.icon" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>


    <!-- 快捷操作 + 最近活动 -->
    <a-row :gutter="[16, 16]">
      <a-col :span="8">
        <a-card title="快捷操作" :bordered="false">
          <a-space direction="vertical" :size="12" style="width: 100%">
            <a-button block @click="goToReview('/admin/content/bounties')">
              <template #icon><AuditOutlined /></template>
              需求审核
            </a-button>
            <a-button block @click="goToReview('/admin/content/services')">
              <template #icon><ShopOutlined /></template>
              服务审核
            </a-button>
            <a-button block @click="goToReview('/admin/content/articles')">
              <template #icon><FileTextOutlined /></template>
              文章审核
            </a-button>
            <a-button block @click="goToReview('/admin/users')">
              <template #icon><TeamOutlined /></template>
              用户管理
            </a-button>
            <a-button block @click="goToReview('/admin/announcements')">
              <template #icon><NotificationOutlined /></template>
              公告管理
            </a-button>
          </a-space>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="最近活动" :bordered="false">
          <a-list :data-source="recentActivities" :loading="loading">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.time">
                  <template #title>
                    <span>{{ item.description }}</span>
                  </template>
                  <template #avatar>
                    <a-avatar :style="{ backgroundColor: item.color }" size="small">
                      <template #icon><component :is="item.icon" /></template>
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import dayjs from 'dayjs'
import {
  AuditOutlined,
  ShopOutlined,
  FileTextOutlined,
  TeamOutlined,
  NotificationOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const adminStore = useAdminStore()
const loading = ref(false)

const pendingItems = computed(() => [
  {
    key: 'bounties',
    title: '待审核需求',
    count: adminStore.pendingReviews.bounties,
    color: '#fa8c16',
    icon: AuditOutlined,
    route: '/admin/content/bounties',
  },
  {
    key: 'services',
    title: '待审核服务',
    count: adminStore.pendingReviews.services,
    color: '#1890ff',
    icon: ShopOutlined,
    route: '/admin/content/services',
  },
  {
    key: 'articles',
    title: '待审核文章',
    count: adminStore.pendingReviews.articles,
    color: '#52c41a',
    icon: FileTextOutlined,
    route: '/admin/content/articles',
  },
  {
    key: 'posts',
    title: '待审核帖子',
    count: adminStore.pendingReviews.posts,
    color: '#722ed1',
    icon: EditOutlined,
    route: '/admin/content/forum',
  },
])

const statsItems = computed(() => [
  {
    key: 'users',
    title: '平台用户数',
    value: adminStore.statistics.users,
    color: '#1890ff',
    icon: UserOutlined,
  },
  {
    key: 'orders',
    title: '总订单数',
    value: adminStore.statistics.orders,
    color: '#52c41a',
    icon: ShoppingCartOutlined,
  },
  {
    key: 'revenue',
    title: '总收入(元)',
    value: adminStore.statistics.revenue,
    precision: 2,
    color: '#fa8c16',
    icon: DollarOutlined,
  },
  {
    key: 'services',
    title: '上架服务数',
    value: adminStore.statistics.services,
    color: '#722ed1',
    icon: ShopOutlined,
  },
])

const recentActivities = ref([
  { description: '用户 张三 提交了需求审核申请', time: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm'), color: '#fa8c16', icon: AuditOutlined },
  { description: '服务商 李四 发布了新服务「网站开发」', time: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm'), color: '#1890ff', icon: ShopOutlined },
  { description: '管理员审核通过了文章「Vue3最佳实践」', time: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'), color: '#52c41a', icon: CheckCircleOutlined },
  { description: '用户 王五 的角色申请被驳回', time: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm'), color: '#ff4d4f', icon: CloseCircleOutlined },
  { description: '新用户 赵六 完成注册', time: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm'), color: '#722ed1', icon: UserOutlined },
])

const goToReview = (path) => {
  router.push(path)
}

onMounted(async () => {
  loading.value = true
  await adminStore.fetchDashboardData()
  loading.value = false
})
</script>

<style scoped lang="less">
.admin-dashboard {
  .pending-cards {
    margin-bottom: 16px;

    .ant-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .suffix-text {
      font-size: 14px;
      color: #999;
    }

    .card-action {
      margin-top: 8px;
      text-align: right;
    }
  }

  .stats-cards {
    margin-bottom: 16px;
  }
}
</style>
