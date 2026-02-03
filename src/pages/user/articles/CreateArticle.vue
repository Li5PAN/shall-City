<template>
  <div class="create-article-page">
    <a-card>
      <template #title>
        <div class="page-header">
          <h2>{{ isEdit ? '编辑文章' : '发布文章' }}</h2>
          <div class="header-actions">
            <a-button @click="saveDraft" :loading="draftLoading">
              <SaveOutlined />
              保存草稿
            </a-button>
            <a-button @click="previewArticle">
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
        <!-- 文章标题 -->
        <a-form-item label="文章标题" name="title">
          <a-input
            v-model:value="formData.title"
            placeholder="请输入文章标题（5-100个字符）"
            :maxlength="100"
            show-count
            size="large"
          />
        </a-form-item>

        <!-- 文章摘要 -->
        <a-form-item label="文章摘要" name="summary">
          <a-textarea
            v-model:value="formData.summary"
            placeholder="请输入文章摘要，简要描述文章内容（10-300个字符）"
            :rows="3"
            :maxlength="300"
            show-count
          />
        </a-form-item>

        <!-- 分类和标签 -->
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="文章分类" name="category">
              <a-select
                v-model:value="formData.category"
                placeholder="请选择文章分类"
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
            <a-form-item label="文章标签" name="tags">
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

        <!-- 封面图片 -->
        <a-form-item label="封面图片">
          <div class="cover-upload">
            <a-upload
              v-model:file-list="coverFileList"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :remove="handleRemoveCover"
              :max-count="1"
            >
              <div v-if="coverFileList.length < 1">
                <PlusOutlined />
                <div style="margin-top: 8px">上传封面</div>
              </div>
            </a-upload>
            <div class="upload-tips">
              建议尺寸：800x450像素，支持JPG、PNG格式，文件大小不超过2MB
            </div>
          </div>
        </a-form-item>

        <!-- 文章内容 -->
        <a-form-item label="文章内容" name="content">
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
                <a-button @click="insertText('```javascript\n代码块\n```')">
                  <FileTextOutlined />
                </a-button>
                <a-button @click="insertText('[链接文字](https://example.com)')">
                  <LinkOutlined />
                </a-button>
                <a-button @click="insertText('![图片描述](图片链接)')">
                  <PictureOutlined />
                </a-button>
                <a-button @click="insertText('> 引用内容')">
                  <MessageOutlined />
                </a-button>
                <a-button @click="insertText('- 列表项')">
                  <UnorderedListOutlined />
                </a-button>
                <a-button @click="insertText('1. 有序列表')">
                  <OrderedListOutlined />
                </a-button>
              </a-button-group>
            </div>
            <div class="editor-content">
              <div class="editor-input">
                <a-textarea
                  ref="contentRef"
                  v-model:value="formData.content"
                  placeholder="请输入文章内容，支持Markdown语法..."
                  :rows="20"
                  :maxlength="50000"
                  show-count
                />
              </div>
              <div class="editor-preview" v-if="showPreview">
                <div class="preview-content" v-html="renderMarkdown(formData.content)"></div>
              </div>
            </div>
            <div class="editor-footer">
              <a-checkbox v-model:checked="showPreview">实时预览</a-checkbox>
              <a-button type="link" @click="toggleFullscreen">
                {{ isFullscreen ? '退出全屏' : '全屏编辑' }}
              </a-button>
            </div>
          </div>
        </a-form-item>

        <!-- 发布设置 -->
        <a-form-item label="发布设置">
          <a-space direction="vertical">
            <a-checkbox v-model:checked="formData.allowComment">
              允许评论
            </a-checkbox>
            <a-checkbox v-model:checked="formData.allowReprint">
              允许转载
            </a-checkbox>
            <a-checkbox v-model:checked="formData.notifyFollowers">
              通知关注者
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
      title="文章预览"
      width="900px"
      :footer="null"
      class="preview-modal"
    >
      <div class="article-preview">
        <div class="preview-header">
          <h1>{{ formData.title || '未设置标题' }}</h1>
          <div class="preview-meta">
            <div class="meta-info">
              <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <span class="author-name">当前用户</span>
              <span class="publish-time">{{ new Date().toLocaleString() }}</span>
            </div>
            <div class="article-tags">
              <a-tag v-for="tag in formData.tags" :key="tag">{{ tag }}</a-tag>
            </div>
          </div>
        </div>
        <div class="preview-summary" v-if="formData.summary">
          <blockquote>{{ formData.summary }}</blockquote>
        </div>
        <div class="preview-content" v-html="renderMarkdown(formData.content)"></div>
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
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  MessageOutlined,
  UnorderedListOutlined,
  OrderedListOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const draftLoading = ref(false)
const previewVisible = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()
const contentRef = ref()
const coverFileList = ref([])
const showPreview = ref(false)
const isFullscreen = ref(false)
const isEdit = ref(false)

// 表单数据
const formData = reactive({
  title: '',
  summary: '',
  category: '',
  tags: [],
  content: '',
  allowComment: true,
  allowReprint: true,
  notifyFollowers: true,
  schedulePublish: false,
  publishTime: null
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要' },
    { min: 10, max: 300, message: '摘要长度应在10-300个字符之间' }
  ],
  category: [
    { required: true, message: '请选择文章分类' }
  ],
  content: [
    { required: true, message: '请输入文章内容' },
    { min: 100, message: '文章内容至少需要100个字符' }
  ]
}

// 分类数据
const categories = ref([
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'mobile', name: '移动开发' },
  { id: 'ai', name: '人工智能' },
  { id: 'blockchain', name: '区块链' },
  { id: 'devops', name: 'DevOps' },
  { id: 'database', name: '数据库' },
  { id: 'algorithm', name: '算法与数据结构' }
])

// 热门标签
const popularTags = ref([
  'Vue', 'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 
  'Java', 'Go', 'Docker', 'Kubernetes', 'MySQL', 'Redis', 'MongoDB',
  '微服务', '性能优化', '最佳实践'
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

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  return false // 阻止自动上传
}

const handleRemoveCover = () => {
  coverFileList.value = []
}

const insertText = (text) => {
  const textarea = contentRef.value.resizableTextArea.textArea
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = formData.content
  
  formData.content = content.substring(0, start) + text + content.substring(end)
  
  nextTick(() => {
    textarea.focus()
    const newPosition = start + text.length
    textarea.setSelectionRange(newPosition, newPosition)
  })
}

const renderMarkdown = (content) => {
  // 简单的Markdown渲染（实际项目中应使用专业的Markdown解析器）
  return content
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\n/g, '<br>')
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  const editorContainer = document.querySelector('.editor-container')
  if (isFullscreen.value) {
    editorContainer.classList.add('fullscreen')
  } else {
    editorContainer.classList.remove('fullscreen')
  }
}

const handleSubmit = async (values) => {
  if (formData.tags.length === 0) {
    message.warning('请至少添加一个标签')
    return
  }
  
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    message.success(formData.schedulePublish ? '文章已设置定时发布' : '文章发布成功！')
    router.push('/user/articles')
    
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
    
    // 保存到本地存储
    localStorage.setItem('article_draft', JSON.stringify(formData))
    
    message.success('草稿保存成功')
    
  } catch (error) {
    message.error('保存草稿失败')
  } finally {
    draftLoading.value = false
  }
}

const previewArticle = () => {
  if (!formData.title && !formData.content) {
    message.warning('请至少填写标题或内容')
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
    if (formData.title || formData.content) {
      localStorage.setItem('article_draft', JSON.stringify(formData))
    }
  }, 30000) // 每30秒自动保存
}

onMounted(() => {
  // 检查是否是编辑模式
  if (route.params.id) {
    isEdit.value = true
    // 这里应该加载文章数据
  }
  
  // 从草稿中恢复数据
  const draft = localStorage.getItem('article_draft')
  if (draft && !isEdit.value) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(formData, draftData)
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
.create-article-page {
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
  
  .cover-upload {
    .upload-tips {
      margin-top: 8px;
      color: #999;
      font-size: 12px;
    }
  }
  
  .editor-container {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    position: relative;
    
    &.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background: white;
      border-radius: 0;
      
      .editor-content {
        height: calc(100vh - 100px);
        
        .editor-input,
        .editor-preview {
          height: 100%;
        }
        
        :deep(.ant-input) {
          height: 100%;
          resize: none;
        }
      }
    }
    
    .editor-toolbar {
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
      background-color: #fafafa;
      
      :deep(.ant-btn-group) {
        flex-wrap: wrap;
        gap: 4px;
      }
    }
    
    .editor-content {
      display: flex;
      min-height: 500px;
      
      .editor-input {
        flex: 1;
        
        :deep(.ant-input) {
          border: none;
          border-radius: 0;
          resize: none;
          
          &:focus {
            box-shadow: none;
          }
        }
      }
      
      .editor-preview {
        flex: 1;
        border-left: 1px solid #f0f0f0;
        padding: 12px;
        overflow-y: auto;
        background-color: #fafafa;
        
        .preview-content {
          line-height: 1.6;
          color: #333;
          
          :deep(h1) {
            font-size: 24px;
            margin: 16px 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
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
          
          :deep(pre) {
            background-color: #f5f5f5;
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            
            code {
              background: none;
              padding: 0;
            }
          }
          
          :deep(blockquote) {
            border-left: 4px solid #1890ff;
            padding-left: 12px;
            margin: 12px 0;
            color: #666;
          }
          
          :deep(img) {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
          }
          
          :deep(a) {
            color: #1890ff;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    
    .editor-footer {
      padding: 8px 12px;
      border-top: 1px solid #f0f0f0;
      background-color: #fafafa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .publish-time {
    display: flex;
    align-items: center;
  }
}

.preview-modal {
  .article-preview {
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
        
        .article-tags {
          .ant-tag {
            margin-left: 8px;
          }
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
      line-height: 1.8;
      color: #333;
      font-size: 16px;
    }
  }
}

@media (max-width: 768px) {
  .create-article-page {
    margin: 0 16px;
    
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .editor-container {
      .editor-content {
        flex-direction: column;
        
        .editor-preview {
          border-left: none;
          border-top: 1px solid #f0f0f0;
          max-height: 300px;
        }
      }
      
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
}
</style>