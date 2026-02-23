<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-illustration">
        <img src="https://via.placeholder.com/400x300/f0f0f0/666666?text=403" alt="403" />
      </div>
      
      <div class="error-info">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">权限不足</h2>
        <p class="error-description">
          抱歉，您没有权限访问该页面。请确认您的账号角色是否正确。
        </p>
        
        <div class="error-actions">
          <a-button type="primary" size="large" @click="goHome">
            返回首页
          </a-button>
          <a-button size="large" @click="goBack">
            返回上页
          </a-button>
        </div>
        
        <div class="error-suggestions">
          <h3>您可以尝试：</h3>
          <ul>
            <li>确认当前登录的账号角色</li>
            <li>返回首页重新导航</li>
            <li>联系管理员获取相应权限</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="less">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5222d 0%, #fa541c 100%);
  padding: 20px;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 60px;
  background: white;
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
}

.error-illustration {
  flex-shrink: 0;
  
  img {
    width: 400px;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
  }
}

.error-info {
  flex: 1;
  
  .error-code {
    font-size: 72px;
    font-weight: bold;
    color: #f5222d;
    margin: 0 0 16px 0;
    line-height: 1;
  }
  
  .error-title {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }
  
  .error-description {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 32px;
  }
  
  .error-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }
  
  .error-suggestions {
    h3 {
      font-size: 16px;
      color: #333;
      margin-bottom: 12px;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        position: relative;
        padding-left: 20px;
        margin-bottom: 8px;
        color: #666;
        
        &::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #f5222d;
          font-weight: bold;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .error-content {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
    gap: 40px;
  }
  
  .error-illustration {
    img {
      width: 300px;
      height: 225px;
    }
  }
  
  .error-info {
    .error-code {
      font-size: 48px;
    }
    
    .error-title {
      font-size: 24px;
    }
    
    .error-actions {
      flex-direction: column;
      align-items: center;
      
      .ant-btn {
        width: 200px;
      }
    }
  }
}
</style>
