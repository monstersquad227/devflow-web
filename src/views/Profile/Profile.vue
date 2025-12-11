<template>
    <Layout>
        <div class="container">
            <!-- 头部个人信息卡片 -->
            <a-card class="profile-header" :bordered="false">
                <div class="profile-info">
                    <a-avatar :size="100">
                        <template #icon><UserOutlined /></template>
                    </a-avatar>
                    <div class="info-content">
                        <h2>{{ userInfo.user.name }}</h2>
                        <p class="email">
                            <MailOutlined /> {{ userInfo.user.email }}
                        </p>
                        <p class="phone">
                            <PhoneOutlined /> {{ userInfo.user.mobile }}
                        </p>
                        <a-button type="primary" @click="showPasswordModal">
                            <EditOutlined /> 修改密码
                        </a-button>
                    </div>
                </div>
            </a-card>
        </div>

        <!-- 修改密码弹窗 -->
        <a-config-provider :locale="zhCN">
            <a-modal
                v-model:open="passwordModalVisible"
                title="修改密码"
                @ok="handlePasswordSubmit"
                destroyOnClose
        >
            <a-form ref="formRef" :model="formState" layout="vertical">

                <a-form-item label="原始密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>

                <a-form-item label="新密码" name="new_password" :rules="[{ required: true, message: '请输入新密码,且不少于8位', min: 8 }]">
                    <a-input-password v-model:value="formState.new_password" />
                </a-form-item>

                <a-form-item
                        label="确认密码"
                        name="confirm_new_password"
                        :rules="[
                        { required: true, message: '请确认新密码', min: 8 },
                        { validator: validateConfirmPassword }
                    ]"
                >
                    <a-input-password v-model:value="formState.confirm_new_password" />
                </a-form-item>
            </a-form>
        </a-modal>
        </a-config-provider>
    </Layout>
</template>

<script setup>
import { ref } from 'vue';
import Layout from "@/components/Layout.vue";
import store from "@/store";
import * as base64 from "js-base64";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ChangePassword} from "@/http/base";
import router from "@/router";
import {message} from "ant-design-vue";

const userInfo = store.getters.userInfo;
const passwordModalVisible = ref(false);
const formRef = ref();

const formState = ref({
    password: '',
    new_password: '',
    confirm_new_password: '',
});

// 校验“确认密码”
const validateConfirmPassword = async (_rule, value) => {
    if (value !== formState.value.new_password) {
        return Promise.reject('两次输入的新密码不一致');
    }
    return Promise.resolve();
};

// 打开弹窗
const showPasswordModal = () => {
    formState.value.password = '';
    formState.value.new_password = '';
    formState.value.confirm_new_password = '';
    passwordModalVisible.value = true;
};

// 提交验证
const handlePasswordSubmit = () => {
    formRef.value.validate().then( async () => {
        const data = {
            account: base64.encode(userInfo.user.account),
            password: base64.encode(formState.value.password),
            new_password: base64.encode(formState.value.new_password),
            confirm_new_password: base64.encode(formState.value.confirm_new_password),
        };
        await ChangePassword(data).then(res => {
            message.info(res.message);
        })
        passwordModalVisible.value = false;
        await store.dispatch('clearUserInfo');
        await router.push('/login');
    }).catch(err => {
        console.warn("表单校验失败", err);
    });
};

</script>

<style scoped>
.container {
    margin: 0 auto;
}

/* 个人信息卡片 */
.profile-header {
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
    display: flex;
    gap: 24px;
    align-items: center;
}

.info-content {
    flex: 1;
}

.info-content h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
}

.info-content {
    color: #666;
    margin: 0 0 8px 0;
    font-size: 16px;
}

.info-content .email {
    color: #999;
    margin: 0 0 16px 0;
}

.info-content .phone {
    color: #999;
    margin: 0 0 16px 0;
}


/* 响应式 */
@media (max-width: 768px) {
    .profile-info {
        flex-direction: column;
        text-align: center;
    }
}
</style>