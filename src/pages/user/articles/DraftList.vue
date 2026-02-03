<template>
  <div class="draft-list-page">
    <!-- 页面头部 -->
    <a-card class="header-card">
      <a-row :gutter="24" align="middle">
        <a-col :span="12">
          <div class="page-header">
            <h2>草稿箱</h2>
            <div class="stats-info">
              <a-statistic title="草稿总数" :value="stats.total" />
              <a-statistic title="今日创建" :value="stats.today" />
              <a-statistic title="本周创建" :value="stats.thisWeek" />
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="header-actions">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索草稿标题..."
              style="width: 300px; margin-right: 16px;"
              @search="handleSearch"
            />
            <a-button type="primary" @click="goToCreate">
              <EditOutlined />
              写文章
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 筛选和排序 -->
    <a-card class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="3">
          <a-select
            v-model:value="selectedType"
            placeholder="内容类型"
            style="width: 100%"
            @change="handleTypeChange"
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option value="article">技术文章</a-select-option>
            <a-select-option value="forum_post">论坛帖子</a-select-option>
            <a-select-option value="service">服务描述</a-select-option>
            <a-select-option value="bounty">需求悬赏</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            v-model:value="selectedCategory"
            placeholder="文章分类"
            style="width: 100%"
            @change="handleCategoryChange"
          >
            <a-select-option value="">全部分类</a-select-option>
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            v-model:value="selectedCompleteness"
            placeholder="完成度"
            style="width: 100%"
            @change="handleCompletenessChange"
          >
            <a-select-option value="">全部完成度</a-select-option>
            <a-select-option value="high">高完成度(>80%)</a-select-option>
            <a-select-option value="medium">中等完成度(50-80%)</a-select-option>
            <a-select-option value="low">低完成度(<50%)</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-select
            v-model:value="sortBy"
            style="width: 100%"
            @change="handleSortChange"
          >
            <a-select-option value="latest">最新创建</a-select-option>
            <a-select-option value="updated">最近更新</a-select-option>
            <a-select-option value="completeness">完成度</a-select-option>
            <a-select-option value="title">标题排序</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="12">
          <div class="batch-actions">
            <a-checkbox
              v-model:checked="selectAll"
              :indeterminate="indeterminate"
              @change="handleSelectAll"
            >
              全选
            </a-checkbox>
            <a-button-group style="margin-left: 16px;">
              <a-button :disabled="selectedDrafts.length === 0" @click="batchPublish">
                批量发布
              </a-button>
              <a-button :disabled="selectedDrafts.length === 0" @click="batchDelete" danger>
                批量删除
              </a-button>
            </a-button-group>
            <a-button style="margin-left: 16px;" @click="clearAllDrafts" danger>
              清空草稿箱
            </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 草稿列表 -->
    <a-spin :spinning="loading">
      <div class="drafts-container">
        <div
          v-for="draft in drafts"
          :key="draft.id"
          class="draft-item"
        >
          <a-card hoverable>
            <div class="draft-content">
              <div class="draft-checkbox">
                <a-checkbox
                  v-model:checked="selectedDrafts"
                  :value="draft.id"
                />
              </div>

              <div class="draft-info">
                <div class="draft-header">
                  <div class="draft-title-section">
                    <h3 class="draft-title" @click="goToEdit(draft.id)">
                      {{ draft.title || '无标题草稿' }}
                    </h3>
                    <div class="draft-type-badge">
                      <a-tag :color="getTypeColor(draft.type)" size="small">
                        {{ getTypeName(draft.type) }}
                      </a-tag>
                      <a-tag v-if="draft.scheduledPublish" color="purple" size="small">
                        <ClockCircleOutlined />
                        定时发布
                      </a-tag>
                    </div>
                  </div>
                  <div class="draft-actions">
                    <a-dropdown>
                      <a-button type="text">
                        <MoreOutlined />
                      </a-button>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item @click="goToEdit(draft.id)">
                            <EditOutlined />
                            继续编辑
                          </a-menu-item>
                          <a-menu-item @click="publishDraft(draft)">
                            <SendOutlined />
                            {{ draft.type === 'article' ? '发布文章' : draft.type === 'forum_post' ? '发布帖子' : draft.type === 'service' ? '发布服务' : '发布悬赏' }}
                          </a-menu-item>
                          <a-menu-item @click="duplicateDraft(draft)">
                            <CopyOutlined />
                            复制草稿
                          </a-menu-item>
                          <a-menu-item @click="previewDraft(draft)">
                            <EyeOutlined />
                            预览
                          </a-menu-item>
                          <a-menu-divider />
                          <a-menu-item @click="deleteDraft(draft)" danger>
                            <DeleteOutlined />
                            删除草稿
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </div>
                </div>

                <!-- 完成度进度条 -->
                <div class="draft-progress">
                  <div class="progress-info">
                    <span class="progress-label">完成度</span>
                    <span class="progress-value">{{ draft.completeness }}%</span>
                  </div>
                  <a-progress 
                    :percent="draft.completeness" 
                    :stroke-color="getProgressColor(draft.completeness)"
                    :show-info="false"
                    size="small"
                  />
                </div>

                <div class="draft-summary">
                  {{ draft.summary || getContentPreview(draft.content) }}
                </div>

                <div class="draft-tags" v-if="draft.tags && draft.tags.length > 0">
                  <a-tag v-for="tag in draft.tags" :key="tag" size="small">{{ tag }}</a-tag>
                </div>

                <div class="draft-meta">
                  <div class="meta-info">
                    <span class="meta-item">
                      <CalendarOutlined />
                      创建：{{ formatTime(draft.createdAt) }}
                    </span>
                    <span class="meta-item" v-if="draft.updatedAt !== draft.createdAt">
                      <EditOutlined />
                      更新：{{ formatTime(draft.updatedAt) }}
                    </span>
                    <span class="meta-item">
                      <FileTextOutlined />
                      字数：{{ getWordCount(draft.content) }}
                    </span>
                    <span class="meta-item" v-if="draft.scheduledPublish">
                      <ClockCircleOutlined />
                      定时：{{ formatTime(draft.scheduledPublish) }}
                    </span>
                  </div>

                  <div class="draft-status">
                    <div class="status-badges">
                      <a-tag color="orange">
                        <ClockCircleOutlined />
                        草稿
                      </a-tag>
                      <a-tag v-if="draft.lastEditDevice === 'mobile'" color="blue" size="small">
                        <MobileOutlined />
                        手机编辑
                      </a-tag>
                    </div>
                    <span class="auto-save" v-if="draft.autoSaved">
                      <CheckCircleOutlined style="color: #52c41a;" />
                      已自动保存
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>

      <!-- 空状态 -->
      <a-empty v-if="!loading && drafts.length === 0" description="草稿箱为空">
        <a-button type="primary" @click="goToCreate">写第一篇文章</a-button>
      </a-empty>
    </a-spin>

    <!-- 分页 -->
    <div class="pagination-section" v-if="drafts.length > 0">
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

    <!-- 预览弹窗 -->
    <a-modal
      v-model:open="previewVisible"
      title="草稿预览"
      width="800px"
      :footer="null"
    >
      <div class="draft-preview" v-if="previewDraftData">
        <div class="preview-header">
          <h2>{{ previewDraftData.title || '无标题草稿' }}</h2>
          <div class="preview-meta">
            <a-tag v-for="tag in previewDraftData.tags" :key="tag">{{ tag }}</a-tag>
          </div>
        </div>
        <div class="preview-summary" v-if="previewDraftData.summary">
          <blockquote>{{ previewDraftData.summary }}</blockquote>
        </div>
        <div class="preview-content" v-html="renderMarkdown(previewDraftData.content)"></div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  EditOutlined,
  SendOutlined,
  CopyOutlined,
  EyeOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MobileOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedType = ref('')
const selectedCategory = ref('')
const selectedCompleteness = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)
const selectedDrafts = ref([])
const previewVisible = ref(false)
const previewDraftData = ref(null)

// 统计数据
const stats = ref({
  total: 15,
  today: 3,
  thisWeek: 8
})

// 分类数据
const categories = ref([
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'ai', name: '人工智能' },
  { id: 'devops', name: 'DevOps' }
])

// 草稿列表数据
const drafts = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    summary: '详细介绍Vue 3 Composition API的使用方法和最佳实践，包括响应式原理、生命周期钩子等内容...',
    content: '# Vue 3 Composition API 深度解析\n\nVue 3引入了Composition API，这是一个全新的API设计...\n\n## 什么是Composition API\n\nComposition API是Vue 3中新增的一套API，它提供了一种更灵活的方式来组织组件逻辑...',
    tags: ['Vue', 'Composition API', '前端'],
    category: 'frontend',
    type: 'article',
    autoSaved: true,
    completeness: 85, // 完成度百分比
    scheduledPublish: null,
    lastEditDevice: 'desktop',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 2,
    title: '',
    summary: '',
    content: '## React Hooks 使用技巧\n\n在使用React Hooks时，有一些需要注意的地方...\n\n### useState的使用\n\n```javascript\nconst [count, setCount] = useState(0);\n```',
    tags: ['React', 'Hooks'],
    category: 'frontend',
    type: 'article',
    autoSaved: false,
    completeness: 35,
    scheduledPublish: null,
    lastEditDevice: 'mobile',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 3,
    title: 'TypeScript 高级类型系统',
    summary: '探讨TypeScript的高级类型特性，包括条件类型、映射类型等...',
    content: '# TypeScript 高级类型系统\n\nTypeScript提供了强大的类型系统，让我们能够在编译时捕获错误...',
    tags: ['TypeScript', '类型系统'],
    category: 'frontend',
    type: 'article',
    autoSaved: true,
    completeness: 70,
    scheduledPublish: '2024-01-20T09:00:00Z',
    lastEditDevice: 'desktop',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  },
  {
    id: 4,
    title: '求助：微服务架构中的数据一致性问题',
    summary: '',
    content: '最近在做微服务项目，遇到了分布式事务的问题...\n\n具体场景是这样的：\n- 用户下单\n- 扣减库存\n- 生成订单\n\n这三个操作分别在不同的服务中，如何保证数据一致性？',
    tags: ['微服务', '分布式事务', '求助'],
    category: 'backend',
    type: 'forum_post',
    autoSaved: true,
    completeness: 60,
    scheduledPublish: null,
    lastEditDevice: 'desktop',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-12T15:30:00Z'
  },
  {
    id: 5,
    title: 'Python数据分析服务',
    summary: '提供专业的Python数据分析服务，包括数据清洗、可视化、机器学习模型构建等...',
    content: '## 服务介绍\n\n我是一名有5年经验的数据科学家，专注于Python数据分析...\n\n## 服务内容\n\n1. 数据清洗和预处理\n2. 数据可视化\n3. 统计分析\n4. 机器学习模型',
    tags: ['Python', '数据分析', '机器学习'],
    category: 'ai',
    type: 'service',
    autoSaved: false,
    completeness: 90,
    scheduledPublish: null,
    lastEditDevice: 'desktop',
    createdAt: '2024-01-11T09:20:00Z',
    updatedAt: '2024-01-11T16:45:00Z'
  },
  {
    id: 6,
    title: '需要开发一个电商小程序',
    summary: '',
    content: '## 项目需求\n\n需要开发一个电商小程序，主要功能包括：\n\n- 商品展示\n- 购物车\n- 订单管理\n- 支付功能\n\n## 技术要求\n\n- 微信小程序\n- 后端使用Node.js\n- 数据库MySQL\n\n## 预算\n\n5000-8000元\n\n## 时间要求\n\n希望在一个月内完成',
    tags: ['小程序', '电商', '外包'],
    category: 'mobile',
    type: 'bounty',
    autoSaved: true,
    completeness: 95,
    scheduledPublish: null,
    lastEditDevice: 'mobile',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T18:20:00Z'
  }
])

// 计算属性
const selectAll = computed({
  get: () => selectedDrafts.value.length === drafts.value.length && drafts.value.length > 0,
  set: (val) => {
    if (val) {
      selectedDrafts.value = drafts.value.map(draft => draft.id)
    } else {
      selectedDrafts.value = []
    }
  }
})

const indeterminate = computed(() => 
  selectedDrafts.value.length > 0 && selectedDrafts.value.length < drafts.value.length
)

// 方法
const handleSearch = () => {
  currentPage.value = 1
  fetchDrafts()
}

const handleTypeChange = () => {
  currentPage.value = 1
  fetchDrafts()
}

const handleCompletenessChange = () => {
  currentPage.value = 1
  fetchDrafts()
}

const getTypeColor = (type) => {
  const colors = {
    article: 'blue',
    forum_post: 'green',
    service: 'orange',
    bounty: 'purple'
  }
  return colors[type] || 'default'
}

const getTypeName = (type) => {
  const names = {
    article: '技术文章',
    forum_post: '论坛帖子',
    service: '服务描述',
    bounty: '需求悬赏'
  }
  return names[type] || '未知类型'
}

const getProgressColor = (percent) => {
  if (percent >= 80) return '#52c41a'
  if (percent >= 50) return '#faad14'
  return '#ff4d4f'
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchDrafts()
}

const handleSelectAll = (e) => {
  selectAll.value = e.target.checked
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
  fetchDrafts()
}

const handlePageSizeChange = (current, size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchDrafts()
}

const getContentPreview = (content) => {
  if (!content) return '暂无内容'
  // 移除Markdown语法，获取纯文本预览
  return content
    .replace(/[#*`>\-\[\]()]/g, '')
    .replace(/\n/g, ' ')
    .substring(0, 100) + (content.length > 100 ? '...' : '')
}

const getWordCount = (content) => {
  if (!content) return 0
  // 简单的字数统计
  return content.replace(/\s/g, '').length
}

const renderMarkdown = (content) => {
  // 简单的Markdown渲染
  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

const goToCreate = () => {
  router.push('/user/articles/create')
}

const goToEdit = (draftId) => {
  router.push(`/user/articles/edit/${draftId}`)
}

const publishDraft = (draft) => {
  if (!draft.title) {
    message.warning('请先为草稿设置标题')
    return
  }
  
  Modal.confirm({
    title: '发布草稿',
    content: `确定要发布草稿"${draft.title}"吗？`,
    onOk: async () => {
      try {
        // 模拟发布API
        await new Promise(resolve => setTimeout(resolve, 1000))
        message.success('草稿已发布')
        // 从草稿列表中移除
        const index = drafts.value.findIndex(d => d.id === draft.id)
        if (index > -1) {
          drafts.value.splice(index, 1)
        }
      } catch (error) {
        message.error('发布失败')
      }
    }
  })
}

const duplicateDraft = (draft) => {
  Modal.confirm({
    title: '复制草稿',
    content: `确定要复制草稿"${draft.title || '无标题草稿'}"吗？`,
    onOk: async () => {
      try {
        // 模拟复制API
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newDraft = {
          ...draft,
          id: Date.now(),
          title: (draft.title || '无标题草稿') + ' - 副本',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          autoSaved: false
        }
        drafts.value.unshift(newDraft)
        message.success('草稿已复制')
      } catch (error) {
        message.error('复制失败')
      }
    }
  })
}

const previewDraft = (draft) => {
  previewDraftData.value = draft
  previewVisible.value = true
}

const deleteDraft = (draft) => {
  Modal.confirm({
    title: '删除草稿',
    content: `确定要删除草稿"${draft.title || '无标题草稿'}"吗？此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        // 模拟删除API
        await new Promise(resolve => setTimeout(resolve, 1000))
        const index = drafts.value.findIndex(d => d.id === draft.id)
        if (index > -1) {
          drafts.value.splice(index, 1)
        }
        message.success('草稿已删除')
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

const batchPublish = () => {
  const selectedTitles = drafts.value
    .filter(d => selectedDrafts.value.includes(d.id))
    .filter(d => d.title)
  
  if (selectedTitles.length !== selectedDrafts.value.length) {
    message.warning('部分草稿没有标题，无法发布')
    return
  }
  
  Modal.confirm({
    title: '批量发布',
    content: `确定要发布选中的 ${selectedDrafts.value.length} 篇草稿吗？`,
    onOk: async () => {
      try {
        // 模拟批量发布API
        await new Promise(resolve => setTimeout(resolve, 1500))
        drafts.value = drafts.value.filter(draft => !selectedDrafts.value.includes(draft.id))
        message.success(`已发布 ${selectedDrafts.value.length} 篇草稿`)
        selectedDrafts.value = []
      } catch (error) {
        message.error('批量发布失败')
      }
    }
  })
}

const batchDelete = () => {
  Modal.confirm({
    title: '批量删除',
    content: `确定要删除选中的 ${selectedDrafts.value.length} 篇草稿吗？此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        // 模拟批量删除API
        await new Promise(resolve => setTimeout(resolve, 1500))
        drafts.value = drafts.value.filter(draft => !selectedDrafts.value.includes(draft.id))
        message.success(`已删除 ${selectedDrafts.value.length} 篇草稿`)
        selectedDrafts.value = []
      } catch (error) {
        message.error('批量删除失败')
      }
    }
  })
}

const clearAllDrafts = () => {
  Modal.confirm({
    title: '清空草稿箱',
    content: `确定要清空草稿箱吗？这将删除所有 ${drafts.value.length} 篇草稿，此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      try {
        // 模拟清空API
        await new Promise(resolve => setTimeout(resolve, 2000))
        drafts.value = []
        selectedDrafts.value = []
        message.success('草稿箱已清空')
      } catch (error) {
        message.error('清空失败')
      }
    }
  })
}

const formatTime = (timeString) => {
  return dayjs(timeString).format('YYYY-MM-DD HH:mm')
}

const fetchDrafts = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该根据筛选条件调用实际API
    total.value = 15
    
  } catch (error) {
    message.error('获取草稿列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDrafts()
})
</script>

<style scoped lang="less">
.draft-list-page {
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
    
    .batch-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  
  .drafts-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    
    .draft-item {
      .draft-content {
        display: flex;
        gap: 12px;
        
        .draft-checkbox {
          flex-shrink: 0;
          padding-top: 8px;
        }
        
        .draft-info {
          flex: 1;
          
          .draft-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            
            .draft-title-section {
              flex: 1;
              
              .draft-title {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 8px 0;
                color: #333;
                line-height: 1.4;
                cursor: pointer;
                
                &:hover {
                  color: #1890ff;
                }
              }
              
              .draft-type-badge {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
              }
            }
            
            .draft-actions {
              flex-shrink: 0;
            }
          }
          
          .draft-progress {
            margin-bottom: 12px;
            
            .progress-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
              
              .progress-label {
                font-size: 12px;
                color: #666;
              }
              
              .progress-value {
                font-size: 12px;
                font-weight: 500;
                color: #333;
              }
            }
          }
          
          .draft-summary {
            color: #666;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .draft-tags {
            margin-bottom: 12px;
          }
          
          .draft-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .meta-info {
              display: flex;
              flex-direction: column;
              gap: 4px;
              
              .meta-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #999;
                font-size: 12px;
                
                .anticon {
                  font-size: 12px;
                }
              }
            }
            
            .draft-status {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 4px;
              
              .status-badges {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
              }
              
              .auto-save {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                color: #52c41a;
              }
            }
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

.draft-preview {
  .preview-header {
    margin-bottom: 24px;
    
    h2 {
      margin-bottom: 12px;
      color: #333;
    }
    
    .preview-meta {
      .ant-tag {
        margin-right: 8px;
      }
    }
  }
  
  .preview-summary {
    margin-bottom: 24px;
    
    blockquote {
      background-color: #f6f8fa;
      border-left: 4px solid #1890ff;
      padding: 16px;
      margin: 0;
      border-radius: 6px;
      font-style: italic;
      color: #666;
    }
  }
  
  .preview-content {
    line-height: 1.6;
    color: #333;
    
    :deep(h1) {
      font-size: 24px;
      margin: 16px 0;
    }
    
    :deep(h2) {
      font-size: 20px;
      margin: 14px 0;
    }
    
    :deep(h3) {
      font-size: 16px;
      margin: 12px 0;
    }
    
    :deep(code) {
      background-color: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
  }
}

@media (max-width: 768px) {
  .draft-list-page {
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
    
    .drafts-container {
      grid-template-columns: 1fr;
    }
  }
}
</style>