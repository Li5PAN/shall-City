<template>
  <div class="bounty-list-page">
    <!-- 页面头部 -->
    <a-card class="header-card">
      <a-row :gutter="24" align="middle">
        <a-col :span="12">
          <div class="page-header">
            <h2>需求悬赏</h2>
            <div class="stats-info">
              <a-statistic title="总悬赏数" :value="stats.total" />
              <a-statistic title="进行中" :value="stats.active" />
              <a-statistic title="已完成" :value="stats.completed" />
              <a-statistic title="总金额" :value="stats.totalAmount" prefix="¥" />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="header-actions">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索悬赏标题、技能..."
              style="width: 300px; margin-right: 16px;"
              @search="handleSearch"
            />
            <a-button type="primary" @click="goToCreate">
              <PlusOutlined />
              发布悬赏
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 筛选和排序 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="4">
          <a-select
            v-model:value="selectedStatus"
            placeholder="悬赏状态"
            style="width: 100%"
            @change="handleStatusChange"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="open">招募中</a-select-option>
            <a-select-option value="in_progress">进行中</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
            <a-select-option value="cancelled">已取消</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="selectedCategory"
            placeholder="技术分类"
            style="width: 100%"
            @change="handleCategoryChange"
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="budgetRange"
            placeholder="预算范围"
            style="width: 100%"
            @change="handleBudgetChange"
          >
            <a-select-option value="">全部预算</a-select-option>
            <a-select-option value="0-1000">1000元以下</a-select-option>
            <a-select-option value="1000-5000">1000-5000元</a-select-option>
            <a-select-option value="5000-10000">5000-10000元</a-select-option>
            <a-select-option value="10000+">10000元以上</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model:value="sortBy"
            style="width: 100%"
            @change="handleSortChange"
          >
            <a-select-option value="latest">最新发布</a-select-option>
            <a-select-option value="budget_high">预算从高到低</a-select-option>
            <a-select-option value="budget_low">预算从低到高</a-select-option>
            <a-select-option value="deadline">截止时间</a-select-option>
            <a-select-option value="applicants">申请人数</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <div class="filter-tags">
            <span class="tags-label">热门技能：</span>
            <a-tag
              v-for="skill in hotSkills"
              :key="skill"
              :color="selectedSkills.includes(skill) ? 'blue' : 'default'"
              style="cursor: pointer; margin-bottom: 8px;"
              @click="toggleSkill(skill)"
            >
              {{ skill }}
            </a-tag>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 悬赏列表 -->
    <a-spin :spinning="loading">
      <div class="bounties-container">
        <div
          v-for="bounty in bounties"
          :key="bounty.id"
          class="bounty-item"
          @click="goToDetail(bounty.id)"
        >
          <a-card hoverable>
            <div class="bounty-content">
              <div class="bounty-header">
                <div class="bounty-title-section">
                  <h3 class="bounty-title">{{ bounty.title }}</h3>
                  <div class="bounty-badges">
                    <a-tag :color="getStatusColor(bounty.status)">
                      {{ getStatusText(bounty.status) }}
                    </a-tag>
                    <a-tag v-if="bounty.urgent" color="red">
                      <FireOutlined />
                      紧急
                    </a-tag>
                    <a-tag v-if="bounty.remote" color="green">
                      <GlobalOutlined />
                      远程
                    </a-tag>
                  </div>
                </div>
                <div class="bounty-budget">
                  <div class="budget-amount">¥{{ bounty.budget.toLocaleString() }}</div>
                  <div class="budget-type">{{ bounty.budgetType === 'fixed' ? '固定价格' : '预算范围' }}</div>
                </div>
              </div>

              <div class="bounty-description">{{ bounty.description }}</div>

              <div class="bounty-skills">
                <a-tag v-for="skill in bounty.skills" :key="skill" size="small">{{ skill }}</a-tag>
              </div>

              <div class="bounty-meta">
                <div class="meta-left">
                  <div class="publisher-info">
                    <a-avatar :src="bounty.publisher.avatar" :size="32" />
                    <div class="publisher-details">
                      <span class="publisher-name">{{ bounty.publisher.name }}</span>
                      <div class="publisher-stats">
                        <a-rate :value="bounty.publisher.rating" :allow-half="true" disabled size="small" />
                        <span class="rating-text">({{ bounty.publisher.rating }})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="meta-right">
                  <div class="bounty-stats">
                    <span class="stat-item">
                      <UserOutlined />
                      {{ bounty.applicants }}人申请
                    </span>
                    <span class="stat-item">
                      <ClockCircleOutlined />
                      {{ getTimeRemaining(bounty.deadline) }}
                    </span>
                    <span class="stat-item">
                      <CalendarOutlined />
                      {{ formatTime(bounty.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 进度条（仅进行中状态显示） -->
              <div class="bounty-progress" v-if="bounty.status === 'in_progress'">
                <div class="progress-info">
                  <span>项目进度</span>
                  <span>{{ bounty.progress }}%</span>
                </div>
                <a-progress :percent="bounty.progress" size="small" />
              </div>
            </div>
          </a-card>
        </div>
      </div>

      <!-- 空状态 -->
      <a-empty v-if="!loading && bounties.length === 0" description="暂无悬赏">
        <a-button type="primary" @click="goToCreate">发布第一个悬赏</a-button>
      </a-empty>
    </a-spin>

    <!-- 分页 -->
    <div class="pagination-section" v-if="bounties.length > 0">
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  PlusOutlined,
  FireOutlined,
  GlobalOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')
const budgetRange = ref('')
const selectedSkills = ref([])
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 统计数据
const stats = ref({
  total: 156,
  active: 89,
  completed: 45,
  totalAmount: 2580000
})

// 分类数据
const categories = ref([
  { id: 'web', name: 'Web开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'desktop', name: '桌面应用' },
  { id: 'ai', name: '人工智能' },
  { id: 'blockchain', name: '区块链' },
  { id: 'game', name: '游戏开发' },
  { id: 'design', name: '设计' },
  { id: 'other', name: '其他' }
])

// 热门技能
const hotSkills = ref([
  'Vue', 'React', 'Node.js', 'Python', 'Java', 'Flutter', 
  'UI设计', '小程序', 'PHP', 'Go', 'iOS', 'Android'
])

// 悬赏列表数据
const bounties = ref([
  {
    id: 1,
    title: '开发一个在线教育平台的前端界面',
    description: '需要开发一个现代化的在线教育平台前端，包括课程展示、视频播放、用户管理等功能。要求使用Vue 3 + TypeScript，响应式设计，支持移动端...',
    budget: 15000,
    budgetType: 'fixed',
    status: 'open',
    urgent: true,
    remote: true,
    skills: ['Vue', 'TypeScript', 'Element Plus', 'Responsive Design'],
    category: 'web',
    applicants: 12,
    progress: 0,
    deadline: '2024-02-15T23:59:59Z',
    createdAt: '2024-01-15T10:30:00Z',
    publisher: {
      name: '教育科技公司',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      rating: 4.8
    }
  },
  {
    id: 2,
    title: 'React Native电商App开发',
    description: '开发一款跨平台的电商App，包含商品浏览、购物车、订单管理、支付等核心功能。需要有丰富的React Native开发经验...',
    budget: 25000,
    budgetType: 'fixed',
    status: 'in_progress',
    urgent: false,
    remote: true,
    skills: ['React Native', 'Redux', 'TypeScript', 'API集成'],
    category: 'mobile',
    applicants: 8,
    progress: 35,
    deadline: '2024-03-01T23:59:59Z',
    createdAt: '2024-01-10T14:20:00Z',
    publisher: {
      name: '创业公司CEO',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      rating: 4.5
    }
  },
  {
    id: 3,
    title: 'Python数据分析脚本开发',
    description: '需要开发一套数据分析脚本，用于处理销售数据，生成各种统计报表和可视化图表。要求熟悉pandas、matplotlib等库...',
    budget: 8000,
    budgetType: 'range',
    status: 'open',
    urgent: false,
    remote: true,
    skills: ['Python', 'Pandas', 'Matplotlib', '数据分析'],
    category: 'ai',
    applicants: 15,
    progress: 0,
    deadline: '2024-01-30T23:59:59Z',
    createdAt: '2024-01-12T09:15:00Z',
    publisher: {
      name: '数据分析师',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      rating: 4.6
    }
  },
  {
    id: 4,
    title: '微信小程序商城开发',
    description: '开发一个功能完整的微信小程序商城，包括商品管理、订单处理、用户系统、支付功能等。需要有小程序开发经验...',
    budget: 12000,
    budgetType: 'fixed',
    status: 'completed',
    urgent: false,
    remote: false,
    skills: ['微信小程序', 'JavaScript', 'WeUI', '后端API'],
    category: 'mobile',
    applicants: 6,
    progress: 100,
    deadline: '2024-01-20T23:59:59Z',
    createdAt: '2024-01-05T16:45:00Z',
    publisher: {
      name: '小商户',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      rating: 4.9
    }
  }
])

// 方法
const handleSearch = () => {
  currentPage.value = 1
  fetchBounties()
}

const handleStatusChange = () => {
  currentPage.value = 1
  fetchBounties()
}

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchBounties()
}

const handleBudgetChange = () => {
  currentPage.value = 1
  fetchBounties()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchBounties()
}

const toggleSkill = (skill) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push(skill)
  }
  currentPage.value = 1
  fetchBounties()
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchBounties()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchBounties()
}

const getStatusColor = (status) => {
  const colors = {
    open: 'green',
    in_progress: 'blue',
    completed: 'purple',
    cancelled: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    open: '招募中',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || '未知'
}

const getTimeRemaining = (deadline) => {
  const now = dayjs()
  const end = dayjs(deadline)
  const diff = end.diff(now, 'day')
  
  if (diff < 0) return '已截止'
  if (diff === 0) return '今天截止'
  if (diff === 1) return '明天截止'
  return `${diff}天后截止`
}

const formatTime = (timeString) => {
  return dayjs(timeString).format('MM-DD HH:mm')
}

const goToCreate = () => {
  router.push('/user/bounty/create')
}

const goToDetail = (bountyId) => {
  router.push(`/user/bounty/${bountyId}`)
}

const fetchBounties = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该根据筛选条件调用实际API
    total.value = 156
    
  } catch (error) {
    message.error('获取悬赏列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBounties()
})
</script>

<style scoped lang="less">
.bounty-list-page {
  .header-card {
    margin-bottom: 16px;
    
    .page-header {
      h2 {
        margin-bottom: 16px;
        color: #333;
      }
      
      .stats-info {
        display: flex;
        gap: 32px;
        
        :deep(.ant-statistic) {
          text-align: center;
        }
      }
    }
    
    .header-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  
  .filter-card {
    margin-bottom: 16px;
    
    .filter-tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      
      .tags-label {
        color: #666;
        font-size: 12px;
        white-space: nowrap;
      }
    }
  }
  
  .bounties-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    
    .bounty-item {
      cursor: pointer;
      
      .ant-card {
        height: 100%;
        transition: all 0.3s;
        
        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
      
      .bounty-content {
        .bounty-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          
          .bounty-title-section {
            flex: 1;
            margin-right: 16px;
            
            .bounty-title {
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 8px 0;
              color: #333;
              line-height: 1.4;
              
              &:hover {
                color: #1890ff;
              }
            }
            
            .bounty-badges {
              display: flex;
              gap: 4px;
              flex-wrap: wrap;
            }
          }
          
          .bounty-budget {
            text-align: right;
            flex-shrink: 0;
            
            .budget-amount {
              font-size: 24px;
              font-weight: bold;
              color: #f5222d;
              line-height: 1;
            }
            
            .budget-type {
              font-size: 12px;
              color: #999;
              margin-top: 4px;
            }
          }
        }
        
        .bounty-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .bounty-skills {
          margin-bottom: 16px;
          
          .ant-tag {
            margin-bottom: 4px;
          }
        }
        
        .bounty-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .meta-left {
            .publisher-info {
              display: flex;
              align-items: center;
              gap: 12px;
              
              .publisher-details {
                .publisher-name {
                  font-weight: 500;
                  color: #333;
                  display: block;
                  margin-bottom: 4px;
                }
                
                .publisher-stats {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  
                  .rating-text {
                    font-size: 12px;
                    color: #666;
                  }
                }
              }
            }
          }
          
          .meta-right {
            .bounty-stats {
              display: flex;
              flex-direction: column;
              gap: 4px;
              align-items: flex-end;
              
              .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #666;
                font-size: 12px;
                
                .anticon {
                  font-size: 12px;
                }
              }
            }
          }
        }
        
        .bounty-progress {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          
          .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
  
  .pagination-section {
    text-align: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
  }
}

@media (max-width: 768px) {
  .bounty-list-page {
    .header-card {
      :deep(.ant-row) {
        flex-direction: column;
        gap: 16px;
        
        .ant-col {
          width: 100% !important;
          max-width: 100% !important;
        }
      }
      
      .header-actions {
        justify-content: stretch;
        
        .ant-input-search {
          width: 100% !important;
          margin-right: 0 !important;
          margin-bottom: 12px;
        }
      }
    }
    
    .bounties-container {
      grid-template-columns: 1fr;
      
      .bounty-item {
        .bounty-content {
          .bounty-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            
            .bounty-title-section {
              margin-right: 0;
            }
            
            .bounty-budget {
              text-align: left;
            }
          }
          
          .bounty-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            
            .meta-right {
              align-self: stretch;
              
              .bounty-stats {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>