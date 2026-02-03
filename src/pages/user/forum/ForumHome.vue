<template>
  <div class="forum-home">
    <!-- 论坛导航和统计 -->
    <a-card class="forum-header">
      <a-row :gutter="24" align="middle">
        <a-col :span="12">
          <div class="forum-stats">
            <a-statistic title="总帖子数" :value="forumStats.totalPosts" />
            <a-statistic title="今日新帖" :value="forumStats.todayPosts" />
            <a-statistic title="在线用户" :value="forumStats.onlineUsers" />
            <a-statistic title="注册用户" :value="forumStats.totalUsers" />
          </div>
        </a-col>
        <a-col :span="12">
          <div class="forum-actions">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索帖子、用户..."
              style="width: 300px; margin-right: 16px;"
              @search="handleSearch"
            />
            <a-button type="primary" @click="goToCreatePost">
              <EditOutlined />
              发布帖子
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <a-row :gutter="16" style="margin-top: 16px;">
      <!-- 左侧论坛分类 -->
      <a-col :span="6">
        <a-card title="论坛分类" size="small">
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <div class="category-info">
                <div class="category-header">
                  <component :is="category.icon" class="category-icon" />
                  <span class="category-name">{{ category.name }}</span>
                </div>
                <div class="category-stats">
                  <span>{{ category.postCount }} 帖子</span>
                  <span>{{ category.memberCount }} 成员</span>
                </div>
              </div>
              <div class="category-badge">
                <a-badge :count="category.newPosts" :offset="[10, 0]" />
              </div>
            </div>
          </div>
        </a-card>

        <!-- 热门标签 -->
        <a-card title="热门标签" size="small" style="margin-top: 16px;">
          <div class="hot-tags">
            <a-tag
              v-for="tag in hotTags"
              :key="tag.name"
              :color="selectedTags.includes(tag.name) ? 'blue' : 'default'"
              style="margin-bottom: 8px; cursor: pointer;"
              @click="toggleTag(tag.name)"
            >
              {{ tag.name }} ({{ tag.count }})
            </a-tag>
          </div>
        </a-card>

        <!-- 在线用户 -->
        <a-card title="在线用户" size="small" style="margin-top: 16px;">
          <div class="online-users">
            <a-avatar-group :max-count="8">
              <a-avatar
                v-for="user in onlineUsers"
                :key="user.id"
                :src="user.avatar"
                :title="user.name"
              />
            </a-avatar-group>
            <div class="online-count">{{ onlineUsers.length }} 人在线</div>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧帖子列表 -->
      <a-col :span="18">
        <a-card>
          <template #title>
            <div class="posts-header">
              <span>{{ getCategoryName(selectedCategory) }}</span>
              <a-radio-group v-model:value="sortBy" @change="handleSortChange">
                <a-radio-button value="latest">最新</a-radio-button>
                <a-radio-button value="hot">最热</a-radio-button>
                <a-radio-button value="essence">精华</a-radio-button>
              </a-radio-group>
            </div>
          </template>

          <a-spin :spinning="loading">
            <div class="posts-list">
              <div
                v-for="post in posts"
                :key="post.id"
                class="post-item"
                @click="goToPostDetail(post.id)"
              >
                <div class="post-avatar">
                  <a-avatar :src="post.author.avatar" :size="40" />
                </div>

                <div class="post-content">
                  <div class="post-header">
                    <h3 class="post-title">
                      <a-tag v-if="post.isEssence" color="gold" size="small">精华</a-tag>
                      <a-tag v-if="post.isTop" color="red" size="small">置顶</a-tag>
                      {{ post.title }}
                    </h3>
                    <div class="post-tags">
                      <a-tag v-for="tag in post.tags" :key="tag" size="small">{{ tag }}</a-tag>
                    </div>
                  </div>

                  <div class="post-summary">{{ post.summary }}</div>

                  <div class="post-meta">
                    <div class="author-info">
                      <span class="author-name">{{ post.author.name }}</span>
                      <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                      <a-tag :color="getLevelColor(post.author.level)" size="small">
                        {{ post.author.level }}
                      </a-tag>
                    </div>

                    <div class="post-stats">
                      <span class="stat-item">
                        <EyeOutlined />
                        {{ post.stats.views }}
                      </span>
                      <span class="stat-item">
                        <LikeOutlined />
                        {{ post.stats.likes }}
                      </span>
                      <span class="stat-item">
                        <MessageOutlined />
                        {{ post.stats.replies }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="post-latest-reply" v-if="post.latestReply">
                  <div class="latest-reply-info">
                    <a-avatar :src="post.latestReply.author.avatar" :size="24" />
                    <div class="reply-meta">
                      <div class="reply-author">{{ post.latestReply.author.name }}</div>
                      <div class="reply-time">{{ formatTime(post.latestReply.createdAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <a-empty v-if="!loading && posts.length === 0" description="暂无帖子">
              <a-button type="primary" @click="goToCreatePost">发布第一个帖子</a-button>
            </a-empty>
          </a-spin>

          <!-- 分页 -->
          <div class="pagination-section" v-if="posts.length > 0">
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  CodeOutlined,
  DatabaseOutlined,
  MobileOutlined,
  CloudOutlined,
  RobotOutlined,
  BookOutlined,
  TeamOutlined,
  ToolOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('all')
const selectedTags = ref([])
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

// 论坛统计数据
const forumStats = ref({
  totalPosts: 12580,
  todayPosts: 156,
  onlineUsers: 234,
  totalUsers: 8960
})

// 论坛分类
const categories = ref([
  {
    id: 'all',
    name: '全部分类',
    icon: BookOutlined,
    postCount: 12580,
    memberCount: 8960,
    newPosts: 0
  },
  {
    id: 'frontend',
    name: '前端开发',
    icon: CodeOutlined,
    postCount: 3240,
    memberCount: 2150,
    newPosts: 23
  },
  {
    id: 'backend',
    name: '后端开发',
    icon: DatabaseOutlined,
    postCount: 2890,
    memberCount: 1980,
    newPosts: 18
  },
  {
    id: 'mobile',
    name: '移动开发',
    icon: MobileOutlined,
    postCount: 1560,
    memberCount: 1200,
    newPosts: 12
  },
  {
    id: 'cloud',
    name: '云计算DevOps',
    icon: CloudOutlined,
    postCount: 1890,
    memberCount: 1450,
    newPosts: 15
  },
  {
    id: 'ai',
    name: '人工智能',
    icon: RobotOutlined,
    postCount: 980,
    memberCount: 780,
    newPosts: 8
  },
  {
    id: 'newbie',
    name: '新手入门',
    icon: TeamOutlined,
    postCount: 1520,
    memberCount: 2100,
    newPosts: 35
  },
  {
    id: 'tools',
    name: '工具分享',
    icon: ToolOutlined,
    postCount: 500,
    memberCount: 650,
    newPosts: 5
  }
])

// 热门标签
const hotTags = ref([
  { name: 'Vue', count: 456 },
  { name: 'React', count: 389 },
  { name: 'JavaScript', count: 567 },
  { name: 'Python', count: 234 },
  { name: 'Java', count: 345 },
  { name: 'Node.js', count: 198 },
  { name: 'Docker', count: 156 },
  { name: 'TypeScript', count: 234 }
])

// 在线用户
const onlineUsers = ref([
  { id: 1, name: '前端小王', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
  { id: 2, name: 'React专家', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
  { id: 3, name: 'Vue大神', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
  { id: 4, name: '全栈工程师', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
  { id: 5, name: 'Python开发者', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' }
])

// 帖子列表数据
const posts = ref([
  {
    id: 1,
    title: 'Vue 3.4 新特性深度解析，性能提升显著！',
    summary: '详细介绍Vue 3.4版本的新特性，包括响应式系统优化、TypeScript支持改进等内容...',
    author: {
      name: '前端小王',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      level: '高级工程师'
    },
    tags: ['Vue', '前端', '性能优化'],
    stats: {
      views: 1250,
      likes: 89,
      replies: 23
    },
    isEssence: true,
    isTop: false,
    createdAt: '2024-01-15T10:30:00Z',
    latestReply: {
      author: {
        name: 'Vue专家',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      createdAt: '2024-01-15T14:20:00Z'
    }
  },
  {
    id: 2,
    title: '求助：React项目中如何优雅地处理异步状态管理？',
    summary: '在开发React项目时遇到了复杂的异步状态管理问题，希望大家能给出一些建议和最佳实践...',
    author: {
      name: 'React新手',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      level: '初级工程师'
    },
    tags: ['React', '状态管理', '求助'],
    stats: {
      views: 856,
      likes: 45,
      replies: 67
    },
    isEssence: false,
    isTop: false,
    createdAt: '2024-01-15T09:15:00Z',
    latestReply: {
      author: {
        name: 'React专家',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      createdAt: '2024-01-15T15:30:00Z'
    }
  },
  {
    id: 3,
    title: '分享一个Python爬虫项目，支持多线程和代理池',
    summary: '开源分享一个功能完整的Python爬虫框架，支持多线程、代理池、反反爬等功能...',
    author: {
      name: 'Python大神',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      level: '资深工程师'
    },
    tags: ['Python', '爬虫', '开源'],
    stats: {
      views: 2100,
      likes: 156,
      replies: 34
    },
    isEssence: false,
    isTop: true,
    createdAt: '2024-01-14T16:45:00Z',
    latestReply: {
      author: {
        name: '爬虫爱好者',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
      },
      createdAt: '2024-01-15T11:20:00Z'
    }
  }
])

// 方法
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  fetchPosts()
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
  fetchPosts()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchPosts()
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchPosts()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchPosts()
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '全部分类'
}

const getLevelColor = (level) => {
  const colors = {
    '初级工程师': 'green',
    '中级工程师': 'blue',
    '高级工程师': 'orange',
    '资深工程师': 'red',
    '技术专家': 'purple'
  }
  return colors[level] || 'default'
}

const goToCreatePost = () => {
  router.push('/user/forum/create')
}

const goToPostDetail = (postId) => {
  router.push(`/user/forum/post/${postId}`)
}

const formatTime = (timeString) => {
  const now = dayjs()
  const time = dayjs(timeString)
  const diff = now.diff(time, 'minute')
  
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  if (diff < 10080) return `${Math.floor(diff / 1440)}天前`
  return time.format('MM-DD HH:mm')
}

const fetchPosts = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该根据筛选条件调用实际API
    total.value = 156
    
  } catch (error) {
    message.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped lang="less">
.forum-home {
  .forum-header {
    .forum-stats {
      display: flex;
      gap: 32px;
      
      :deep(.ant-statistic) {
        text-align: center;
      }
    }
    
    .forum-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  
  .category-list {
    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 8px;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      &.active {
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
      }
      
      .category-info {
        flex: 1;
        
        .category-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          
          .category-icon {
            color: #1890ff;
          }
          
          .category-name {
            font-weight: 500;
            color: #333;
          }
        }
        
        .category-stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  
  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .online-users {
    .online-count {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
  
  .posts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .posts-list {
    .post-item {
      display: flex;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f5f5;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .post-avatar {
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      .post-content {
        flex: 1;
        
        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          
          .post-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #333;
            line-height: 1.4;
            flex: 1;
            
            &:hover {
              color: #1890ff;
            }
          }
          
          .post-tags {
            flex-shrink: 0;
            margin-left: 16px;
          }
        }
        
        .post-summary {
          color: #666;
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .author-info {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .author-name {
              font-weight: 500;
              color: #333;
              font-size: 14px;
            }
            
            .post-time {
              color: #999;
              font-size: 12px;
            }
          }
          
          .post-stats {
            display: flex;
            gap: 16px;
            
            .stat-item {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #666;
              font-size: 12px;
              
              .anticon {
                font-size: 14px;
              }
            }
          }
        }
      }
      
      .post-latest-reply {
        width: 120px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .latest-reply-info {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .reply-meta {
            .reply-author {
              font-size: 12px;
              color: #333;
            }
            
            .reply-time {
              font-size: 11px;
              color: #999;
            }
          }
        }
      }
    }
  }
  
  .pagination-section {
    margin-top: 16px;
    text-align: center;
  }
}

@media (max-width: 1200px) {
  .forum-home {
    :deep(.ant-row) {
      flex-direction: column;
      
      .ant-col {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
  }
}

@media (max-width: 768px) {
  .forum-home {
    .forum-header {
      .forum-stats {
        flex-wrap: wrap;
        gap: 16px;
      }
      
      .forum-actions {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        
        .ant-input-search {
          width: 100% !important;
        }
      }
    }
    
    .posts-list {
      .post-item {
        .post-latest-reply {
          display: none;
        }
        
        .post-content {
          .post-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            
            .post-tags {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
}
</style>