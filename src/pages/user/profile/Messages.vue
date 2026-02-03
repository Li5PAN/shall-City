<template>
  <div class="messages-page">
    <a-row :gutter="16">
      <!-- 左侧消息分类 -->
      <a-col :span="6">
        <a-card title="消息分类" size="small">
          <a-menu
            v-model:selectedKeys="selectedCategory"
            mode="inline"
            @click="handleCategoryChange"
          >
            <a-menu-item key="all">
              <MessageOutlined />
              全部消息
              <a-badge :count="allCount" :offset="[10, 0]" />
            </a-menu-item>
            <a-menu-item key="system">
              <BellOutlined />
              系统通知
              <a-badge :count="systemCount" :offset="[10, 0]" />
            </a-menu-item>
            <a-menu-item key="like">
              <HeartOutlined />
              点赞消息
              <a-badge :count="likeCount" :offset="[10, 0]" />
            </a-menu-item>
            <a-menu-item key="comment">
              <CommentOutlined />
              评论回复
              <a-badge :count="commentCount" :offset="[10, 0]" />
            </a-menu-item>
            <a-menu-item key="follow">
              <UserAddOutlined />
              关注消息
              <a-badge :count="followCount" :offset="[10, 0]" />
            </a-menu-item>
            <a-menu-item key="order">
              <ShoppingOutlined />
              订单消息
              <a-badge :count="orderCount" :offset="[10, 0]" />
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>
      
      <!-- 右侧消息列表 -->
      <a-col :span="18">
        <a-card>
          <template #title>
            <div class="messages-header">
              <span>{{ getCategoryName(selectedCategory[0]) }}</span>
              <a-space>
                <a-button type="text" @click="markAllAsRead" :disabled="unreadCount === 0">
                  全部标记为已读
                </a-button>
                <a-button type="text" @click="clearAll">
                  清空消息
                </a-button>
              </a-space>
            </div>
          </template>
          
          <a-spin :spinning="loading">
            <div class="messages-list">
              <div
                v-for="message in messages"
                :key="message.id"
                class="message-item"
                :class="{ unread: !message.read }"
                @click="handleMessageClick(message)"
              >
                <div class="message-avatar">
                  <a-avatar :src="message.avatar" :size="40">
                    <template #icon>
                      <component :is="getMessageIcon(message.type)" />
                    </template>
                  </a-avatar>
                </div>
                
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-title">{{ message.title }}</span>
                    <span class="message-time">{{ formatTime(message.createdAt) }}</span>
                  </div>
                  <div class="message-body">{{ message.content }}</div>
                  <div class="message-actions" v-if="message.actions">
                    <a-button
                      v-for="action in message.actions"
                      :key="action.key"
                      :type="action.type"
                      size="small"
                      @click.stop="handleAction(message, action)"
                    >
                      {{ action.label }}
                    </a-button>
                  </div>
                </div>
                
                <div class="message-status">
                  <a-badge v-if="!message.read" status="processing" />
                  <a-dropdown>
                    <a-button type="text" size="small">
                      <MoreOutlined />
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="markAsRead(message)" v-if="!message.read">
                          标记为已读
                        </a-menu-item>
                        <a-menu-item @click="deleteMessage(message)">
                          删除消息
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <a-empty v-if="!loading && messages.length === 0" description="暂无消息" />
          </a-spin>
          
          <!-- 分页 -->
          <div class="pagination-section" v-if="messages.length > 0">
            <a-pagination
              v-model:current="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :show-size-changer="true"
              :show-total="(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
              @change="handlePageChange"
              @show-size-change="handlePageSizeChange"
            />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  MessageOutlined,
  BellOutlined,
  HeartOutlined,
  CommentOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  MoreOutlined
} from '@ant-design/icons-vue'

// 响应式数据
const loading = ref(false)
const selectedCategory = ref(['all'])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 消息数据（模拟）
const messages = ref([
  {
    id: 1,
    type: 'like',
    title: '点赞通知',
    content: '用户"前端小王"点赞了你的文章《Vue 3.4 新特性详解》',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    read: false,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'comment',
    title: '评论回复',
    content: '用户"React专家"回复了你的评论：这个解决方案很不错，我也遇到过类似的问题...',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    read: false,
    createdAt: '2024-01-15T09:15:00Z',
    actions: [
      { key: 'reply', label: '回复', type: 'primary' },
      { key: 'view', label: '查看', type: 'default' }
    ]
  },
  {
    id: 3,
    type: 'follow',
    title: '新增关注',
    content: '用户"全栈开发者"关注了你',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    read: true,
    createdAt: '2024-01-14T16:45:00Z',
    actions: [
      { key: 'follow_back', label: '回关', type: 'primary' },
      { key: 'view_profile', label: '查看资料', type: 'default' }
    ]
  },
  {
    id: 4,
    type: 'system',
    title: '系统通知',
    content: '您的文章《微服务架构实战》已通过审核并发布',
    avatar: null,
    read: true,
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 5,
    type: 'order',
    title: '订单通知',
    content: '您购买的服务"Vue项目开发"已完成，请及时确认收货',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    read: false,
    createdAt: '2024-01-13T11:30:00Z',
    actions: [
      { key: 'confirm', label: '确认收货', type: 'primary' },
      { key: 'view_order', label: '查看订单', type: 'default' }
    ]
  }
])

// 计算属性
const allCount = computed(() => messages.value.filter(m => !m.read).length)
const systemCount = computed(() => messages.value.filter(m => m.type === 'system' && !m.read).length)
const likeCount = computed(() => messages.value.filter(m => m.type === 'like' && !m.read).length)
const commentCount = computed(() => messages.value.filter(m => m.type === 'comment' && !m.read).length)
const followCount = computed(() => messages.value.filter(m => m.type === 'follow' && !m.read).length)
const orderCount = computed(() => messages.value.filter(m => m.type === 'order' && !m.read).length)
const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

// 方法
const getCategoryName = (category) => {
  const names = {
    all: '全部消息',
    system: '系统通知',
    like: '点赞消息',
    comment: '评论回复',
    follow: '关注消息',
    order: '订单消息'
  }
  return names[category] || '全部消息'
}

const getMessageIcon = (type) => {
  const icons = {
    system: BellOutlined,
    like: HeartOutlined,
    comment: CommentOutlined,
    follow: UserAddOutlined,
    order: ShoppingOutlined
  }
  return icons[type] || MessageOutlined
}

const handleCategoryChange = ({ key }) => {
  selectedCategory.value = [key]
  currentPage.value = 1
  fetchMessages()
}

const handleMessageClick = (msg) => {
  if (!msg.read) {
    markAsRead(msg)
  }
  // 这里可以添加跳转到相关页面的逻辑
}

const handleAction = (msg, action) => {
  switch (action.key) {
    case 'reply':
      message.info('跳转到回复页面')
      break
    case 'view':
      message.info('查看详情')
      break
    case 'follow_back':
      message.success('已关注')
      break
    case 'view_profile':
      message.info('查看用户资料')
      break
    case 'confirm':
      message.success('确认收货成功')
      break
    case 'view_order':
      message.info('查看订单详情')
      break
  }
}

const markAsRead = (msg) => {
  msg.read = true
  message.success('已标记为已读')
}

const markAllAsRead = () => {
  messages.value.forEach(msg => {
    msg.read = true
  })
  message.success('已全部标记为已读')
}

const deleteMessage = (msg) => {
  const index = messages.value.findIndex(m => m.id === msg.id)
  if (index > -1) {
    messages.value.splice(index, 1)
    message.success('消息已删除')
  }
}

const clearAll = () => {
  messages.value = []
  message.success('已清空所有消息')
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchMessages()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchMessages()
}

const formatTime = (timeString) => {
  const now = dayjs()
  const time = dayjs(timeString)
  const diff = now.diff(time, 'minute')
  
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  if (diff < 10080) return `${Math.floor(diff / 1440)}天前`
  return time.format('YYYY-MM-DD HH:mm')
}

const fetchMessages = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据分类筛选消息
    let filteredMessages = messages.value
    if (selectedCategory.value[0] !== 'all') {
      filteredMessages = messages.value.filter(m => m.type === selectedCategory.value[0])
    }
    
    total.value = filteredMessages.length
    
  } catch (error) {
    message.error('获取消息列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMessages()
})
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
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      &.unread {
        background-color: #f6ffed;
        border-left: 3px solid #52c41a;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .message-avatar {
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      .message-content {
        flex: 1;
        
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          
          .message-title {
            font-weight: 600;
            color: #333;
          }
          
          .message-time {
            color: #999;
            font-size: 12px;
          }
        }
        
        .message-body {
          color: #666;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        
        .message-actions {
          display: flex;
          gap: 8px;
        }
      }
      
      .message-status {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
    }
  }
  
  .pagination-section {
    margin-top: 16px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .messages-page {
    :deep(.ant-row) {
      flex-direction: column;
      
      .ant-col {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    
    .messages-list {
      .message-item {
        .message-content {
          .message-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      }
    }
  }
}
</style>