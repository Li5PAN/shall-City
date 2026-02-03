<template>
  <div class="create-post-page">
    <a-card title="发布帖子">
      <a-form
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- 帖子标题 -->
        <a-form-item label="帖子标题" name="title">
          <a-input
            v-model:value="formData.title"
            placeholder="请输入帖子标题（5-100个字符）"
            :maxlength="100"
            show-count
            size="large"
          />
        </a-form-item>

        <!-- 分类选择 -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="选择分类" name="category">
              <a-select
                v-model:value="formData.category"
                placeholder="请选择帖子分类"
                size="large"
              >
                <a-select-option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  <component :is="category.icon" style="margin-right: 8px;" />
                  {{ category.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="帖子类型" name="type">
              <a-select
                v-model:value="formData.type"
                placeholder="请选择帖子类型"
                size="large"
              >
                <a-select-option value="question">
                  <QuestionCircleOutlined style="margin-right: 8px;" />
                  技术问答
                </a-select-option>
                <a-select-option value="share">
                  <ShareAltOutlined style="margin-right: 8px;" />
                  经验分享
                </a-select-option>
                <a-select-option value="tutorial">
                  <BookOutlined style="margin-right: 8px;" />
                  教程文档
                </a-select-option>
                <a-select-option value="discussion">
                  <MessageOutlined style="margin-right: 8px;" />
                  技术讨论
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 标签选择 -->
        <a-form-item label="添加标签" name="tags">
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

        <!-- 帖子内容 -->
        <a-form-item label="帖子内容" name="content">
          <div class="editor-container">
            <div class="editor-toolbar">
              <a-button-group size="small">
                <a-button @click="insertText('**粗体**')">
                  <BoldOutlined />
                </a-button>
                <a-button @click="insertText('*斜体*')">
                  <ItalicOutlined />
                </a-button>
                <a-button @click="insertText('`代码`')">
                  <CodeOutlined />
                </a-button>
                <a-button @click="insertText('```\n代码块\n```')">
                  <FileTextOutlined />
                </a-button>
                <a-button @click="insertText('[链接](url)')">
                  <LinkOutlined />
                </a-button>
                <a-button @click="insertText('![图片](url)')">
                  <PictureOutlined />
                </a-button>
              </a-button-group>
            </div>
            <a-textarea
              ref="contentRef"
              v-model:value="formData.content"
              placeholder="请详细描述你的问题或分享你的经验..."
              :rows="15"
              :maxlength="10000"
              show-count
            />
          </div>
        </a-form-item>

        <!-- 附件上传 -->
        <a-form-item label="上传附件（可选）">
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            :remove="handleRemove"
            multiple
          >
            <a-button>
              <UploadOutlined />
              选择文件
            </a-button>
            <span style="margin-left: 8px; color: #666;">
              支持图片、文档等格式，单个文件不超过10MB
            </span>
          </a-upload>
        </a-form-item>

        <!-- 发布设置 -->
        <a-form-item label="发布设置">
          <a-space direction="vertical">
            <a-checkbox v-model:checked="formData.allowComment">
              允许评论
            </a-checkbox>
            <a-checkbox v-model:checked="formData.notifyReply">
              有新回复时通知我
            </a-checkbox>
          </a-space>
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading" size="large">
              <SendOutlined />
              发布帖子
            </a-button>
            <a-button @click="saveDraft" :loading="draftLoading" size="large">
              <SaveOutlined />
              保存草稿
            </a-button>
            <a-button @click="previewPost" size="large">
              <EyeOutlined />
              预览
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
      title="帖子预览"
      width="800px"
      :footer="null"
    >
      <div class="post-preview">
        <div class="preview-header">
          <h2>{{ formData.title || '未设置标题' }}</h2>
          <div class="preview-meta">
            <a-tag :color="getTypeColor(formData.type)">
              {{ getTypeName(formData.type) }}
            </a-tag>
            <a-tag v-for="tag in formData.tags" :key="tag">{{ tag }}</a-tag>
          </div>
        </div>
        <div class="preview-content" v-html="renderMarkdown(formData.content)"></div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  QuestionCircleOutlined,
  ShareAltOutlined,
  BookOutlined,
  MessageOutlined,
  PlusOutlined,
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  UploadOutlined,
  SendOutlined,
  SaveOutlined,
  EyeOutlined,
  DatabaseOutlined,
  MobileOutlined,
  CloudOutlined,
  RobotOutlined,
  TeamOutlined,
  ToolOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const draftLoading = ref(false)
const previewVisible = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()
const contentRef = ref()
const fileList = ref([])

// 表单数据
const formData = reactive({
  title: '',
  category: '',
  type: '',
  tags: [],
  content: '',
  allowComment: true,
  notifyReply: true
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入帖子标题' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间' }
  ],
  category: [
    { required: true, message: '请选择帖子分类' }
  ],
  type: [
    { required: true, message: '请选择帖子类型' }
  ],
  content: [
    { required: true, message: '请输入帖子内容' },
    { min: 20, message: '内容至少需要20个字符' }
  ]
}

// 分类数据
const categories = ref([
  { id: 'frontend', name: '前端开发', icon: CodeOutlined },
  { id: 'backend', name: '后端开发', icon: DatabaseOutlined },
  { id: 'mobile', name: '移动开发', icon: MobileOutlined },
  { id: 'cloud', name: '云计算DevOps', icon: CloudOutlined },
  { id: 'ai', name: '人工智能', icon: RobotOutlined },
  { id: 'newbie', name: '新手入门', icon: TeamOutlined },
  { id: 'tools', name: '工具分享', icon: ToolOutlined }
])

// 热门标签
const popularTags = ref([
  'Vue', 'React', 'JavaScript', 'Python', 'Java', 'Node.js', 
  'TypeScript', 'Docker', 'Kubernetes', 'MySQL', 'Redis', 'MongoDB'
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
    if (formData.tags.length < 5) {
      formData.tags = [...formData.tags, inputValue.value]
    } else {
      message.warning('最多只能添加5个标签')
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addPopularTag = (tag) => {
  if (formData.tags.indexOf(tag) === -1) {
    if (formData.tags.length < 5) {
      formData.tags = [...formData.tags, tag]
    } else {
      message.warning('最多只能添加5个标签')
    }
  }
}

const insertText = (text) => {
  const textarea = contentRef.value.resizableTextArea.textArea
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = formData.content
  
  formData.content = content.substring(0, start) + text + content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + text.length, start + text.length)
  })
}

const beforeUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'].includes(file.type)
  if (!isValidType) {
    message.error('只能上传图片、PDF或文本文件!')
    return false
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('文件大小不能超过10MB!')
    return false
  }
  return false // 阻止自动上传
}

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file)
  const newFileList = fileList.value.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
}

const getTypeColor = (type) => {
  const colors = {
    question: 'blue',
    share: 'green',
    tutorial: 'orange',
    discussion: 'purple'
  }
  return colors[type] || 'default'
}

const getTypeName = (type) => {
  const names = {
    question: '技术问答',
    share: '经验分享',
    tutorial: '教程文档',
    discussion: '技术讨论'
  }
  return names[type] || '未知类型'
}

const renderMarkdown = (content) => {
  // 简单的Markdown渲染（实际项目中应使用专业的Markdown解析器）
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

const handleSubmit = async (values) => {
  if (formData.tags.length === 0) {
    message.warning('请至少添加一个标签')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    message.success('帖子发布成功！')
    router.push('/user/forum')
    
  } catch (error) {
    message.error('发布失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const saveDraft = async () => {
  if (!formData.title && !formData.content) {
    message.warning('请至少填写标题或内容')
    return
  }
  
  draftLoading.value = true
  
  try {
    // 模拟保存草稿
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('草稿保存成功')
    
  } catch (error) {
    message.error('保存草稿失败')
  } finally {
    draftLoading.value = false
  }
}

const previewPost = () => {
  if (!formData.title && !formData.content) {
    message.warning('请至少填写标题或内容')
    return
  }
  previewVisible.value = true
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // 从草稿中恢复数据
  const draft = localStorage.getItem('forum_post_draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(formData, draftData)
    } catch (error) {
      console.error('恢复草稿失败:', error)
    }
  }
})
</script>

<style scoped lang="less">
.create-post-page {
  max-width: 1000px;
  margin: 0 auto;
  
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
    }
    
    :deep(.ant-input) {
      border: none;
      border-radius: 0;
      
      &:focus {
        box-shadow: none;
      }
    }
  }
  
  .post-preview {
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
    
    .preview-content {
      line-height: 1.6;
      color: #333;
      
      :deep(code) {
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
      
      :deep(strong) {
        font-weight: bold;
      }
      
      :deep(em) {
        font-style: italic;
      }
    }
  }
}

@media (max-width: 768px) {
  .create-post-page {
    margin: 0 16px;
    
    .editor-toolbar {
      :deep(.ant-btn-group) {
        flex-wrap: wrap;
      }
    }
  }
}
</style>