<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <a-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="/logo.svg" alt="IT服务平台" />
          <span>IT服务平台</span>
        </div>
        
        <a-menu mode="horizontal" class="nav-menu">
          <a-menu-item key="home">首页</a-menu-item>
          <a-menu-item key="services">服务市场</a-menu-item>
          <a-menu-item key="forum">技术论坛</a-menu-item>
          <a-menu-item key="news">资讯中心</a-menu-item>
        </a-menu>
        
        <div class="auth-buttons">
          <a-button type="primary" @click="$router.push('/login')">登录</a-button>
          <a-button @click="$router.push('/register')">注册</a-button>
        </div>
      </div>
    </a-layout-header>

    <!-- 轮播图 -->
    <section class="hero-section">
      <a-carousel autoplay>
        <div v-for="(banner, index) in banners" :key="index" class="carousel-item">
          <div class="banner-content">
            <h1>{{ banner.title }}</h1>
            <p>{{ banner.description }}</p>
            <a-button type="primary" size="large">{{ banner.buttonText }}</a-button>
          </div>
          <img :src="banner.image" :alt="banner.title" />
        </div>
      </a-carousel>
    </section>

    <!-- 平台统计 -->
    <section class="stats-section">
      <div class="container">
        <a-row :gutter="32">
          <a-col :span="6" v-for="stat in stats" :key="stat.key">
            <div class="stat-card">
              <div class="stat-icon">
                <component :is="stat.icon" />
              </div>
              <div class="stat-content">
                <h3>{{ stat.value }}</h3>
                <p>{{ stat.label }}</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- 热门服务 -->
    <section class="services-section">
      <div class="container">
        <div class="section-header">
          <h2>热门服务</h2>
          <a-button type="link" @click="$router.push('/user/services')">查看更多</a-button>
        </div>
        
        <a-row :gutter="[24, 24]">
          <a-col :span="6" v-for="service in hotServices" :key="service.id">
            <a-card hoverable class="service-card">
              <template #cover>
                <img :src="service.coverImage" :alt="service.title" />
              </template>
              <a-card-meta :title="service.title" :description="service.description" />
              <div class="service-footer">
                <div class="price">¥{{ service.price }}</div>
                <div class="rating">
                  <a-rate :value="service.rating" disabled allow-half />
                  <span>({{ service.reviews }})</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- 最新资讯 -->
    <section class="news-section">
      <div class="container">
        <div class="section-header">
          <h2>最新资讯</h2>
          <a-button type="link" @click="$router.push('/user/news')">查看更多</a-button>
        </div>
        
        <a-row :gutter="[24, 24]">
          <a-col :span="8" v-for="article in latestNews" :key="article.id">
            <a-card hoverable class="news-card">
              <template #cover>
                <img :src="article.coverImage" :alt="article.title" />
              </template>
              <a-card-meta :title="article.title" :description="article.summary" />
              <div class="news-footer">
                <a-avatar :src="article.author.avatar" size="small" />
                <span class="author">{{ article.author.name }}</span>
                <span class="date">{{ formatDate(article.createdAt) }}</span>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- 底部 -->
    <a-layout-footer class="footer">
      <div class="container">
        <a-row :gutter="48">
          <a-col :span="6">
            <h4>关于我们</h4>
            <ul>
              <li><a href="#">公司介绍</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">加入我们</a></li>
            </ul>
          </a-col>
          <a-col :span="6">
            <h4>服务支持</h4>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">服务条款</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </a-col>
          <a-col :span="6">
            <h4>商务合作</h4>
            <ul>
              <li><a href="#">成为服务商</a></li>
              <li><a href="#">企业服务</a></li>
              <li><a href="#">API接口</a></li>
            </ul>
          </a-col>
          <a-col :span="6">
            <h4>关注我们</h4>
            <div class="social-links">
              <a-button type="text" shape="circle" size="large">
                <template #icon><WechatOutlined /></template>
              </a-button>
              <a-button type="text" shape="circle" size="large">
                <template #icon><WeiboOutlined /></template>
              </a-button>
              <a-button type="text" shape="circle" size="large">
                <template #icon><QqOutlined /></template>
              </a-button>
            </div>
          </a-col>
        </a-row>
        
        <a-divider />
        
        <div class="copyright">
          <p>&copy; 2024 IT服务平台. All rights reserved.</p>
        </div>
      </div>
    </a-layout-footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  TrophyOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined
} from '@ant-design/icons-vue'

// 轮播图数据
const banners = ref([
  {
    title: '专业IT服务，一站式解决方案',
    description: '连接优质服务商与企业需求，让技术服务更简单',
    buttonText: '立即体验',
    image: 'https://via.placeholder.com/800x400/1890ff/ffffff?text=IT+Services'
  },
  {
    title: '悬赏模式，精准匹配需求',
    description: '发布技术需求，获得专业解决方案',
    buttonText: '发布需求',
    image: 'https://via.placeholder.com/800x400/52c41a/ffffff?text=Bounty+System'
  },
  {
    title: '技术论坛，知识分享社区',
    description: '与技术专家交流，获取最新技术资讯',
    buttonText: '加入社区',
    image: 'https://via.placeholder.com/800x400/722ed1/ffffff?text=Tech+Forum'
  }
])

// 平台统计数据
const stats = ref([
  {
    key: 'users',
    label: '注册用户',
    value: '50,000+',
    icon: UserOutlined
  },
  {
    key: 'services',
    label: '服务项目',
    value: '10,000+',
    icon: ShoppingOutlined
  },
  {
    key: 'articles',
    label: '技术文章',
    value: '25,000+',
    icon: FileTextOutlined
  },
  {
    key: 'bounties',
    label: '悬赏项目',
    value: '5,000+',
    icon: TrophyOutlined
  }
])

// 热门服务数据
const hotServices = ref([
  {
    id: 1,
    title: '网站开发服务',
    description: '专业的网站开发，响应式设计，SEO优化',
    price: 2999,
    rating: 4.8,
    reviews: 128,
    coverImage: 'https://via.placeholder.com/300x200/1890ff/ffffff?text=Web+Dev'
  },
  {
    id: 2,
    title: '移动应用开发',
    description: 'iOS/Android原生开发，跨平台解决方案',
    price: 8999,
    rating: 4.9,
    reviews: 89,
    coverImage: 'https://via.placeholder.com/300x200/52c41a/ffffff?text=Mobile+App'
  },
  {
    id: 3,
    title: '数据分析服务',
    description: '大数据分析，商业智能，可视化报表',
    price: 4999,
    rating: 4.7,
    reviews: 156,
    coverImage: 'https://via.placeholder.com/300x200/722ed1/ffffff?text=Data+Analysis'
  },
  {
    id: 4,
    title: 'UI/UX设计',
    description: '用户界面设计，用户体验优化，原型设计',
    price: 1999,
    rating: 4.6,
    reviews: 203,
    coverImage: 'https://via.placeholder.com/300x200/fa8c16/ffffff?text=UI+Design'
  }
])

// 最新资讯数据
const latestNews = ref([
  {
    id: 1,
    title: 'Vue 3.4 正式发布，带来更多性能优化',
    summary: 'Vue 3.4 版本发布，包含了许多性能改进和新特性，开发体验进一步提升...',
    coverImage: 'https://via.placeholder.com/400x250/4fc08d/ffffff?text=Vue+3.4',
    author: {
      name: '技术小编',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: '2024年前端开发趋势预测',
    summary: '分析2024年前端技术发展趋势，包括框架选择、工具链演进等...',
    coverImage: 'https://via.placeholder.com/400x250/1890ff/ffffff?text=Frontend+2024',
    author: {
      name: '前端专家',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    title: '微服务架构最佳实践分享',
    summary: '从单体应用到微服务的演进过程，以及在实际项目中的应用经验...',
    coverImage: 'https://via.placeholder.com/400x250/52c41a/ffffff?text=Microservices',
    author: {
      name: '架构师',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    createdAt: '2024-01-13T09:15:00Z'
  }
])

// 格式化日期
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}
</script>

<style scoped lang="less">
.home-page {
  .header {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 0;
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      
      span {
        font-size: 18px;
        font-weight: bold;
        color: #1890ff;
      }
    }
    
    .nav-menu {
      flex: 1;
      border-bottom: none;
      margin-left: 40px;
    }
    
    .auth-buttons {
      display: flex;
      gap: 12px;
    }
  }
  
  .hero-section {
    .carousel-item {
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      .banner-content {
        flex: 1;
        max-width: 500px;
        
        h1 {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 16px;
          color: white;
        }
        
        p {
          font-size: 18px;
          margin-bottom: 32px;
          color: rgba(255, 255, 255, 0.9);
        }
      }
      
      img {
        width: 400px;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
      }
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .stats-section {
    padding: 80px 0;
    background: #f5f5f5;
    
    .stat-card {
      display: flex;
      align-items: center;
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .stat-icon {
        font-size: 48px;
        color: #1890ff;
        margin-right: 16px;
      }
      
      .stat-content {
        h3 {
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 4px 0;
          color: #333;
        }
        
        p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
      }
    }
  }
  
  .services-section,
  .news-section {
    padding: 80px 0;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      
      h2 {
        font-size: 32px;
        font-weight: bold;
        margin: 0;
        color: #333;
      }
    }
    
    .service-card,
    .news-card {
      height: 100%;
      
      :deep(.ant-card-cover) img {
        height: 200px;
        object-fit: cover;
      }
      
      :deep(.ant-card-body) {
        display: flex;
        flex-direction: column;
        height: calc(100% - 200px);
      }
      
      :deep(.ant-card-meta) {
        flex: 1;
      }
    }
    
    .service-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      
      .price {
        font-size: 18px;
        font-weight: bold;
        color: #f5222d;
      }
      
      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        
        span {
          font-size: 12px;
          color: #666;
        }
      }
    }
    
    .news-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      
      .author {
        font-size: 14px;
        color: #333;
      }
      
      .date {
        font-size: 12px;
        color: #999;
        margin-left: auto;
      }
    }
  }
  
  .news-section {
    background: #f5f5f5;
  }
  
  .footer {
    background: #001529;
    color: rgba(255, 255, 255, 0.85);
    padding: 48px 0 24px;
    
    h4 {
      color: white;
      font-size: 16px;
      margin-bottom: 16px;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 8px;
        
        a {
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          
          &:hover {
            color: white;
          }
        }
      }
    }
    
    .social-links {
      display: flex;
      gap: 8px;
      
      .ant-btn {
        color: rgba(255, 255, 255, 0.65);
        
        &:hover {
          color: white;
        }
      }
    }
    
    .copyright {
      text-align: center;
      color: rgba(255, 255, 255, 0.45);
      
      p {
        margin: 0;
      }
    }
  }
}
</style>