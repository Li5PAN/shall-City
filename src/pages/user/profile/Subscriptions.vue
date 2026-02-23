<template>
  <div class="subscriptions-page">
    <a-card title="我的订阅">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <!-- 订阅的服务分类 -->
        <a-tab-pane key="categories" tab="订阅的服务分类">
          <a-spin :spinning="loading">
            <div v-if="subscriptions.categories.length > 0" class="category-list">
              <a-tag
                v-for="cat in subscriptions.categories"
                :key="cat.id"
                closable
                color="blue"
                class="category-tag"
                @close="handleUnsubscribeCategory(cat)"
              >
                {{ cat.name }}
              </a-tag>
            </div>
            <EmptyState v-else description="暂未订阅任何服务分类" />
          </a-spin>
        </a-tab-pane>

        <!-- 关注的服务提供方 -->
        <a-tab-pane key="providers" tab="关注的服务提供方">
          <a-spin :spinning="loading">
            <div v-if="subscriptions.providers.length > 0">
              <a-list item-layout="horizontal" :data-source="subscriptions.providers">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :description="item.description || '暂无简介'">
                      <template #title>
                        <a @click="viewProvider(item)">{{ item.nickname }}</a>
                      </template>
                      <template #avatar>
                        <UserAvatar :user="item" :show-name="false" size="large" />
                      </template>
                    </a-list-item-meta>
                    <template #actions>
                      <a-button type="link" danger @click="handleUnsubscribeProvider(item)">取消关注</a-button>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
              <PaginationWrapper
                :total="providerTotal"
                :current="currentPage"
                :page-size="pageSize"
                @change="handlePageChange"
              />
            </div>
            <EmptyState v-else description="暂未关注任何服务提供方" />
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import UserAvatar from '@/components/business/UserAvatar.vue'
import PaginationWrapper from '@/components/common/PaginationWrapper.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const userStore = useUserStore()

const loading = ref(false)
const activeTab = ref('categories')
const currentPage = ref(1)
const pageSize = ref(10)
const providerTotal = ref(0)

const subscriptions = computed(() => userStore.subscriptions || { categories: [], providers: [] })

const handleTabChange = () => {
  currentPage.value = 1
}

const handleUnsubscribeCategory = (cat) => {
  userStore.subscriptions.categories = userStore.subscriptions.categories.filter(c => c.id !== cat.id)
  message.success(`已取消订阅「${cat.name}」`)
}

const handleUnsubscribeProvider = (provider) => {
  userStore.subscriptions.providers = userStore.subscriptions.providers.filter(p => p.id !== provider.id)
  message.success(`已取消关注「${provider.nickname}」`)
}

const viewProvider = (provider) => {
  message.info(`查看提供方：${provider.nickname}`)
}

const handlePageChange = (page, size) => {
  currentPage.value = page
  pageSize.value = size
}

const fetchData = async () => {
  loading.value = true
  try {
    await userStore.fetchSubscriptions()
    providerTotal.value = subscriptions.value.providers.length
  } catch { /* handled in store */ } finally { loading.value = false }
}

onMounted(() => { fetchData() })
</script>

<style scoped lang="less">
.subscriptions-page {
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 8px 0;
  }
  .category-tag {
    font-size: 14px;
    padding: 4px 12px;
  }
}
</style>
