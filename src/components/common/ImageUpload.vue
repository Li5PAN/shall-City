<template>
  <div class="image-upload">
    <a-upload
      v-model:file-list="fileList"
      :action="action"
      list-type="picture-card"
      :accept="accept"
      :multiple="maxCount > 1"
      :max-count="maxCount"
      :before-upload="beforeUpload"
      :headers="uploadHeaders"
      @change="handleChange"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < maxCount">
        <plus-outlined />
        <div style="margin-top: 8px">上传</div>
      </div>
    </a-upload>

    <!-- 预览弹窗 -->
    <a-modal
      :open="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img :src="previewImage" alt="preview" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const props = defineProps({
  maxCount: {
    type: Number,
    default: 1
  },
  maxSize: {
    type: Number,
    default: 5
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  action: {
    type: String,
    default: '/api/v1/upload'
  },
  value: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change', 'success'])

const fileList = ref([...props.value])
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
}

watch(() => props.value, (val) => {
  fileList.value = [...val]
}, { deep: true })

const beforeUpload = (file) => {
  const isValidSize = file.size / 1024 / 1024 < props.maxSize
  if (!isValidSize) {
    message.error(`文件大小不能超过 ${props.maxSize}MB`)
    return false
  }
  return true
}

const handleChange = ({ fileList: newFileList, file }) => {
  fileList.value = newFileList
  emit('change', newFileList)
  if (file.status === 'done') {
    emit('success', file)
  }
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewTitle.value = file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || '预览'
  previewVisible.value = true
}
</script>

<style scoped lang="less">
.image-upload {
  :deep(.ant-upload-select) {
    width: 104px;
    height: 104px;
  }
}
</style>
