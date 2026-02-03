<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-illustration">
        <img src="https://via.placeholder.com/400x300/f0f0f0/666666?text=404" alt="404" />
      </div>
      
      <div class="error-info">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被删除。
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
            <li>检查网址是否正确</li>
            <li>返回首页重新导航</li>
            <li>使用搜索功能查找内容</li>
            <li>联系客服获取帮助</li>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    color: #1890ff;
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
          color: #1890ff;
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