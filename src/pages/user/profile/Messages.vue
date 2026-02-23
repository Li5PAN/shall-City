<template>
  <div class="messages-page">
    <a-card>
      <template #title>
        <div class="messages-header">
          <span>消息中心</span>
          <a-space>
            <a-button type="link" @click="handleMarkAllRead" :disabled="userStore.unreadCount === 0">
              <CheckOutlined /> 全部已读
            </a-button>
          </a-space>
        </div>
      </template>

      <!-- 消息分类标签页 -->
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="all">
          <template #tab>
            <a-badge :count="userStore.unreadCount" :offset="[10, -2]" size="small">全部消息</a-badge>
          </template>
        </a-tab-pane>
        <a-tab-pane key="system">
          <template #tab>
            <a-badge :count="systemUnread" :offset="[10, -2]" size="small">
              <BellOutlined /> 系统通知
            </a-badge>
          </template>
        </a-tab-pane>
        <a-tab-pane key="order">
          <template #tab>
            <a-badge :count="orderUnread" :offset="[10, -2]" size="small">
              <ShoppingOutlined /> 订单通知
            </a-badge>
          </template>
        </a-tab-pane>
        <a-tab-pane key="interaction">
          <template #tab>
            <a-badge :count="interactionUnread" :offset="[10, -2]" size="small">
              <MessageOutlined /> 互动通知
            </a-badge>
          </template>
        </a-tab-pane>
      </a-tabs>

      <a-spin :spinning="loading">
        <!-- 消息列表 -->
        <div class="messages-list" v-if="filteredMessages.length > 0">
          <div
            v-for="msg in filteredMessages"
            :key="msg.id"
            class="message-item"
            :class="{ unread: !msg.isRead }"
            @click="handleMessageClick(msg)"
          >
            <div class="message-avatar">
              <a-avatar :size="40" :style="{ backgroundColor: getTypeColor(msg.type) }">
                <template #icon><component :is="getTypeIcon(msg.type)" /></template>
              </a-avatar>
            </div>
            <div class="message-content">
              <div class="message-meta">
                <span class="message-title">{{ msg.title }}</span>
                <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
              </div>
              <div class="message-body">{{ msg.content }}</div>
            </div>
            <div class="message-ops">
              <a-badge v-if="!msg.isRead" status="processing" />
              <a-dropdown>
                <a-button type="text" size="small" @click.stop>
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-if="!msg.isRead" @click.stop="handleMarkRead(msg)">标记已读</a-menu-item>
                    <a-menu-item @click.stop="handleDelete(msg)">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </div>

        <a-empty v-if="!loading && filteredMessages.length === 0" description="暂无消息" />
      </a-spin>

      <PaginationWrapper
        v-if="filteredMessages.length > 0"
        :total="total"
        :current="currentPage"
        :page-size="pageSize"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  BellOutlined,
  ShoppingOutlined,
  MessageOutlined,
  MoreOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'

const userStore = useUserStore()

const loading = ref(false)
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 消息类型到分类的映射
const typeToCategory = {
  system: 'system',
  order: 'order',
  like: 'interaction',
  comment: 'interaction',
  follow: 'interaction',
}

const filteredMessages = computed(() => {
  const msgs = userStore.messages || []
  if (activeTab.value === 'all') return msgs
  return msgs.filter(m => typeToCategory[m.type] === activeTab.value)
})

const systemUnread = computed(() =>
  (userStore.messages || []).filter(m => typeToCategory[m.type] === 'system' && !m.isRead).length
)
const orderUnread = computed(() =>
  (userStore.messages || []).filter(m => typeToCategory[m.type] === 'order' && !m.isRead).length
)
const interactionUnread = computed(() =>
  (userStore.messages || []).filter(m => typeToCategory[m.type] === 'interaction' && !m.isRead).length
)

const getTypeIcon = (type) => {
  const map = { system: BellOutlined, order: ShoppingOutlined, like: MessageOutlined, comment: MessageOutlined, follow: MessageOutlined }
  return map[type] || BellOutlined
}

const getTypeColor = (type) => {
  const map = { system: '#1890ff', order: '#faad14', like: '#eb2f96', comment: '#52c41a', follow: '#722ed1' }
  return map[type] || '#1890ff'
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  const now = dayjs()
  const time = dayjs(timeString)
  const diff = now.diff(time, 'minute')
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  if (diff < 10080) return `${Math.floor(diff / 1440)}天前`
  return time.format('YYYY-MM-DD HH:mm')
}

const handleTabChange = () => {
  currentPage.value = 1
  fetchMessages()
}

const handleMessageClick = (msg) => {
  if (!msg.isRead) handleMarkRead(msg)
}

const handleMarkRead = async (msg) => {
  try {
    await userStore.markAsRead([msg.id])
  } catch { /* handled in store */ }
}

const handleMarkAllRead = async () => {
  const unreadIds = (userStore.messages || []).filter(m => !m.isRead).map(m => m.id)
  if (unreadIds.length === 0) return
  try {
    await userStore.markAsRead(unreadIds)
    message.success('已全部标记为已读')
  } catch { /* handled in store */ }
}

const handleDelete = (msg) => {
  const idx = userStore.messages.findIndex(m => m.id === msg.id)
  if (idx > -1) {
    userStore.messages.splice(idx, 1)
    message.success('消息已删除')
  }
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchMessages()
}

const fetchMessages = async () => {
  loading.value = true
  try {
    const type = activeTab.value === 'all' ? undefined : activeTab.value
    await userStore.fetchMessages({ type, page: currentPage.value, pageSize: pageSize.value })
    total.value = filteredMessages.value.length
  } catch { /* handled in store */ } finally { loading.value = false }
}

onMounted(() => { fetchMessages() })
</script>

<style scoped lang="less">
.messages-page {
  .messages-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .messages-list {
    .message-item {
      display: flex;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover { background-color: #fafafa; }
      &.unread { background-color: #f6ffed; border-left: 3px solid #52c41a; }
      &:last-child { border-bottom: none; }

      .message-avatar { margin-right: 12px; flex-shrink: 0; }

      .message-content {
        flex: 1;
        .message-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          .message-title { font-weight: 600; color: #333; }
          .message-time { color: #999; font-size: 12px; }
        }
        .message-body { color: #666; line-height: 1.5; }
      }

      .message-ops {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
