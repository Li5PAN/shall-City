<template>
  <div class="profile-page">
    <a-card title="个人信息" class="profile-card">
      <a-row :gutter="24">
        <!-- 左侧头像和基本信息 -->
        <a-col :span="8">
          <div class="avatar-section">
            <a-avatar :size="120" :src="userInfo.avatar" />
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeUpload"
              @change="handleAvatarChange"
            >
              <a-button type="primary" style="margin-top: 16px;">
                <UploadOutlined />
                更换头像
              </a-button>
            </a-upload>
          </div>
        </a-col>
        
        <!-- 右侧详细信息 -->
        <a-col :span="16">
          <a-form
            :model="formData"
            :rules="rules"
            layout="vertical"
            @finish="handleSubmit"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="用户名" name="username">
                  <a-input v-model:value="formData.username" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="昵称" name="nickname">
                  <a-input v-model:value="formData.nickname" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="邮箱" name="email">
                  <a-input v-model:value="formData.email" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="手机号" name="phone">
                  <a-input v-model:value="formData.phone" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="性别" name="gender">
                  <a-select v-model:value="formData.gender">
                    <a-select-option value="male">男</a-select-option>
                    <a-select-option value="female">女</a-select-option>
                    <a-select-option value="other">其他</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="生日" name="birthday">
                  <a-date-picker 
                    v-model:value="formData.birthday" 
                    style="width: 100%"
                    format="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-form-item label="所在地区" name="location">
              <a-cascader
                v-model:value="formData.location"
                :options="locationOptions"
                placeholder="请选择省市区"
                style="width: 100%"
              />
            </a-form-item>
            
            <a-form-item label="职业" name="profession">
              <a-input v-model:value="formData.profession" />
            </a-form-item>
            
            <a-form-item label="个人简介" name="bio">
              <a-textarea 
                v-model:value="formData.bio" 
                :rows="4" 
                placeholder="介绍一下自己吧..."
              />
            </a-form-item>
            
            <a-form-item label="技能标签" name="skills">
              <div class="skills-section">
                <a-tag
                  v-for="skill in formData.skills"
                  :key="skill"
                  closable
                  @close="removeSkill(skill)"
                >
                  {{ skill }}
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
                  添加技能
                </a-tag>
              </div>
            </a-form-item>
            
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit" :loading="loading">
                  保存修改
                </a-button>
                <a-button @click="resetForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
    
    <!-- 统计信息卡片 -->
    <a-row :gutter="16" style="margin-top: 24px;">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="发布文章"
            :value="stats.articles"
            :value-style="{ color: '#3f8600' }"
          >
            <template #suffix>
              <span>篇</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="获得点赞"
            :value="stats.likes"
            :value-style="{ color: '#cf1322' }"
          >
            <template #suffix>
              <HeartOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="关注数"
            :value="stats.following"
            :value-style="{ color: '#1890ff' }"
          >
            <template #suffix>
              <span>人</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="粉丝数"
            :value="stats.followers"
            :value-style="{ color: '#722ed1' }"
          >
            <template #suffix>
              <span>人</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {
  UploadOutlined,
  PlusOutlined,
  HeartOutlined
} from '@ant-design/icons-vue'

// 响应式数据
const loading = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()

// 用户信息
const userInfo = ref({
  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
})

// 表单数据
const formData = reactive({
  username: '张三',
  nickname: '前端小王',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  gender: 'male',
  birthday: dayjs('1990-01-01'),
  location: ['北京市', '北京市', '朝阳区'],
  profession: '前端工程师',
  bio: '热爱技术，专注于前端开发，擅长Vue、React等现代前端框架。',
  skills: ['Vue', 'React', 'JavaScript', 'TypeScript', 'Node.js']
})

// 统计数据
const stats = ref({
  articles: 23,
  likes: 156,
  following: 89,
  followers: 234
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
  ]
}

// 地区选项（简化版）
const locationOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '西城区', label: '西城区' }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '浦东新区', label: '浦东新区' },
          { value: '黄浦区', label: '黄浦区' },
          { value: '静安区', label: '静安区' }
        ]
      }
    ]
  }
]

// 方法
const handleSubmit = async (values) => {
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('个人信息更新成功')
    
    // 更新本地存储的用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    Object.assign(userInfo, values)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
  } catch (error) {
    message.error('更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  // 重置表单到初始状态
  Object.assign(formData, {
    username: '张三',
    nickname: '前端小王',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    gender: 'male',
    birthday: dayjs('1990-01-01'),
    location: ['北京市', '北京市', '朝阳区'],
    profession: '前端工程师',
    bio: '热爱技术，专注于前端开发，擅长Vue、React等现代前端框架。',
    skills: ['Vue', 'React', 'JavaScript', 'TypeScript', 'Node.js']
  })
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

const handleAvatarChange = (info) => {
  // 这里应该处理头像上传逻辑
  message.success('头像上传成功')
}

const removeSkill = (removedSkill) => {
  const skills = formData.skills.filter(skill => skill !== removedSkill)
  formData.skills = skills
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && formData.skills.indexOf(inputValue.value) === -1) {
    formData.skills = [...formData.skills, inputValue.value]
  }
  inputVisible.value = false
  inputValue.value = ''
}

onMounted(() => {
  // 从本地存储加载用户信息
  const savedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  if (savedUserInfo.username) {
    Object.assign(formData, savedUserInfo)
  }
})
</script>

<style scoped lang="less">
.profile-page {
  .profile-card {
    .avatar-section {
      text-align: center;
      
      .ant-avatar {
        border: 4px solid #f0f0f0;
      }
    }
    
    .skills-section {
      .ant-tag {
        margin-bottom: 8px;
      }
    }
  }
  
  .ant-statistic {
    text-align: center;
  }
}
</style>