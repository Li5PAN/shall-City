<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <a-button-group size="small">
        <a-button @click="insertText('# ')" title="标题1">H1</a-button>
        <a-button @click="insertText('## ')" title="标题2">H2</a-button>
        <a-button @click="insertText('### ')" title="标题3">H3</a-button>
        <a-button @click="insertWrap('**')" title="粗体">
          <BoldOutlined />
        </a-button>
        <a-button @click="insertWrap('*')" title="斜体">
          <ItalicOutlined />
        </a-button>
        <a-button @click="insertWrap('`')" title="行内代码">
          <CodeOutlined />
        </a-button>
        <a-button @click="insertText('- ')" title="无序列表">
          <UnorderedListOutlined />
        </a-button>
        <a-button @click="insertText('1. ')" title="有序列表">
          <OrderedListOutlined />
        </a-button>
        <a-button @click="insertText('> ')" title="引用">
          <MenuOutlined />
        </a-button>
        <a-button @click="insertText('---\n')" title="分割线">
          <LineOutlined />
        </a-button>
      </a-button-group>
      <a-button size="small" :type="showPreview ? 'primary' : 'default'" @click="showPreview = !showPreview">
        <EyeOutlined />
        预览
      </a-button>
    </div>
    <div class="editor-body" :class="{ 'with-preview': showPreview }">
      <div class="editor-input">
        <a-textarea
          ref="textareaRef"
          :value="modelValue"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :rows="rows"
          show-count
          @input="handleInput"
        />
      </div>
      <div v-if="showPreview" class="editor-preview">
        <div class="preview-content" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  EyeOutlined,
  MenuOutlined,
  LineOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容，支持 Markdown 语法...'
  },
  maxLength: {
    type: Number,
    default: 5000
  },
  rows: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue'])

const textareaRef = ref()
const showPreview = ref(false)

const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const getTextarea = () => {
  return textareaRef.value?.resizableTextArea?.textArea
}

const insertText = (text) => {
  const textarea = getTextarea()
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = props.modelValue
  const newContent = content.substring(0, start) + text + content.substring(end)
  emit('update:modelValue', newContent)
  nextTick(() => {
    textarea.focus()
    const pos = start + text.length
    textarea.setSelectionRange(pos, pos)
  })
}

const insertWrap = (wrapper) => {
  const textarea = getTextarea()
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const content = props.modelValue
  const selected = content.substring(start, end)
  const text = selected || '文本'
  const newContent = content.substring(0, start) + wrapper + text + wrapper + content.substring(end)
  emit('update:modelValue', newContent)
  nextTick(() => {
    textarea.focus()
    const newStart = start + wrapper.length
    const newEnd = newStart + text.length
    textarea.setSelectionRange(newStart, newEnd)
  })
}

const renderedContent = computed(() => {
  if (!props.modelValue) return '<p style="color:#999">预览区域</p>'
  return renderMarkdown(props.modelValue)
})

const renderMarkdown = (content) => {
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^---$/gim, '<hr />')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br>')
}
</script>

<style scoped lang="less">
.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;

  .editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
  }

  .editor-body {
    display: flex;

    &.with-preview {
      .editor-input {
        width: 50%;
        border-right: 1px solid #f0f0f0;
      }
      .editor-preview {
        width: 50%;
      }
    }

    .editor-input {
      width: 100%;
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
      padding: 12px;
      overflow-y: auto;
      max-height: 400px;

      .preview-content {
        color: #333;
        line-height: 1.8;
        word-break: break-word;

        :deep(h1) { font-size: 20px; margin: 12px 0 8px; }
        :deep(h2) { font-size: 18px; margin: 10px 0 6px; }
        :deep(h3) { font-size: 16px; margin: 8px 0 4px; }
        :deep(code) {
          background: #f5f5f5;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
        :deep(blockquote) {
          border-left: 3px solid #d9d9d9;
          padding-left: 12px;
          color: #666;
          margin: 8px 0;
        }
        :deep(hr) {
          border: none;
          border-top: 1px solid #f0f0f0;
          margin: 12px 0;
        }
      }
    }
  }
}
</style>
