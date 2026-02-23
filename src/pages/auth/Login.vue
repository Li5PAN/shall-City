<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <div class="form-header">
          <h1>登录</h1>
          <p>欢迎回到IT服务平台</p>
        </div>
        
        <a-form
          :model="formData"
          :rules="rules"
          @finish="handleLogin"
          layout="vertical"
          size="large"
        >
          <a-form-item name="username" label="用户名/邮箱">
            <a-input
              v-model:value="formData.username"
              placeholder="请输入用户名或邮箱"
              prefix-icon="UserOutlined"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item name="password" label="密码">
            <a-input-password
              v-model:value="formData.password"
              placeholder="请输入密码"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item name="captcha" label="验证码">
            <a-row :gutter="8">
              <a-col :span="16">
                <a-input
                  v-model:value="formData.captcha"
                  placeholder="请输入验证码"
                >
                  <template #prefix>
                    <SafetyOutlined />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="8">
                <div class="captcha-image" @click="refreshCaptcha">
                  <img :src="captchaUrl" alt="验证码" />
                </div>
              </a-col>
            </a-row>
          </a-form-item>
          
          <a-form-item>
            <div class="form-options">
              <a-checkbox v-model:checked="rememberMe">记住我</a-checkbox>
              <a-button type="link" @click="showForgotPassword = true">忘记密码？</a-button>
            </div>
          </a-form-item>
          
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              block
            >
              登录
            </a-button>
          </a-form-item>
          
          <a-form-item>
            <div class="register-link">
              还没有账号？
              <router-link to="/register">立即注册</router-link>
            </div>
          </a-form-item>
        </a-form>
        
        <a-divider>其他登录方式</a-divider>
        
        <div class="social-login">
          <a-button shape="circle" size="large">
            <template #icon><WechatOutlined /></template>
          </a-button>
          <a-button shape="circle" size="large">
            <template #icon><QqOutlined /></template>
          </a-button>
          <a-button shape="circle" size="large">
            <template #icon><WeiboOutlined /></template>
          </a-button>
        </div>
      </div>
      
      <div class="login-banner">
        <div class="banner-content">
          <h2>连接技术与需求</h2>
          <p>专业的IT服务平台，为您提供一站式技术解决方案</p>
          <ul>
            <li><CheckOutlined /> 海量优质服务商</li>
            <li><CheckOutlined /> 专业技术保障</li>
            <li><CheckOutlined /> 安全交易环境</li>
            <li><CheckOutlined /> 7x24小时服务</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- 忘记密码弹窗 -->
    <a-modal
      v-model:open="showForgotPassword"
      title="找回密码"
      @ok="handleForgotPassword"
      :confirm-loading="forgotPasswordLoading"
    >
      <a-form :model="forgotPasswordForm" layout="vertical">
        <a-form-item label="邮箱地址">
          <a-input
            v-model:value="forgotPasswordForm.email"
            placeholder="请输入注册邮箱"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  captcha: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名或邮箱' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度至少6位' }
  ],
  captcha: [
    { required: true, message: '请输入验证码' }
  ]
}

// 响应式数据
const loading = ref(false)
const rememberMe = ref(false)
const captchaUrl = ref('https://via.placeholder.com/120x40/f0f0f0/666666?text=ABCD')
const showForgotPassword = ref(false)
const forgotPasswordLoading = ref(false)
const forgotPasswordForm = reactive({
  email: ''
})

// 刷新验证码
const refreshCaptcha = () => {
  const timestamp = Date.now()
  captchaUrl.value = `https://via.placeholder.com/120x40/f0f0f0/666666?text=${Math.random().toString(36).substr(2, 4).toUpperCase()}&t=${timestamp}`
}

// 登录处理
const handleLogin = async (values) => {
  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const res = await authStore.login({ username: values.username, password: values.password })
    const userRole = res.userInfo.role
    
    if (userRole === 'admin') {
      router.push('/admin/statistics')
    } else {
      router.push('/home')
    }
  } catch (error) {
    message.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 忘记密码处理
const handleForgotPassword = async () => {
  if (!forgotPasswordForm.email) {
    message.warning('请输入邮箱地址')
    return
  }
  
  forgotPasswordLoading.value = true
  
  try {
    // 模拟发送重置邮件
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('重置密码邮件已发送，请查收')
    showForgotPassword.value = false
    forgotPasswordForm.email = ''
  } catch (error) {
    message.error('发送失败，请稍后重试')
  } finally {
    forgotPasswordLoading.value = false
  }
}
</script>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
}

.login-form {
  flex: 1;
  padding: 48px;
  max-width: 400px;
  
  .form-header {
    text-align: center;
    margin-bottom: 32px;
    
    h1 {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .register-link {
    text-align: center;
    color: #666;
    
    a {
      color: #1890ff;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 16px;
    
    .ant-btn {
      color: #666;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
  
  .captcha-image {
    height: 40px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &:hover {
      border-color: #40a9ff;
    }
  }
}

.login-banner {
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .banner-content {
    max-width: 300px;
    
    h2 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 16px;
      color: white;
    }
    
    p {
      font-size: 16px;
      margin-bottom: 32px;
      color: rgba(255, 255, 255, 0.9);
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
        
        .anticon {
          margin-right: 8px;
          color: #52c41a;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-banner {
    order: -1;
    padding: 24px;
    
    .banner-content {
      text-align: center;
      
      h2 {
        font-size: 24px;
      }
      
      p {
        font-size: 14px;
      }
    }
  }
  
  .login-form {
    padding: 24px;
  }
}
</style>