<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <div class="form-header">
          <h1>注册</h1>
          <p>加入IT服务平台，开启技术服务之旅</p>
        </div>
        
        <a-form
          :model="formData"
          :rules="rules"
          @finish="handleRegister"
          layout="vertical"
          size="large"
        >
          <a-form-item name="username" label="用户名">
            <a-input
              v-model:value="formData.username"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item name="email" label="邮箱">
            <a-input
              v-model:value="formData.email"
              placeholder="请输入邮箱地址"
            >
              <template #prefix>
                <MailOutlined />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item name="phone" label="手机号">
            <a-input
              v-model:value="formData.phone"
              placeholder="请输入手机号"
            >
              <template #prefix>
                <PhoneOutlined />
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
          
          <a-form-item name="confirmPassword" label="确认密码">
            <a-input-password
              v-model:value="formData.confirmPassword"
              placeholder="请再次输入密码"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item name="role" label="用户类型">
            <a-radio-group v-model:value="formData.role">
              <a-radio value="user">普通用户</a-radio>
              <a-radio value="provider">服务提供商</a-radio>
            </a-radio-group>
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
          
          <a-form-item name="agreement">
            <a-checkbox v-model:checked="formData.agreement">
              我已阅读并同意
              <a-button type="link" @click="showTerms = true">《用户协议》</a-button>
              和
              <a-button type="link" @click="showPrivacy = true">《隐私政策》</a-button>
            </a-checkbox>
          </a-form-item>
          
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              block
            >
              注册
            </a-button>
          </a-form-item>
          
          <a-form-item>
            <div class="login-link">
              已有账号？
              <router-link to="/login">立即登录</router-link>
            </div>
          </a-form-item>
        </a-form>
      </div>
      
      <div class="register-banner">
        <div class="banner-content">
          <h2>开启技术服务之旅</h2>
          <p>无论您是技术需求方还是服务提供商，我们都为您提供最佳的平台体验</p>
          
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <UserOutlined />
              </div>
              <div class="feature-content">
                <h4>普通用户</h4>
                <p>发布需求、购买服务、参与社区讨论</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <ShopOutlined />
              </div>
              <div class="feature-content">
                <h4>服务提供商</h4>
                <p>展示技能、接单赚钱、建立品牌</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <SafetyOutlined />
              </div>
              <div class="feature-content">
                <h4>安全保障</h4>
                <p>资金托管、服务保障、纠纷仲裁</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 用户协议弹窗 -->
    <a-modal
      v-model:open="showTerms"
      title="用户协议"
      width="800px"
      :footer="null"
    >
      <div class="agreement-content">
        <h3>1. 服务条款</h3>
        <p>欢迎使用IT服务平台。本协议规定了您使用本平台服务的条款和条件...</p>
        
        <h3>2. 用户责任</h3>
        <p>用户在使用本平台时，应当遵守相关法律法规，不得从事违法违规活动...</p>
        
        <h3>3. 平台责任</h3>
        <p>平台致力于为用户提供优质的服务体验，但不对服务的连续性、准确性等作出保证...</p>
        
        <div style="text-align: center; margin-top: 24px;">
          <a-button type="primary" @click="showTerms = false">我已阅读</a-button>
        </div>
      </div>
    </a-modal>
    
    <!-- 隐私政策弹窗 -->
    <a-modal
      v-model:open="showPrivacy"
      title="隐私政策"
      width="800px"
      :footer="null"
    >
      <div class="agreement-content">
        <h3>1. 信息收集</h3>
        <p>我们会收集您在使用服务过程中主动提供的信息，包括但不限于注册信息、联系方式等...</p>
        
        <h3>2. 信息使用</h3>
        <p>我们使用收集的信息来提供、维护和改进我们的服务，以及与您进行沟通...</p>
        
        <h3>3. 信息保护</h3>
        <p>我们采用行业标准的安全措施来保护您的个人信息，防止未经授权的访问、使用或披露...</p>
        
        <div style="text-align: center; margin-top: 24px;">
          <a-button type="primary" @click="showPrivacy = false">我已阅读</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  SafetyOutlined,
  ShopOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  captcha: '',
  agreement: false
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址' },
    { type: 'email', message: '请输入有效的邮箱地址' }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度至少6位' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: (rule, value) => {
        if (value !== formData.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      }
    }
  ],
  captcha: [
    { required: true, message: '请输入验证码' }
  ],
  agreement: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject('请阅读并同意用户协议和隐私政策')
        }
        return Promise.resolve()
      }
    }
  ]
}

// 响应式数据
const loading = ref(false)
const captchaUrl = ref('https://via.placeholder.com/120x40/f0f0f0/666666?text=ABCD')
const showTerms = ref(false)
const showPrivacy = ref(false)

// 刷新验证码
const refreshCaptcha = () => {
  const timestamp = Date.now()
  captchaUrl.value = `https://via.placeholder.com/120x40/f0f0f0/666666?text=${Math.random().toString(36).substr(2, 4).toUpperCase()}&t=${timestamp}`
}

// 注册处理
const handleRegister = async (values) => {
  loading.value = true
  
  try {
    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    message.success('注册成功，请登录')
    router.push('/login')
    
  } catch (error) {
    message.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1000px;
  width: 100%;
}

.register-form {
  flex: 1;
  padding: 48px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  
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
  
  .login-link {
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

.register-banner {
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #52c41a 100%);
  color: white;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .banner-content {
    max-width: 350px;
    
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
    
    .feature-list {
      .feature-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;
        
        .feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 20px;
        }
        
        .feature-content {
          flex: 1;
          
          h4 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 4px;
            color: white;
          }
          
          p {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
          }
        }
      }
    }
  }
}

.agreement-content {
  max-height: 400px;
  overflow-y: auto;
  
  h3 {
    color: #333;
    font-size: 16px;
    margin: 16px 0 8px 0;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .register-banner {
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
      
      .feature-list {
        .feature-item {
          flex-direction: column;
          text-align: center;
          
          .feature-icon {
            margin: 0 auto 12px auto;
          }
        }
      }
    }
  }
  
  .register-form {
    padding: 24px;
    max-height: none;
  }
}
</style>