<template>
  <div class="create-service-page">
    <a-card title="创建服务" class="form-card">
      <a-form
        :model="formData"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <!-- 基本信息 -->
        <a-divider orientation="left">基本信息</a-divider>
        
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item name="title" label="服务标题">
              <a-input
                v-model:value="formData.title"
                placeholder="请输入服务标题"
                :maxlength="50"
                show-count
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="category" label="服务分类">
              <a-select v-model:value="formData.category" placeholder="请选择服务分类">
                <a-select-option value="web">网站开发</a-select-option>
                <a-select-option value="mobile">移动应用</a-select-option>
                <a-select-option value="ui">UI设计</a-select-option>
                <a-select-option value="data">数据分析</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item name="description" label="服务描述">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请详细描述您的服务内容、特色和优势"
            :rows="4"
            :maxlength="500"
            show-count
          />
        </a-form-item>
        
        <a-form-item name="tags" label="服务标签">
          <a-select
            v-model:value="formData.tags"
            mode="tags"
            placeholder="请输入服务标签，按回车添加"
            :max-tag-count="5"
          />
        </a-form-item>
        
        <!-- 价格设置 -->
        <a-divider orientation="left">价格设置</a-divider>
        
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item name="price" label="服务价格">
              <a-input-number
                v-model:value="formData.price"
                :min="1"
                :max="999999"
                :precision="2"
                style="width: 100%"
                placeholder="请输入价格"
              >
                <template #addonBefore>¥</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item name="originalPrice" label="原价（可选）">
              <a-input-number
                v-model:value="formData.originalPrice"
                :min="formData.price"
                :max="999999"
                :precision="2"
                style="width: 100%"
                placeholder="显示优惠价格"
              >
                <template #addonBefore>¥</template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item name="deliveryDays" label="交付周期">
              <a-input-number
                v-model:value="formData.deliveryDays"
                :min="1"
                :max="365"
                style="width: 100%"
                placeholder="交付天数"
              >
                <template #addonAfter>天</template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        
        <!-- 服务详情 -->
        <a-divider orientation="left">服务详情</a-divider>
        
        <a-form-item name="features" label="服务特色">
          <div class="feature-list">
            <div v-for="(feature, index) in formData.features" :key="index" class="feature-item">
              <a-input
                v-model:value="formData.features[index]"
                placeholder="请输入服务特色"
              />
              <a-button type="text" danger @click="removeFeature(index)">
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </div>
            <a-button type="dashed" @click="addFeature" style="width: 100%">
              <template #icon><PlusOutlined /></template>
              添加特色
            </a-button>
          </div>
        </a-form-item>
        
        <a-form-item name="requirements" label="需求说明">
          <a-textarea
            v-model:value="formData.requirements"
            placeholder="请说明客户需要提供哪些资料或配合事项"
            :rows="3"
          />
        </a-form-item>
        
        <!-- 图片上传 -->
        <a-divider orientation="left">服务展示</a-divider>
        
        <a-form-item name="coverImage" label="封面图片">
          <a-upload
            v-model:file-list="coverImageList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeUpload"
            @preview="handlePreview"
          >
            <div v-if="coverImageList.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">上传封面</div>
            </div>
          </a-upload>
        </a-form-item>
        
        <a-form-item name="images" label="服务图片">
          <a-upload
            v-model:file-list="imageList"
            list-type="picture-card"
            :max-count="6"
            :before-upload="beforeUpload"
            @preview="handlePreview"
          >
            <div v-if="imageList.length < 6">
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
        
        <!-- 提交按钮 -->
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="submitting">
              提交审核
            </a-button>
            <a-button @click="saveDraft" :loading="saving">
              保存草稿
            </a-button>
            <a-button @click="$router.go(-1)">
              取消
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
    
    <!-- 图片预览 -->
    <a-modal v-model:open="previewVisible" :footer="null">
      <img :src="previewImage" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const submitting = ref(false)
const saving = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const coverImageList = ref([])
const imageList = ref([])

// 表单数据
const formData = reactive({
  title: '',
  category: '',
  description: '',
  tags: [],
  price: null,
  originalPrice: null,
  deliveryDays: 7,
  features: [''],
  requirements: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入服务标题' },
    { min: 5, max: 50, message: '标题长度为5-50个字符' }
  ],
  category: [
    { required: true, message: '请选择服务分类' }
  ],
  description: [
    { required: true, message: '请输入服务描述' },
    { min: 20, max: 500, message: '描述长度为20-500个字符' }
  ],
  price: [
    { required: true, message: '请输入服务价格' },
    { type: 'number', min: 1, message: '价格必须大于0' }
  ],
  deliveryDays: [
    { required: true, message: '请输入交付周期' },
    { type: 'number', min: 1, max: 365, message: '交付周期为1-365天' }
  ]
}

// 方法
const addFeature = () => {
  formData.features.push('')
}

const removeFeature = (index) => {
  if (formData.features.length > 1) {
    formData.features.splice(index, 1)
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

const handlePreview = (file) => {
  previewImage.value = file.url || file.thumbUrl
  previewVisible.value = true
}

const handleSubmit = async (values) => {
  submitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    message.success('服务提交成功，等待审核')
    router.push('/provider/services')
    
  } catch (error) {
    message.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const saveDraft = async () => {
  saving.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('草稿保存成功')
    
  } catch (error) {
    message.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="less">
.create-service-page {
  .form-card {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .feature-list {
    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      
      .ant-input {
        flex: 1;
      }
    }
  }
  
  :deep(.ant-upload-select-picture-card) {
    width: 104px;
    height: 104px;
  }
  
  :deep(.ant-upload-list-picture-card .ant-upload-list-item) {
    width: 104px;
    height: 104px;
  }
}
</style>