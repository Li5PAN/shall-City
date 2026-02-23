<template>
  <div class="news-list-page">
    <!-- 搜索筛选栏 - 复用 SearchFilter -->
    <SearchFilter
      :filters="filterConfig"
      :default-values="defaultFilterValues"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 分类标签栏 -->
    <div class="category-tags">
      <a-tag
        v-for="cat in categoryTags"
        :key="cat.value"
        :color="newsStore.filters.category === cat.value ? 'blue' : 'default'"
        class="category-tag"
        @click="handleCategoryClick(cat.value)"
      >
        {{ cat.label }}
      </a-tag>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 文章列表 -->
      <div class="articles-section">
        <a-spin :spinning="newsStore.loading">
          <div v-if="newsStore.newsList.length > 0" class="article-list">
            <ArticleCard
              v-for="article in newsStore.newsList"
              :key="article.id"
              :article="article"
              :show-cover="true"
              @click="goToDetail"
            />
          </div>
          <a-empty v-if="!newsStore.loading && newsStore.newsList.length === 0" description="暂无资讯" />
        </a-spin>

        <!-- 分页 - 复用 PaginationWrapper -->
        <PaginationWrapper
          v-if="newsStore.pagination.total > 0"
          :total="newsStore.pagination.total"
          :current="newsStore.pagination.current"
          :page-size="newsStore.pagination.pageSize"
          @change="handlePageChange"
        />
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <a-card title="热门文章" size="small">
          <div class="hot-articles">
            <div
              v-for="(item, index) in hotArticles"
              :key="item.id"
              class="hot-article-item"
              @click="goToDetail(item.id)"
            >
              <span class="rank-number" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <div class="hot-article-info">
                <h4>{{ item.title }}</h4>
                <span class="views">{{ item.views || 0 }} 阅读</span>
              </div>
            </div>
          </div>
        </a-card>

        <a-card title="热门标签" size="small" style="margin-top: 16px">
          <div class="hot-tags">
            <a-tag
              v-for="tag in hotTags"
              :key="tag.name"
              color="blue"
              class="hot-tag"
              @click="handleTagClick(tag.name)"
            >
              {{ tag.name }} ({{ tag.count }})
            </a-tag>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/news'
import SearchFilter from '@/components/common/SearchFilter.vue'
import ArticleCard from '@/components/business/ArticleCard.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'

const router = useRouter()
const newsStore = useNewsStore()

// SearchFilter 配置
const filterConfig = [
  { type: 'input', field: 'keyword', label: '关键词', placeholder: '搜索资讯标题、内容...' },
  {
    type: 'select',
    field: 'sortBy',
    label: '排序',
    options: [
      { label: '最新发布', value: 'latest' },
      { label: '最受欢迎', value: 'popular' },
      { label: '浏览最多', value: 'views' },
    ],
  },
]

const defaultFilterValues = { keyword: '', sortBy: 'latest' }

// 分类标签
const categoryTags = computed(() => {
  const base = [{ label: '全部', value: '' }]
  const cats = (newsStore.categories || []).map(c => ({
    label: c.name || c.label,
    value: c.id || c.value,
  }))
  return cats.length > 0
    ? base.concat(cats)
    : base.concat([
        { label: '前端开发', value: 'frontend' },
        { label: '后端开发', value: 'backend' },
        { label: '移动开发', value: 'mobile' },
        { label: '人工智能', value: 'ai' },
        { label: '区块链', value: 'blockchain' },
        { label: 'DevOps', value: 'devops' },
      ])
})

// 侧边栏数据
const hotArticles = ref([
  { id: 1, title: 'Vue 3.4 正式发布：性能优化与新特性详解', views: 1250 },
  { id: 2, title: '微服务架构实战：从单体到分布式的演进之路', views: 2100 },
  { id: 3, title: 'React 18 并发特性深度解析', views: 1800 },
  { id: 4, title: 'Docker 容器化部署最佳实践', views: 1650 },
  { id: 5, title: 'Python 数据分析实战：从数据清洗到可视化', views: 2300 },
])

const hotTags = ref([
  { name: 'Vue', count: 156 },
  { name: 'React', count: 134 },
  { name: 'Node.js', count: 98 },
  { name: 'Python', count: 187 },
  { name: 'Docker', count: 76 },
  { name: '微服务', count: 65 },
])

// 事件处理
const handleSearch = (params) => {
  newsStore.filters = { ...newsStore.filters, ...params }
  newsStore.pagination.current = 1
  newsStore.fetchNewsList()
}

const handleReset = () => {
  newsStore.filters = { category: '', keyword: '' }
  newsStore.pagination.current = 1
  newsStore.fetchNewsList()
}

const handleCategoryClick = (value) => {
  newsStore.filters.category = value
  newsStore.pagination.current = 1
  newsStore.fetchNewsList()
}

const handlePageChange = (page, pageSize) => {
  newsStore.pagination.current = page
  newsStore.pagination.pageSize = pageSize
  newsStore.fetchNewsList()
}

const handleTagClick = (tagName) => {
  newsStore.filters.keyword = tagName
  newsStore.pagination.current = 1
  newsStore.fetchNewsList()
}

const goToDetail = (id) => {
  router.push(`/user/news/${id}`)
}

onMounted(() => {
  newsStore.fetchNewsList()
})
</script>

<style scoped lang="less">
.news-list-page {
  .category-tags {
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px;

    .category-tag {
      cursor: pointer;
      margin-bottom: 8px;
      font-size: 13px;
    }
  }

  .main-content {
    display: flex;
    gap: 24px;

    .articles-section {
      flex: 1;
      min-width: 0;
    }

    .sidebar {
      width: 300px;
      flex-shrink: 0;

      .ant-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .hot-articles {
        .hot-article-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;

          &:last-child {
            border-bottom: none;
          }

          &:hover h4 {
            color: #1890ff;
          }

          .rank-number {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            color: #666;
            font-size: 12px;
            font-weight: bold;
            border-radius: 50%;
            flex-shrink: 0;

            &.top {
              background: #ff4d4f;
              color: #fff;
            }
          }

          .hot-article-info {
            flex: 1;

            h4 {
              font-size: 14px;
              margin: 0 0 4px;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              color: #333;
            }

            .views {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }

      .hot-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .hot-tag {
          cursor: pointer;
          margin-bottom: 0;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .news-list-page .main-content {
    flex-direction: column;

    .sidebar {
      width: 100%;
      order: -1;
    }
  }
}
</style>
