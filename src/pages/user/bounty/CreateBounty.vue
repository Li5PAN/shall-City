<template>
  <div class="create-bounty-page">
    <a-card>
      <template #title>
        <div class="page-header">
          <h2>{{ isEdit ? '编辑悬赏' : '发布悬赏' }}</h2>
          <div class="header-actions">
            <a-button @click="saveDraft" :loading="draftLoading">
              <SaveOutlined />
              保存草稿
            </a-button>
            <a-button @click="previewBounty">
              <EyeOutlined />
              预览
            </a-button>
          </div>
        </div>
      </template>

      <a-form
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- 基本信息 -->
        <a-divider orientation="left">基本信息</a-divider>

        <!-- 悬赏标题 -->
        <a-form-item label="悬赏标题" name="title">
          <a-input
            v-model:value="formData.title"
            placeholder="请输入悬赏标题，简洁明了地描述您的需求（10-100个字符）"
            :maxlength="100"
            show-count
            size="large"
          />
        </a-form-item>

        <!-- 需求描述 -->
        <a-form-item label="需求描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请详细描述您的需求，包括功能要求、技术栈、预期效果等（50-2000个字符）"
            :rows="6"
            :maxlength="2000"
            show-count
          />
        </a-form-item>

        <!-- 分类和标签 -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="技术分类" name="category">
              <a-select
                v-model:value="formData.category"
                placeholder="请选择技术分类"
                size="large"
              >
                <a-select-option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目标签" name="tags">
              <div class="tags-section">
                <div class="selected-tags">
                  <a-tag
                    v-for="tag in formData.tags"
                    :key="tag"
                    closable
                    @close="removeTag(tag)"
                  >
                    {{ tag }}
                  </a-tag>
                  <a-input
                    v-if="inputVisible"
                    ref="inputRef"
                    v-model:value="inputValue"
                    type="text"
                    size="small"
                    style="width: 78px"
                    @blur="handleInputConfirm"
                    @keyup.enter="handleInputConfirm"
                  />
                  <a-tag v-else @click="showInput" style="background: #fff; border-style: dashed;">
                    <PlusOutlined />
                    添加标签
                  </a-tag>
                </div>
                <div class="popular-tags">
                  <span class="tags-label">热门标签：</span>
                  <a-tag
                    v-for="tag in popularTags"
                    :key="tag"
                    style="cursor: pointer; margin-bottom: 8px;"
                    @click="addPopularTag(tag)"
                  >
                    {{ tag }}
                  </a-tag>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 预算和时间 -->
        <a-divider orientation="left">预算与时间</a-divider>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="预算类型" name="budgetType">
              <a-radio-group v-model:value="formData.budgetType" size="large">
                <a-radio-button value="fixed">固定价格</a-radio-button>
                <a-radio-button value="range">预算范围</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item 
              :label="formData.budgetType === 'fixed' ? '项目预算' : '预算上限'" 
              name="budget"
            >
              <a-input-number
                v-model:value="formData.budget"
                :min="100"
                :max="1000000"
                :precision="0"
                style="width: 100%"
                :placeholder="formData.budgetType === 'fixed' ? '请输入项目预算' : '请输入预算上限'"
                size="large"
              >
                <template #addonBefore>¥</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="截止时间" name="deadline">
              <a-date-picker
                v-model:value="formData.deadline"
                show-time
                format="YYYY-MM-DD HH:mm"
                placeholder="选择截止时间"
                style="width: 100%"
                size="large"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 技能要求 -->
        <a-form-item label="技能要求" name="skills">
          <div class="skills-section">
            <div class="selected-skills">
              <a-tag
                v-for="skill in formData.skills"
                :key="skill"
                closable
                color="blue"
                @close="removeSkill(skill)"
              >
                {{ skill }}
              </a-tag>
              <a-input
                v-if="skillInputVisible"
                ref="skillInputRef"
                v-model:value="skillInputValue"
                type="text"
                size="small"
                style="width: 100px"
                @blur="handleSkillInputConfirm"
                @keyup.enter="handleSkillInputConfirm"
              />
              <a-tag v-else @click="showSkillInput" style="background: #fff; border-style: dashed;">
                <PlusOutlined />
                添加技能
              </a-tag>
            </div>
            <div class="popular-skills">
              <span class="skills-label">热门技能：</span>
              <a-tag
                v-for="skill in popularSkills"
                :key="skill"
                style="cursor: pointer; margin-bottom: 8px;"
                @click="addPopularSkill(skill)"
              >
                {{ skill }}
              </a-tag>
            </div>
          </div>
        </a-form-item>

        <!-- 项目设置 -->
        <a-divider orientation="left">项目设置</a-divider>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="工作方式">
              <a-checkbox-group v-model:value="formData.workMode">
                <a-checkbox value="remote">支持远程工作</a-checkbox>
                <a-checkbox value="onsite">需要现场工作</a-checkbox>
                <a-checkbox value="hybrid">混合工作模式</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目优先级">
              <a-radio-group v-model:value="formData.priority">
                <a-radio value="normal">普通</a-radio>
                <a-radio value="urgent">紧急</a-radio>
                <a-radio value="critical">非常紧急</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 详细需求 -->
        <a-form-item label="详细需求说明" name="requirements">
          <div class="editor-container">
            <div class="editor-toolbar">
              <a-button-group size="small">
                <a-button @click="insertText('# ')">H1</a-button>
                <a-button @click="insertText('## ')">H2</a-button>
                <a-button @click="insertText('### ')">H3</a-button>
                <a-button @click="insertText('**粗体**')">
                  <BoldOutlined />
                </a-button>
                <a-button @click="insertText('*斜体*')">
                  <ItalicOutlined />
                </a-button>
                <a-button @click="insertText('`代码`')">
                  <CodeOutlined />
                </a-button>
                <a-button @click="insertText('- 列表项')">
                  <UnorderedListOutlined />
                </a-button>
                <a-button @click="insertText('1. 有序列表')">
                  <OrderedListOutlined />
                </a-button>
              </a-button-group>
            </div>
            <a-textarea
              ref="requirementsRef"
              v-model:value="formData.requirements"
              placeholder="请详细说明项目需求，包括：&#10;1. 功能要求和技术规范&#10;2. 设计要求和用户体验&#10;3. 性能要求和兼容性&#10;4. 交付物和验收标准&#10;5. 其他特殊要求"
              :rows="12"
              :maxlength="5000"
              show-count
            />
          </div>
        </a-form-item>

        <!-- 附件上传 -->
        <a-form-item label="需求附件">
          <div class="attachment-upload">
            <a-upload
              v-model:file-list="attachmentList"
              :before-upload="beforeUpload"
              :remove="handleRemoveAttachment"
              :max-count="5"
              multiple
            >
              <a-button>
                <UploadOutlined />
                上传附件
              </a-button>
            </a-upload>
            <div class="upload-tips">
              支持上传需求文档、设计稿、参考资料等，支持PDF、DOC、图片格式，单个文件不超过10MB，最多5个文件
            </div>
          </div>
        </a-form-item>

        <!-- 联系方式 -->
        <a-divider orientation="left">联系方式</a-divider>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="联系电话" name="contactPhone">
              <a-input
                v-model:value="formData.contactPhone"
                placeholder="请输入联系电话"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系邮箱" name="contactEmail">
              <a-input
                v-model:value="formData.contactEmail"
                placeholder="请输入联系邮箱"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="其他联系方式">
          <a-textarea
            v-model:value="formData.otherContact"
            placeholder="如微信号、QQ号等其他联系方式（可选）"
            :rows="2"
          />
        </a-form-item>

        <!-- 发布设置 -->
        <a-divider orientation="left">发布设置</a-divider>

        <a-form-item>
          <a-space direction="vertical">
            <a-checkbox v-model:checked="formData.allowPublicBid">
              公开投标（允许所有开发者查看和投标）
            </a-checkbox>
            <a-checkbox v-model:checked="formData.requirePortfolio">
              要求投标者提供作品集
            </a-checkbox>
            <a-checkbox v-model:checked="formData.autoNotify">
              自动通知匹配的开发者
            </a-checkbox>
            <div class="publish-time">
              <a-checkbox v-model:checked="formData.schedulePublish">
                定时发布
              </a-checkbox>
              <a-date-picker
                v-if="formData.schedulePublish"
                v-model:value="formData.publishTime"
                show-time
                format="YYYY-MM-DD HH:mm"
                placeholder="选择发布时间"
                style="margin-left: 12px;"
              />
            </div>
          </a-space>
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item>
          <a-space size="large">
            <a-button type="primary" html-type="submit" :loading="loading" size="large">
              <SendOutlined />
              {{ formData.schedulePublish ? '定时发布' : '立即发布' }}
            </a-button>
            <a-button @click="saveDraft" :loading="draftLoading" size="large">
              <SaveOutlined />
              保存草稿
            </a-button>
            <a-button @click="goBack" size="large">
              取消
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 预览弹窗 -->
    <a-modal
      v-model:open="previewVisible"
      title="悬赏预览"
      width="900px"
      :footer="null"
      class="preview-modal"
    >
      <div class="bounty-preview">
        <div class="preview-header">
          <h1>{{ formData.title || '未设置标题' }}</h1>
          <div class="preview-meta">
            <div class="meta-info">
              <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <span class="author-name">当前用户</span>
              <span class="publish-time">{{ new Date().toLocaleString() }}</span>
            </div>
            <div class="bounty-budget">
              <div class="budget-amount">¥{{ formData.budget?.toLocaleString() || '0' }}</div>
              <div class="budget-type">{{ formData.budgetType === 'fixed' ? '固定价格' : '预算上限' }}</div>
            </div>
          </div>
        </div>
        
        <div class="preview-badges">
          <a-tag color="green">招募中</a-tag>
          <a-tag v-if="formData.priority === 'urgent'" color="orange">紧急</a-tag>
          <a-tag v-if="formData.priority === 'critical'" color="red">非常紧急</a-tag>
          <a-tag v-if="formData.workMode?.includes('remote')" color="blue">支持远程</a-tag>
        </div>

        <div class="preview-description" v-if="formData.description">
          <h3>需求描述</h3>
          <p>{{ formData.description }}</p>
        </div>

        <div class="preview-skills" v-if="formData.skills?.length">
          <h3>技能要求</h3>
          <div class="skills-list">
            <a-tag v-for="skill in formData.skills" :key="skill" color="blue">{{ skill }}</a-tag>
          </div>
        </div>

        <div class="preview-requirements" v-if="formData.requirements">
          <h3>详细需求</h3>
          <div class="requirements-content" v-html="renderMarkdown(formData.requirements)"></div>
        </div>

        <div class="preview-info">
          <div class="info-item">
            <span class="label">截止时间：</span>
            <span>{{ formData.deadline ? dayjs(formData.deadline).format('YYYY-MM-DD HH:mm') : '未设置' }}</span>
          </div>
          <div class="info-item" v-if="formData.contactPhone">
            <span class="label">联系电话：</span>
            <span>{{ formData.contactPhone }}</span>
          </div>
          <div class="info-item" v-if="formData.contactEmail">
            <span class="label">联系邮箱：</span>
            <span>{{ formData.contactEmail }}</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  SaveOutlined,
  EyeOutlined,
  SendOutlined,
  PlusOutlined,
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'

// 模拟API函数（已移除接口依赖）
const createBounty = async (data) => { return { id: Date.now(), ...data } }
const updateBounty = async (id, data) => { return { id, ...data } }
const getBountyCategories = async () => [
  { id: 'fullstack', name: '全栈开发' }, { id: 'ui', name: 'UI设计' }, { id: 'python', name: 'Python' },
  { id: 'web', name: 'Web开发' }, { id: 'data-viz', name: '数据可视化' }, { id: 'ai', name: 'AI服务' }, { id: 'mobile', name: '移动开发' }
]
const getPopularSkills = async () => ['Vue', 'React', 'Python', 'Java', 'Go', 'Docker', 'K8s', 'MySQL']
const uploadAttachment = async (file) => ({ url: URL.createObjectURL(file), name: file.name })
const saveBountyDraft = async (data) => { message.success('草稿保存成功'); return { id: Date.now(), ...data } }

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const draftLoading = ref(false)
const previewVisible = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()
const skillInputVisible = ref(false)
const skillInputValue = ref('')
const skillInputRef = ref()
const requirementsRef = ref()
const attachmentList = ref([])
const isEdit = ref(false)

// 表单数据
const formData = reactive({
  title: '',
  description: '',
  category: '',
  tags: [],
  budgetType: 'fixed',
  budget: null,
  deadline: null,
  skills: [],
  workMode: ['remote'],
  priority: 'normal',
  requirements: '',
  contactPhone: '',
  contactEmail: '',
  otherContact: '',
  allowPublicBid: true,
  requirePortfolio: false,
  autoNotify: true,
  schedulePublish: false,
  publishTime: null
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入悬赏标题' },
    { min: 10, max: 100, message: '标题长度应在10-100个字符之间' }
  ],
  description: [
    { required: true, message: '请输入需求描述' },
    { min: 50, max: 2000, message: '描述长度应在50-2000个字符之间' }
  ],
  category: [
    { required: true, message: '请选择技术分类' }
  ],
  budget: [
    { required: true, message: '请输入项目预算' },
    { type: 'number', min: 100, message: '预算不能少于100元' }
  ],
  deadline: [
    { required: true, message: '请选择截止时间' }
  ],
  skills: [
    { required: true, type: 'array', min: 1, message: '请至少添加一个技能要求' }
  ],
  requirements: [
    { required: true, message: '请填写详细需求说明' },
    { min: 100, message: '需求说明至少需要100个字符' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ],
  contactEmail: [
    { required: true, message: '请输入联系邮箱' },
    { type: 'email', message: '请输入正确的邮箱地址' }
  ]
}

// 分类数据
const categories = ref([
  { id: 'web', name: 'Web开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'desktop', name: '桌面应用' },
  { id: 'ai', name: '人工智能' },
  { id: 'blockchain', name: '区块链' },
  { id: 'game', name: '游戏开发' },
  { id: 'design', name: 'UI/UX设计' },
  { id: 'data', name: '数据分析' },
  { id: 'devops', name: 'DevOps' },
  { id: 'other', name: '其他' }
])

// 热门标签
const popularTags = ref([
  '网站开发', '小程序', 'App开发', 'API开发', '数据库设计', 
  '系统集成', '性能优化', '安全加固', '自动化', '爬虫'
])

// 热门技能
const popularSkills = ref([
  'Vue', 'React', 'Angular', 'Node.js', 'Python', 'Java', 
  'PHP', 'Go', 'Flutter', 'React Native', 'iOS', 'Android',
  'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS'
])

// 方法
const removeTag = (removedTag) => {
  const tags = formData.tags.filter(tag => tag !== removedTag)
  formData.tags = tags
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && formData.tags.indexOf(inputValue.value) === -1) {
    if (formData.tags.length < 8) {
      formData.tags = [...formData.tags, inputValue.value]
    } else {
      message.warning('最多只能添加8个标签')
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addPopularTag = (tag) => {
  if (formData.tags.indexOf(tag) === -1) {
    if (formData.tags.length < 8) {
      formData.tags = [...formData.tags, tag]
    } else {
      message.warning('最多只能添加8个标签')
    }
  }
}

const removeSkill = (removedSkill) => {
  const skills = formData.skills.filter(skill => skill !== removedSkill)
  formData.skills = skills
}

const showSkillInput = () => {
  skillInputVisible.value = true
  nextTick(() => {
    skillInputRef.value.focus()
  })
}

const handleSkillInputConfirm = () => {
  if (skillInputValue.value && formData.skills.indexOf(skillInputValue.value) === -1) {
    if (formData.skills.length < 15) {
      formData.skills = [...formData.skills, skillInputValue.value]
    } else {
      message.warning('最多只能添加15个技能')
    }
  }
  skillInputVisible.value = false
  skillInputValue.value = ''
}

const addPopularSkill = (skill) => {
  if (formData.skills.indexOf(skill) === -1) {
    if (formData.skills.length < 15) {
      formData.skills = [...formData.skills, skill]
    } else {
      message.warning('最多只能添加15个技能')
    }
  }
}

const disabledDate = (current) => {
  // 不能选择今天之前的日期
  return current && current < dayjs().startOf('day')
}

const beforeUpload = async (file) => {
  const isValidType = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
  ].includes(file.type)
  
  if (!isValidType) {
    message.error('只能上传PDF、DOC、DOCX或图片格式的文件!')
    return false
  }
  
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB!')
    return false
  }
  
  try {
    // 上传文件
    const response = await uploadAttachment(file)
    file.url = response.url
    file.status = 'done'
    message.success('文件上传成功')
  } catch (error) {
    file.status = 'error'
    message.error('文件上传失败')
  }
  
  return false // 阻止自动上传
}

const handleRemoveAttachment = () => {
  // 处理附件移除
}

const insertText = (text) => {
  const textarea = requirementsRef.value.resizableTextArea.textArea
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = formData.requirements
  
  formData.requirements = content.substring(0, start) + text + content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    const newPosition = start + text.length
    textarea.setSelectionRange(newPosition, newPosition)
  })
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
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br>')
}

const handleSubmit = async (values) => {
  if (formData.tags.length === 0) {
    message.warning('请至少添加一个项目标签')
    return
  }
  
  if (formData.skills.length === 0) {
    message.warning('请至少添加一个技能要求')
    return
  }
  
  loading.value = true
  
  try {
    // 构建提交数据
    const submitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      budget: formData.budget,
      budgetType: formData.budgetType,
      deadline: formData.deadline?.format('YYYY-MM-DD HH:mm:ss'),
      requirements: formData.requirements,
      skills: formData.skills,
      workMode: formData.workMode,
      priority: formData.priority,
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail,
        other: formData.otherContact
      },
      settings: {
        allowPublicBid: formData.allowPublicBid,
        requirePortfolio: formData.requirePortfolio,
        autoNotify: formData.autoNotify
      },
      attachments: attachmentList.value.map(file => file.url).filter(Boolean)
    }
    
    // 调用API
    if (isEdit.value) {
      await updateBounty(route.params.id, submitData)
      message.success('悬赏更新成功！')
    } else {
      await createBounty(submitData)
      message.success(formData.schedulePublish ? '悬赏已设置定时发布' : '悬赏发布成功！')
    }
    
    // 清除草稿
    localStorage.removeItem('bounty_draft')
    
    router.push('/user/bounty')
    
  } catch (error) {
    message.error(isEdit.value ? '更新失败，请稍后重试' : '发布失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const saveDraft = async () => {
  if (!formData.title && !formData.description) {
    message.warning('请至少填写标题或描述')
    return
  }
  
  draftLoading.value = true
  
  try {
    // 构建草稿数据
    const draftData = {
      ...formData,
      deadline: formData.deadline?.format('YYYY-MM-DD HH:mm:ss'),
      publishTime: formData.publishTime?.format('YYYY-MM-DD HH:mm:ss'),
      attachments: attachmentList.value.map(file => file.url).filter(Boolean)
    }
    
    // 保存到服务器
    await saveBountyDraft(draftData)
    
    // 同时保存到本地存储作为备份
    localStorage.setItem('bounty_draft', JSON.stringify(formData))
    
    message.success('草稿保存成功')
    
  } catch (error) {
    // 如果服务器保存失败，至少保存到本地
    localStorage.setItem('bounty_draft', JSON.stringify(formData))
    message.warning('草稿已保存到本地，服务器保存失败')
  } finally {
    draftLoading.value = false
  }
}

const previewBounty = () => {
  if (!formData.title && !formData.description) {
    message.warning('请至少填写标题或描述')
    return
  }
  previewVisible.value = true
}

const goBack = () => {
  router.back()
}

// 自动保存草稿
let autoSaveTimer = null
const startAutoSave = () => {
  autoSaveTimer = setInterval(() => {
    if (formData.title || formData.description) {
      localStorage.setItem('bounty_draft', JSON.stringify(formData))
    }
  }, 30000) // 每30秒自动保存
}

// 加载分类和技能数据
const loadCategoriesAndSkills = async () => {
  try {
    const [categoriesData, skillsData] = await Promise.all([
      getBountyCategories(),
      getPopularSkills()
    ])
    
    categories.value = categoriesData
    popularSkills.value = skillsData
  } catch (error) {
    console.error('加载分类和技能数据失败:', error)
    // 使用默认数据
  }
}

onMounted(async () => {
  // 加载分类和技能数据
  await loadCategoriesAndSkills()
  
  // 检查是否是编辑模式
  if (route.params.id) {
    isEdit.value = true
    // 这里应该加载悬赏数据
    // const bountyData = await getBountyDetail(route.params.id)
    // Object.assign(formData, bountyData)
  }
  
  // 从草稿中恢复数据
  const draft = localStorage.getItem('bounty_draft')
  if (draft && !isEdit.value) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(formData, draftData)
      // 处理日期字段
      if (draftData.deadline) {
        formData.deadline = dayjs(draftData.deadline)
      }
      if (draftData.publishTime) {
        formData.publishTime = dayjs(draftData.publishTime)
      }
      message.info('已恢复上次编辑的草稿')
    } catch (error) {
      console.error('恢复草稿失败:', error)
    }
  }
  
  // 开始自动保存
  startAutoSave()
})

onUnmounted(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
})
</script>

<style scoped lang="less">
.create-bounty-page {
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      margin: 0;
      color: #333;
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
  
  .tags-section {
    .selected-tags {
      margin-bottom: 12px;
      
      .ant-tag {
        margin-bottom: 8px;
      }
    }
    
    .popular-tags {
      .tags-label {
        color: #666;
        margin-right: 8px;
        font-size: 12px;
      }
    }
  }
  
  .skills-section {
    .selected-skills {
      margin-bottom: 12px;
      
      .ant-tag {
        margin-bottom: 8px;
      }
    }
    
    .popular-skills {
      .skills-label {
        color: #666;
        margin-right: 8px;
        font-size: 12px;
      }
    }
  }
  
  .editor-container {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    
    .editor-toolbar {
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
      background-color: #fafafa;
      
      :deep(.ant-btn-group) {
        flex-wrap: wrap;
        gap: 4px;
      }
    }
    
    :deep(.ant-input) {
      border: none;
      border-radius: 0;
      
      &:focus {
        box-shadow: none;
      }
    }
  }
  
  .attachment-upload {
    .upload-tips {
      margin-top: 8px;
      color: #999;
      font-size: 12px;
    }
  }
  
  .publish-time {
    display: flex;
    align-items: center;
  }
}

.preview-modal {
  .bounty-preview {
    .preview-header {
      margin-bottom: 24px;
      
      h1 {
        margin-bottom: 16px;
        color: #333;
        font-size: 28px;
        line-height: 1.3;
      }
      
      .preview-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .meta-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .author-name {
            font-weight: 500;
            color: #333;
          }
          
          .publish-time {
            color: #999;
            font-size: 14px;
          }
        }
        
        .bounty-budget {
          text-align: right;
          
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
    }
    
    .preview-badges {
      margin-bottom: 24px;
      
      .ant-tag {
        margin-right: 8px;
      }
    }
    
    .preview-description,
    .preview-skills,
    .preview-requirements {
      margin-bottom: 24px;
      
      h3 {
        color: #333;
        margin-bottom: 12px;
        font-size: 18px;
      }
      
      p {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }
    }
    
    .skills-list {
      .ant-tag {
        margin-bottom: 8px;
      }
    }
    
    .requirements-content {
      color: #666;
      line-height: 1.8;
      
      :deep(h1) {
        font-size: 20px;
        margin: 16px 0 8px 0;
        color: #333;
      }
      
      :deep(h2) {
        font-size: 18px;
        margin: 14px 0 8px 0;
        color: #333;
      }
      
      :deep(h3) {
        font-size: 16px;
        margin: 12px 0 8px 0;
        color: #333;
      }
      
      :deep(code) {
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
      
      :deep(li) {
        margin-bottom: 4px;
      }
    }
    
    .preview-info {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      
      .info-item {
        display: flex;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          font-weight: 500;
          color: #333;
          min-width: 80px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .create-bounty-page {
    margin: 0 16px;
    
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .editor-container {
      .editor-toolbar {
        :deep(.ant-btn-group) {
          .ant-btn {
            font-size: 12px;
            padding: 4px 8px;
          }
        }
      }
    }
  }
  
  .preview-modal {
    .bounty-preview {
      .preview-header {
        .preview-meta {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
      }
    }
  }
}
</style>