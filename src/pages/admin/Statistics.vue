<template>
  <div class="admin-statistics">
    <!-- 时间范围选择 -->
    <div class="time-range-selector">
      <a-space>
        <span>时间范围：</span>
        <a-range-picker
          v-model:value="dateRange"
          :presets="datePresets"
          @change="handleDateRangeChange"
        />
        <a-button type="primary" @click="refreshData">刷新数据</a-button>
      </a-space>
    </div>

    <!-- 核心指标卡片 -->
    <a-row :gutter="[24, 24]" class="metrics-cards">
      <a-col :span="6" v-for="metric in coreMetrics" :key="metric.key">
        <a-card>
          <a-statistic
            :title="metric.title"
            :value="metric.value"
            :precision="metric.precision"
            :suffix="metric.suffix"
            :prefix="metric.prefix"
            :value-style="{ color: metric.color }"
          >
            <template #prefix>
              <component :is="metric.icon" />
            </template>
          </a-statistic>
          <div class="metric-trend">
            <span :class="['trend', metric.trend > 0 ? 'up' : 'down']">
              <component :is="metric.trend > 0 ? 'ArrowUpOutlined' : 'ArrowDownOutlined'" />
              {{ Math.abs(metric.trend) }}%
            </span>
            <span class="trend-text">较上期</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[24, 24]" class="charts-section">
      <!-- 用户增长趋势 -->
      <a-col :span="12">
        <a-card title="用户增长趋势" :bordered="false">
          <template #extra>
            <a-radio-group v-model:value="userGrowthType" @change="updateUserGrowthChart">
              <a-radio-button value="daily">日增长</a-radio-button>
              <a-radio-button value="monthly">月增长</a-radio-button>
            </a-radio-group>
          </template>
          <div ref="userGrowthChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <!-- 交易金额趋势 -->
      <a-col :span="12">
        <a-card title="交易金额趋势" :bordered="false">
          <div ref="transactionChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[24, 24]">
      <!-- 用户类型分布 -->
      <a-col :span="8">
        <a-card title="用户类型分布" :bordered="false">
          <div ref="userTypeChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <!-- 服务分类统计 -->
      <a-col :span="8">
        <a-card title="服务分类统计" :bordered="false">
          <div ref="serviceCategoryChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <!-- 地域分布 -->
      <a-col :span="8">
        <a-card title="用户地域分布" :bordered="false">
          <div ref="locationChartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 平台活跃度热力图 -->
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card title="平台活跃度热力图" :bordered="false">
          <template #extra>
            <a-space>
              <span>显示类型：</span>
              <a-select v-model:value="heatmapType" style="width: 120px" @change="updateHeatmapChart">
                <a-select-option value="user">用户活跃</a-select-option>
                <a-select-option value="order">订单活跃</a-select-option>
                <a-select-option value="revenue">收入活跃</a-select-option>
              </a-select>
            </a-space>
          </template>
          <div ref="heatmapChartRef" style="height: 200px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 实时数据表格 -->
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card title="实时数据监控" :bordered="false">
          <template #extra>
            <a-space>
              <a-switch v-model:checked="autoRefresh" @change="toggleAutoRefresh" />
              <span>自动刷新</span>
              <a-button type="link" @click="exportData">导出数据</a-button>
            </a-space>
          </template>
          
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="users" tab="用户数据">
              <a-table
                :columns="userColumns"
                :data-source="userData"
                :pagination="{ pageSize: 10 }"
                size="middle"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                      {{ record.status === 'active' ? '活跃' : '非活跃' }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'lastLogin'">
                    {{ formatDateTime(record.lastLogin) }}
                  </template>
                  <template v-else-if="column.key === 'createdAt'">
                    {{ formatDate(record.createdAt) }}
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            
            <a-tab-pane key="orders" tab="订单数据">
              <a-table
                :columns="orderColumns"
                :data-source="orderData"
                :pagination="{ pageSize: 10 }"
                size="middle"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'amount'">
                    <span class="amount">¥{{ record.amount.toLocaleString() }}</span>
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag :color="getOrderStatusColor(record.status)">
                      {{ getOrderStatusText(record.status) }}
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'createdAt'">
                    {{ formatDateTime(record.createdAt) }}
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            
            <a-tab-pane key="revenue" tab="收入数据">
              <a-table
                :columns="revenueColumns"
                :data-source="revenueData"
                :pagination="{ pageSize: 10 }"
                size="middle"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'amount'">
                    <span class="amount">¥{{ record.amount.toLocaleString() }}</span>
                  </template>
                  <template v-else-if="column.key === 'date'">
                    {{ formatDate(record.date) }}
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue'

// 图表引用
const userGrowthChartRef = ref(null)
const transactionChartRef = ref(null)
const userTypeChartRef = ref(null)
const serviceCategoryChartRef = ref(null)
const locationChartRef = ref(null)
const heatmapChartRef = ref(null)

// 图表实例
let userGrowthChart = null
let transactionChart = null
let userTypeChart = null
let serviceCategoryChart = null
let locationChart = null
let heatmapChart = null

// 响应式数据
const dateRange = ref([dayjs().subtract(30, 'day'), dayjs()])
const userGrowthType = ref('daily')
const heatmapType = ref('user')
const autoRefresh = ref(false)
const activeTab = ref('users')

// 自动刷新定时器
let refreshTimer = null

// 日期预设
const datePresets = [
  { label: '最近7天', value: [dayjs().subtract(7, 'day'), dayjs()] },
  { label: '最近30天', value: [dayjs().subtract(30, 'day'), dayjs()] },
  { label: '最近90天', value: [dayjs().subtract(90, 'day'), dayjs()] },
  { label: '本月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
  { label: '上月', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] }
]

// 核心指标数据
const coreMetrics = ref([
  {
    key: 'totalUsers',
    title: '总用户数',
    value: 125680,
    color: '#1890ff',
    icon: UserOutlined,
    trend: 12.5
  },
  {
    key: 'totalOrders',
    title: '总订单数',
    value: 45678,
    color: '#52c41a',
    icon: ShoppingCartOutlined,
    trend: 8.2
  },
  {
    key: 'totalRevenue',
    title: '总收入',
    value: 8956780,
    precision: 2,
    prefix: '¥',
    color: '#fa8c16',
    icon: DollarOutlined,
    trend: 15.3
  },
  {
    key: 'totalArticles',
    title: '总文章数',
    value: 23456,
    color: '#722ed1',
    icon: FileTextOutlined,
    trend: -2.1
  }
])

// 表格列定义
const userColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '用户类型', dataIndex: 'role', key: 'role' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin' },
  { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' }
]

const orderColumns = [
  { title: '订单ID', dataIndex: 'id', key: 'id', width: 120 },
  { title: '服务名称', dataIndex: 'serviceName', key: 'serviceName' },
  { title: '客户', dataIndex: 'customerName', key: 'customerName' },
  { title: '金额', dataIndex: 'amount', key: 'amount' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' }
]

const revenueColumns = [
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '订单收入', dataIndex: 'orderRevenue', key: 'orderRevenue' },
  { title: '服务费收入', dataIndex: 'serviceRevenue', key: 'serviceRevenue' },
  { title: '总收入', dataIndex: 'amount', key: 'amount' },
  { title: '订单数量', dataIndex: 'orderCount', key: 'orderCount' }
]

// 模拟数据
const userData = ref([
  {
    id: 1001,
    username: '张三',
    email: 'zhangsan@example.com',
    role: '普通用户',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 1002,
    username: '李四',
    email: 'lisi@example.com',
    role: '服务商',
    status: 'active',
    lastLogin: '2024-01-14T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z'
  }
])

const orderData = ref([
  {
    id: 'ORD001',
    serviceName: '网站开发',
    customerName: '张三',
    amount: 8999,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD002',
    serviceName: 'UI设计',
    customerName: '李四',
    amount: 4999,
    status: 'in_progress',
    createdAt: '2024-01-14T14:20:00Z'
  }
])

const revenueData = ref([
  {
    date: '2024-01-15',
    orderRevenue: 45000,
    serviceRevenue: 4500,
    amount: 49500,
    orderCount: 12
  },
  {
    date: '2024-01-14',
    orderRevenue: 38000,
    serviceRevenue: 3800,
    amount: 41800,
    orderCount: 10
  }
])

// 方法
const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
    refreshData()
  }
}

const refreshData = () => {
  message.success('数据已刷新')
  // 这里应该调用API刷新数据
}

const toggleAutoRefresh = (checked) => {
  if (checked) {
    refreshTimer = setInterval(() => {
      refreshData()
    }, 30000) // 30秒刷新一次
  } else {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }
}

const exportData = () => {
  message.success('数据导出功能开发中...')
}

const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    in_progress: 'blue',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'default'
}

const getOrderStatusText = (status) => {
  const texts = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')
}

// 初始化用户增长图表
const initUserGrowthChart = () => {
  if (!userGrowthChartRef.value) return
  
  userGrowthChart = echarts.init(userGrowthChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '累计用户']
    },
    xAxis: {
      type: 'category',
      data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
    },
    yAxis: [
      {
        type: 'value',
        name: '新增用户',
        position: 'left'
      },
      {
        type: 'value',
        name: '累计用户',
        position: 'right'
      }
    ],
    series: [
      {
        name: '新增用户',
        type: 'bar',
        data: [120, 180, 210, 160, 240, 280, 320],
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '累计用户',
        type: 'line',
        yAxisIndex: 1,
        data: [1200, 1380, 1590, 1750, 1990, 2270, 2590],
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        }
      }
    ]
  }
  
  userGrowthChart.setOption(option)
}

// 初始化交易金额图表
const initTransactionChart = () => {
  if (!transactionChartRef.value) return
  
  transactionChart = echarts.init(transactionChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['交易金额', '平台收入']
    },
    xAxis: {
      type: 'category',
      data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
    },
    yAxis: {
      type: 'value',
      name: '金额(元)'
    },
    series: [
      {
        name: '交易金额',
        type: 'line',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000],
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        },
        areaStyle: {
          color: 'rgba(24, 144, 255, 0.1)'
        }
      },
      {
        name: '平台收入',
        type: 'line',
        data: [4500, 5200, 4800, 6100, 5500, 6700, 7200],
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        }
      }
    ]
  }
  
  transactionChart.setOption(option)
}

// 初始化用户类型分布图
const initUserTypeChart = () => {
  if (!userTypeChartRef.value) return
  
  userTypeChart = echarts.init(userTypeChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { value: 65, name: '普通用户', itemStyle: { color: '#1890ff' } },
          { value: 30, name: '服务商', itemStyle: { color: '#52c41a' } },
          { value: 5, name: '管理员', itemStyle: { color: '#fa8c16' } }
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
  
  userTypeChart.setOption(option)
}

// 初始化服务分类统计图
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
      data: ['网站开发', 'UI设计', '移动应用', '数据分析', '系统集成'],
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '服务数量'
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 350, itemStyle: { color: '#1890ff' } },
          { value: 280, itemStyle: { color: '#52c41a' } },
          { value: 220, itemStyle: { color: '#722ed1' } },
          { value: 180, itemStyle: { color: '#fa8c16' } },
          { value: 150, itemStyle: { color: '#eb2f96' } }
        ],
        barWidth: '60%'
      }
    ]
  }
  
  serviceCategoryChart.setOption(option)
}

// 初始化地域分布图
const initLocationChart = () => {
  if (!locationChartRef.value) return
  
  locationChart = echarts.init(locationChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '60%'],
        data: [
          { value: 35, name: '北京', itemStyle: { color: '#1890ff' } },
          { value: 25, name: '上海', itemStyle: { color: '#52c41a' } },
          { value: 20, name: '深圳', itemStyle: { color: '#722ed1' } },
          { value: 12, name: '杭州', itemStyle: { color: '#fa8c16' } },
          { value: 8, name: '其他', itemStyle: { color: '#eb2f96' } }
        ],
        label: {
          show: true,
          formatter: '{b}: {c}%'
        }
      }
    ]
  }
  
  locationChart.setOption(option)
}

// 初始化热力图
const initHeatmapChart = () => {
  if (!heatmapChartRef.value) return
  
  heatmapChart = echarts.init(heatmapChartRef.value)
  
  const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  const data = []
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      data.push([j, i, Math.floor(Math.random() * 100)])
    }
  }
  
  const option = {
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `${days[params.value[1]]} ${hours[params.value[0]]}:00<br/>活跃度: ${params.value[2]}`
      }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#e0f3ff', '#1890ff']
      }
    },
    series: [
      {
        type: 'heatmap',
        data: data,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  heatmapChart.setOption(option)
}

// 更新图表
const updateUserGrowthChart = () => {
  console.log('更新用户增长图表:', userGrowthType.value)
}

const updateHeatmapChart = () => {
  console.log('更新热力图:', heatmapType.value)
}

// 窗口大小变化时重新调整图表
const handleResize = () => {
  userGrowthChart?.resize()
  transactionChart?.resize()
  userTypeChart?.resize()
  serviceCategoryChart?.resize()
  locationChart?.resize()
  heatmapChart?.resize()
}

onMounted(async () => {
  await nextTick()
  
  // 初始化所有图表
  initUserGrowthChart()
  initTransactionChart()
  initUserTypeChart()
  initServiceCategoryChart()
  initLocationChart()
  initHeatmapChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理定时器
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
  
  // 销毁图表实例
  userGrowthChart?.dispose()
  transactionChart?.dispose()
  userTypeChart?.dispose()
  serviceCategoryChart?.dispose()
  locationChart?.dispose()
  heatmapChart?.dispose()
})
</script>

<style scoped lang="less">
.admin-statistics {
  .time-range-selector {
    margin-bottom: 24px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .metrics-cards {
    margin-bottom: 24px;
    
    .ant-card {
      text-align: center;
      
      .metric-trend {
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
  
  .amount {
    font-weight: 600;
    color: #52c41a;
  }
}
</style>