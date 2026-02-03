<template>
  <div class="provider-dashboard">
    <!-- 概览卡片 -->
    <a-row :gutter="[24, 24]" class="overview-cards">
      <a-col :span="6" v-for="card in overviewCards" :key="card.key">
        <a-card>
          <a-statistic
            :title="card.title"
            :value="card.value"
            :precision="card.precision"
            :suffix="card.suffix"
            :prefix="card.prefix"
            :value-style="{ color: card.color }"
          >
            <template #prefix>
              <component :is="card.icon" />
            </template>
          </a-statistic>
          <div class="card-trend">
            <span :class="['trend', card.trend > 0 ? 'up' : 'down']">
              <component :is="card.trend > 0 ? 'ArrowUpOutlined' : 'ArrowDownOutlined'" />
              {{ Math.abs(card.trend) }}%
            </span>
            <span class="trend-text">较上月</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[24, 24]" class="charts-section">
      <!-- 收入趋势图 -->
      <a-col :span="16">
        <a-card title="收入趋势" :bordered="false">
          <template #extra>
            <a-radio-group v-model:value="incomeTimeRange" @change="updateIncomeChart">
              <a-radio-button value="7d">近7天</a-radio-button>
              <a-radio-button value="30d">近30天</a-radio-button>
              <a-radio-button value="90d">近90天</a-radio-button>
            </a-radio-group>
          </template>
          <div ref="incomeChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <!-- 订单状态分布 -->
      <a-col :span="8">
        <a-card title="订单状态分布" :bordered="false">
          <div ref="orderStatusChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[24, 24]">
      <!-- 服务分类收入 -->
      <a-col :span="12">
        <a-card title="服务分类收入" :bordered="false">
          <div ref="serviceCategoryChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <!-- 客户地域分布 -->
      <a-col :span="12">
        <a-card title="客户地域分布" :bordered="false">
          <div ref="customerLocationChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 最近订单 -->
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card title="最近订单" :bordered="false">
          <template #extra>
            <a-button type="link" @click="$router.push('/provider/orders')">查看全部</a-button>
          </template>
          
          <a-table
            :columns="orderColumns"
            :data-source="recentOrders"
            :pagination="false"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'service'">
                <div class="service-info">
                  <img :src="record.service.coverImage" :alt="record.service.title" class="service-cover" />
                  <div>
                    <div class="service-title">{{ record.service.title }}</div>
                    <div class="service-category">{{ record.service.category }}</div>
                  </div>
                </div>
              </template>
              
              <template v-else-if="column.key === 'customer'">
                <div class="customer-info">
                  <a-avatar :src="record.customer.avatar" :size="32" />
                  <span class="customer-name">{{ record.customer.name }}</span>
                </div>
              </template>
              
              <template v-else-if="column.key === 'amount'">
                <span class="amount">¥{{ record.amount.toLocaleString() }}</span>
              </template>
              
              <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </template>
              
              <template v-else-if="column.key === 'createdAt'">
                {{ formatDate(record.createdAt) }}
              </template>
              
              <template v-else-if="column.key === 'action'">
                <a-button type="link" size="small" @click="viewOrder(record.id)">查看</a-button>
                <a-button type="link" size="small" @click="processOrder(record.id)">处理</a-button>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  StarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 图表引用
const incomeChartRef = ref(null)
const orderStatusChartRef = ref(null)
const serviceCategoryChartRef = ref(null)
const customerLocationChartRef = ref(null)

// 图表实例
let incomeChart = null
let orderStatusChart = null
let serviceCategoryChart = null
let customerLocationChart = null

// 响应式数据
const incomeTimeRange = ref('30d')

// 概览卡片数据
const overviewCards = ref([
  {
    key: 'totalIncome',
    title: '总收入',
    value: 125680,
    precision: 2,
    prefix: '¥',
    color: '#3f8600',
    icon: DollarOutlined,
    trend: 12.5
  },
  {
    key: 'totalOrders',
    title: '总订单',
    value: 1234,
    color: '#1890ff',
    icon: ShoppingCartOutlined,
    trend: 8.2
  },
  {
    key: 'totalCustomers',
    title: '客户数量',
    value: 567,
    color: '#722ed1',
    icon: UserOutlined,
    trend: -2.1
  },
  {
    key: 'avgRating',
    title: '平均评分',
    value: 4.8,
    precision: 1,
    color: '#fa8c16',
    icon: StarOutlined,
    trend: 3.2
  }
])

// 订单表格列定义
const orderColumns = [
  {
    title: '服务',
    key: 'service',
    width: 250
  },
  {
    title: '客户',
    key: 'customer',
    width: 150
  },
  {
    title: '金额',
    key: 'amount',
    width: 100
  },
  {
    title: '状态',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 150
  },
  {
    title: '操作',
    key: 'action',
    width: 120
  }
]

// 最近订单数据
const recentOrders = ref([
  {
    id: 'ORD001',
    service: {
      title: '企业官网开发',
      category: '网站开发',
      coverImage: 'https://via.placeholder.com/60x40/1890ff/ffffff?text=Web'
    },
    customer: {
      name: '张三',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    amount: 8999,
    status: 'in_progress',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD002',
    service: {
      title: '移动应用UI设计',
      category: 'UI设计',
      coverImage: 'https://via.placeholder.com/60x40/52c41a/ffffff?text=UI'
    },
    customer: {
      name: '李四',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    amount: 4999,
    status: 'pending',
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 'ORD003',
    service: {
      title: '数据分析报告',
      category: '数据分析',
      coverImage: 'https://via.placeholder.com/60x40/722ed1/ffffff?text=Data'
    },
    customer: {
      name: '王五',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
    },
    amount: 6999,
    status: 'completed',
    createdAt: '2024-01-13T09:15:00Z'
  }
])

// 方法
const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'default'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('MM-DD HH:mm')
}

const viewOrder = (orderId) => {
  router.push(`/provider/orders/${orderId}`)
}

const processOrder = (orderId) => {
  // 处理订单逻辑
  console.log('处理订单:', orderId)
}

// 初始化收入趋势图
const initIncomeChart = () => {
  if (!incomeChartRef.value) return
  
  incomeChart = echarts.init(incomeChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['收入', '订单数']
    },
    xAxis: {
      type: 'category',
      data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
    },
    yAxis: [
      {
        type: 'value',
        name: '收入(元)',
        position: 'left'
      },
      {
        type: 'value',
        name: '订单数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '收入',
        type: 'line',
        data: [1200, 1800, 2100, 1600, 2400, 2800, 3200],
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '订单数',
        type: 'bar',
        yAxisIndex: 1,
        data: [3, 5, 6, 4, 7, 8, 9],
        itemStyle: {
          color: '#52c41a'
        }
      }
    ]
  }
  
  incomeChart.setOption(option)
}

// 初始化订单状态分布图
const initOrderStatusChart = () => {
  if (!orderStatusChartRef.value) return
  
  orderStatusChart = echarts.init(orderStatusChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 45, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: 25, name: '进行中', itemStyle: { color: '#1890ff' } },
          { value: 20, name: '待处理', itemStyle: { color: '#fa8c16' } },
          { value: 10, name: '已取消', itemStyle: { color: '#ff4d4f' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  orderStatusChart.setOption(option)
}

// 初始化服务分类收入图
const initServiceCategoryChart = () => {
  if (!serviceCategoryChartRef.value) return
  
  serviceCategoryChart = echarts.init(serviceCategoryChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['网站开发', 'UI设计', '移动应用', '数据分析', '系统集成']
    },
    yAxis: {
      type: 'value',
      name: '收入(元)'
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 35000, itemStyle: { color: '#1890ff' } },
          { value: 28000, itemStyle: { color: '#52c41a' } },
          { value: 22000, itemStyle: { color: '#722ed1' } },
          { value: 18000, itemStyle: { color: '#fa8c16' } },
          { value: 15000, itemStyle: { color: '#eb2f96' } }
        ],
        barWidth: '60%'
      }
    ]
  }
  
  serviceCategoryChart.setOption(option)
}

// 初始化客户地域分布图
const initCustomerLocationChart = () => {
  if (!customerLocationChartRef.value) return
  
  customerLocationChart = echarts.init(customerLocationChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 35, name: '北京', itemStyle: { color: '#1890ff' } },
          { value: 25, name: '上海', itemStyle: { color: '#52c41a' } },
          { value: 20, name: '深圳', itemStyle: { color: '#722ed1' } },
          { value: 12, name: '杭州', itemStyle: { color: '#fa8c16' } },
          { value: 8, name: '其他', itemStyle: { color: '#eb2f96' } }
        ]
      }
    ]
  }
  
  customerLocationChart.setOption(option)
}

// 更新收入图表
const updateIncomeChart = () => {
  // 根据时间范围更新数据
  console.log('更新收入图表:', incomeTimeRange.value)
}

// 窗口大小变化时重新调整图表
const handleResize = () => {
  incomeChart?.resize()
  orderStatusChart?.resize()
  serviceCategoryChart?.resize()
  customerLocationChart?.resize()
}

onMounted(async () => {
  await nextTick()
  
  // 初始化所有图表
  initIncomeChart()
  initOrderStatusChart()
  initServiceCategoryChart()
  initCustomerLocationChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.provider-dashboard {
  .overview-cards {
    margin-bottom: 24px;
    
    .ant-card {
      text-align: center;
      
      .card-trend {
        margin-top: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        
        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
          
          &.up {
            color: #52c41a;
          }
          
          &.down {
            color: #ff4d4f;
          }
        }
        
        .trend-text {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  
  .charts-section {
    margin-bottom: 24px;
  }
  
  .service-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .service-cover {
      width: 60px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .service-title {
      font-weight: 500;
      color: #333;
    }
    
    .service-category {
      font-size: 12px;
      color: #999;
    }
  }
  
  .customer-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .customer-name {
      font-weight: 500;
    }
  }
  
  .amount {
    font-weight: 600;
    color: #52c41a;
  }
}
</style>