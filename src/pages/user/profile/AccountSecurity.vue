<template>
  <div class="account-security-page">
    <a-card title="账号安全">
      <a-list item-layout="horizontal" :data-source="securityItems">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta :title="item.title" :description="item.description">
              <template #avatar>
                <a-avatar :style="{ backgroundColor: item.color }">
                  <template #icon><component :is="item.icon" /></template>
                </a-avatar>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" @click="togglePanel(item.key)">
                {{ expandedKey === item.key ? '收起' : item.actionText }}
              </a-button>
            </template>
          </a-list-item>

          <!-- 修改密码表单 -->
          <div v-if="item.key === 'password' && expandedKey === 'password'" class="expand-panel">
            <a-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" layout="vertical" style="max-width: 400px;">
              <a-form-item label="当前密码" name="oldPassword">
                <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入当前密码" />
              </a-form-item>
              <a-form-item label="新密码" name="newPassword">
                <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
              </a-form-item>
              <a-form-item label="确认新密码" name="confirmPassword">
                <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" :loading="submitting" @click="handleChangePassword">确认修改</a-button>
                  <a-button @click="expandedKey = ''">取消</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </div>

          <!-- 绑定手机号表单 -->
          <div v-if="item.key === 'phone' && expandedKey === 'phone'" class="expand-panel">
            <a-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef" layout="vertical" style="max-width: 400px;">
              <a-form-item label="手机号" name="phone">
                <a-input v-model:value="phoneForm.phone" placeholder="请输入手机号" />
              </a-form-item>
              <a-form-item label="验证码" name="code">
                <a-input v-model:value="phoneForm.code" placeholder="请输入验证码">
                  <template #addonAfter>
                    <a-button type="link" size="small" :disabled="phoneCooldown > 0" @click="sendPhoneCode">
                      {{ phoneCooldown > 0 ? `${phoneCooldown}s` : '获取验证码' }}
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" :loading="submitting" @click="handleBindPhone">确认绑定</a-button>
                  <a-button @click="expandedKey = ''">取消</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </div>

          <!-- 绑定邮箱表单 -->
          <div v-if="item.key === 'email' && expandedKey === 'email'" class="expand-panel">
            <a-form :model="emailForm" :rules="emailRules" ref="emailFormRef" layout="vertical" style="max-width: 400px;">
              <a-form-item label="邮箱地址" name="email">
                <a-input v-model:value="emailForm.email" placeholder="请输入邮箱地址" />
              </a-form-item>
              <a-form-item label="验证码" name="code">
                <a-input v-model:value="emailForm.code" placeholder="请输入验证码">
                  <template #addonAfter>
                    <a-button type="link" size="small" :disabled="emailCooldown > 0" @click="sendEmailCode">
                      {{ emailCooldown > 0 ? `${emailCooldown}s` : '获取验证码' }}
                    </a-button>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" :loading="submitting" @click="handleBindEmail">确认绑定</a-button>
                  <a-button @click="expandedKey = ''">取消</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </div>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { LockOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const expandedKey = ref('')
const submitting = ref(false)
const phoneCooldown = ref(0)
const emailCooldown = ref(0)
const passwordFormRef = ref(null)
const phoneFormRef = ref(null)
const emailFormRef = ref(null)

const securityItems = [
  { key: 'password', title: '登录密码', description: '定期更换密码有助于保护账号安全', icon: LockOutlined, color: '#1890ff', actionText: '修改密码' },
  { key: 'phone', title: '绑定手机', description: '已绑定手机可用于登录和找回密码', icon: MobileOutlined, color: '#52c41a', actionText: '绑定手机' },
  { key: 'email', title: '绑定邮箱', description: '绑定邮箱可接收重要通知和找回密码', icon: MailOutlined, color: '#faad14', actionText: '绑定邮箱' },
]

const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const phoneForm = reactive({ phone: '', code: '' })
const emailForm = reactive({ email: '', code: '' })

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码' }],
  newPassword: [{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少6位' }],
  confirmPassword: [
    { required: true, message: '请确认新密码' },
    { validator: (_, value) => value === passwordForm.newPassword ? Promise.resolve() : Promise.reject('两次密码不一致') },
  ],
}
const phoneRules = {
  phone: [{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }],
  code: [{ required: true, message: '请输入验证码' }],
}
const emailRules = {
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
  code: [{ required: true, message: '请输入验证码' }],
}

const togglePanel = (key) => {
  expandedKey.value = expandedKey.value === key ? '' : key
}

const startCooldown = (type) => {
  const ref = type === 'phone' ? phoneCooldown : emailCooldown
  ref.value = 60
  const timer = setInterval(() => {
    ref.value--
    if (ref.value <= 0) clearInterval(timer)
  }, 1000)
}

const sendPhoneCode = () => {
  if (!phoneForm.phone) { message.warning('请先输入手机号'); return }
  startCooldown('phone')
  message.success('验证码已发送')
}

const sendEmailCode = () => {
  if (!emailForm.email) { message.warning('请先输入邮箱'); return }
  startCooldown('email')
  message.success('验证码已发送')
}

const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    submitting.value = true
    await userStore.changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })
    expandedKey.value = ''
    Object.assign(passwordForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
  } catch { /* validation or api error */ } finally { submitting.value = false }
}

const handleBindPhone = async () => {
  try {
    await phoneFormRef.value.validate()
    submitting.value = true
    await userStore.bindPhone({ phone: phoneForm.phone, code: phoneForm.code })
    expandedKey.value = ''
    Object.assign(phoneForm, { phone: '', code: '' })
  } catch { /* validation or api error */ } finally { submitting.value = false }
}

const handleBindEmail = async () => {
  try {
    await emailFormRef.value.validate()
    submitting.value = true
    await userStore.bindEmail({ email: emailForm.email, code: emailForm.code })
    expandedKey.value = ''
    Object.assign(emailForm, { email: '', code: '' })
  } catch { /* validation or api error */ } finally { submitting.value = false }
}
</script>

<style scoped lang="less">
.account-security-page {
  .expand-panel {
    padding: 16px 0 16px 56px;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>
