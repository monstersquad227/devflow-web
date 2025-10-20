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
                        <a-button type="primary" @click="showEditModal">
                            <EditOutlined /> 编辑资料
                        </a-button>
                    </div>
                </div>
            </a-card>
        </div>

        <!-- 编辑资料弹窗 -->
        <a-modal v-model:open="editModalVisible" title="编辑个人资料" @ok="handleEditSubmit" @cancel="handleEditCancel">
            <a-form :model="editForm" layout="vertical">
                <a-form-item label="姓名">
                    <a-input v-model:value="editForm.name" />
                </a-form-item>
                <a-form-item label="职位">
                    <a-input v-model:value="editForm.role" />
                </a-form-item>
                <a-form-item label="邮箱">
                    <a-input v-model:value="editForm.email" />
                </a-form-item>
                <a-form-item label="个人简介">
                    <a-textarea v-model:value="editForm.bio" :rows="4" />
                </a-form-item>
            </a-form>
        </a-modal>
    </Layout>
</template>

<script setup>
import { ref, reactive, h } from 'vue';
import { message } from 'ant-design-vue';
import Layout from "@/components/Layout.vue";
import store from "@/store";

const userInfo = store.getters.userInfo;



// 编辑弹窗
const editModalVisible = ref(false);
const editForm = reactive({
    name: '',
    role: '',
    email: '',
    bio: ''
});

const showEditModal = () => {
    editForm.name = userInfo.name;
    editForm.role = userInfo.role;
    editForm.email = userInfo.email;
    editModalVisible.value = true;
};

const handleEditSubmit = () => {
    userInfo.name = editForm.name;
    userInfo.role = editForm.role;
    userInfo.email = editForm.email;
    message.success('资料更新成功！');
    editModalVisible.value = false;
};

const handleEditCancel = () => {
    editModalVisible.value = false;
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

.content-row .ant-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 400px;
}

/* 响应式 */
@media (max-width: 768px) {
    .profile-info {
        flex-direction: column;
        text-align: center;
    }

    .content-row .ant-col {
        margin-bottom: 16px;
    }
}
</style>