<template>
  <div class="edit-service-page">
    <a-card :title="`编辑服务 - ${serviceData.title}`" class="form-card">
      <template #extra>
        <a-space>
          <a-tag :color="getStatusColor(serviceData.status)">
            {{ getStatusText(serviceData.status) }}
          </a-tag>
          <a-button @click="$router.go(-1)">返回</a-button>
        </a-space>
      </template>
      
      <a-spin :spinning="loading">
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
          
          <!-- 提交按钮 -->
          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" :loading="submitting">
                保存修改
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
      </a-spin>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const saving = ref(false)

// 服务数据
const serviceData = ref({
  id: null,
  title: '',
  status: 'active'
})

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
const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    pending: 'orange',
    rejected: 'red',
    offline: 'default'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    active: '已上架',
    pending: '待审核',
    rejected: '已拒绝',
    offline: '已下架'
  }
  return texts[status] || status
}

const addFeature = () => {
  formData.features.push('')
}

const removeFeature = (index) => {
  if (formData.features.length > 1) {
    formData.features.splice(index, 1)
  }
}

const fetchServiceData = async () => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = {
      id: route.params.id,
      title: '企业官网开发',
      category: 'web',
      description: '专业的企业官网开发服务，响应式设计，SEO优化，后台管理系统',
      tags: ['网站开发', 'Vue', 'Node.js'],
      price: 8999,
      originalPrice: 12999,
      deliveryDays: 15,
      features: ['响应式设计', 'SEO优化', '后台管理系统', '源码交付'],
      requirements: '请提供公司资料、LOGO、产品图片等素材',
      status: 'active'
    }
    
    // 填充数据
    serviceData.value = mockData
    Object.assign(formData, mockData)
    
  } catch (error) {
    message.error('获取服务信息失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (values) => {
  submitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    message.success('服务修改成功')
    router.push('/provider/services')
    
  } catch (error) {
    message.error('修改失败，请稍后重试')
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

onMounted(() => {
  fetchServiceData()
})
</script>

<style scoped lang="less">
.edit-service-page {
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
}
</style>