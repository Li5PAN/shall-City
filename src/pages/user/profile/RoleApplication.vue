<template>
  <div class="role-application-page">
    <!-- 未申请状态 -->
    <template v-if="!applicationStatus || applicationStatus === 'none'">
      <a-card title="成为服务提供方">
        <a-alert type="info" show-icon style="margin-bottom: 24px;">
          <template #message>服务提供方权益</template>
          <template #description>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>发布服务商品，获取订单收入</li>
              <li>响应用户悬赏需求，赚取悬赏金</li>
              <li>专属服务商数据看板</li>
              <li>优先展示在服务推荐列表</li>
            </ul>
          </template>
        </a-alert>

        <a-form :model="applyForm" :rules="applyRules" ref="applyFormRef" layout="vertical">
          <a-form-item label="服务领域" name="serviceAreas">
            <a-select v-model:value="applyForm.serviceAreas" mode="multiple" placeholder="请选择服务领域" :options="serviceAreaOptions" />
          </a-form-item>
          <a-form-item label="个人简介" name="introduction">
            <a-textarea v-model:value="applyForm.introduction" placeholder="请介绍您的专业技能和服务经验" :rows="4" :maxlength="500" show-count />
          </a-form-item>
          <a-form-item label="资质证明" name="certificates">
            <ImageUpload :max-count="3" :max-size="10" @change="handleCertChange" />
            <div class="upload-tip">支持上传资质证书、作品截图等，最多3张</div>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" :loading="submitting" @click="handleApply">提交申请</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </template>

    <!-- 审核中 -->
    <template v-else-if="applicationStatus === 'pending'">
      <a-card title="角色申请">
        <AuditResultPanel status="pending" :audit-time="roleApplication?.createdAt" />
        <div class="audit-info">
          <a-descriptions bordered :column="1" size="small">
            <a-descriptions-item label="申请时间">{{ formatTime(roleApplication?.createdAt) }}</a-descriptions-item>
            <a-descriptions-item label="预计审核时间">1-3个工作日</a-descriptions-item>
          </a-descriptions>
        </div>
      </a-card>
    </template>

    <!-- 已通过 -->
    <template v-else-if="applicationStatus === 'approved'">
      <a-card title="角色申请">
        <AuditResultPanel status="approved" :audit-time="roleApplication?.auditTime" />
        <div style="text-align: center; margin-top: 16px;">
          <a-button type="primary" @click="goToProvider">前往服务商面板</a-button>
        </div>
      </a-card>
    </template>

    <!-- 已驳回 -->
    <template v-else-if="applicationStatus === 'rejected'">
      <a-card title="角色申请">
        <AuditResultPanel
          status="rejected"
          :reason="roleApplication?.reason"
          :audit-time="roleApplication?.auditTime"
          :allow-resubmit="true"
          @resubmit="handleResubmit"
        />
      </a-card>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import ImageUpload from '@/components/common/ImageUpload.vue'
import AuditResultPanel from '@/components/business/AuditResultPanel.vue'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const applyFormRef = ref(null)

const roleApplication = computed(() => userStore.roleApplication)
const applicationStatus = computed(() => roleApplication.value?.status || 'none')

const serviceAreaOptions = [
  { label: 'Web开发', value: 'web' },
  { label: '移动端开发', value: 'mobile' },
  { label: 'UI/UX设计', value: 'design' },
  { label: '数据分析', value: 'data' },
  { label: '运维部署', value: 'devops' },
  { label: '人工智能', value: 'ai' },
  { label: '网络安全', value: 'security' },
  { label: '项目管理', value: 'pm' },
]

const applyForm = reactive({ serviceAreas: [], introduction: '', certificates: [] })

const applyRules = {
  serviceAreas: [{ required: true, message: '请选择服务领域', type: 'array' }],
  introduction: [{ required: true, message: '请填写个人简介' }, { min: 20, message: '个人简介至少20字' }],
}

const handleCertChange = (fileList) => {
  applyForm.certificates = fileList
}

const handleApply = async () => {
  try {
    await applyFormRef.value.validate()
    submitting.value = true
    await userStore.applyRole(applyForm)
  } catch { /* validation or api error */ } finally { submitting.value = false }
}

const handleResubmit = () => {
  userStore.roleApplication = { ...userStore.roleApplication, status: 'none' }
}

const goToProvider = () => {
  router.push('/provider/dashboard')
}

const formatTime = (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'

onMounted(() => {
  // Load existing application status if available
  if (!roleApplication.value) {
    userStore.fetchProfile()
  }
})
</script>

<style scoped lang="less">
.role-application-page {
  .upload-tip {
    color: #999;
    font-size: 12px;
    margin-top: 4px;
  }
  .audit-info {
    max-width: 400px;
    margin: 16px auto 0;
  }
}
</style>
