<template>
    <Layout>
        <div class="container">
            <div class="left-container">
                <a-card class="card" :bordered="false">
                    <div class="left-card-content">
                        <a-avatar :size="150">
                            <template #icon><UserOutlined /></template>
                        </a-avatar>
                        <div class="left-card-content-item">
                            <h2>{{ userInfo.user.name }}</h2>
                            <p class="email">
                                <MailOutlined /> {{ userInfo.user.email }}
                            </p>
                            <p class="phone">
                                <PhoneOutlined /> {{ userInfo.user.mobile }}
                            </p>
                            <p class="time">
                                <FieldTimeOutlined /> {{ userInfo.user.updated_at }}
                            </p>
                            <div class="btn-group">
                                <a-button type="primary" @click="showUpdatePasswordModal">
                                    <EditOutlined /> 修改密码
                                </a-button>
                                <a-button v-permission="'user:add'" type="primary" @click="showSaveModal">
                                    <PlusCircleOutlined /> 添加用户
                                </a-button>
                                <a-button type="primary" @click="showUpdateModal">
                                    <EditOutlined /> 修改信息
                                </a-button>
                            </div>
                        </div>
                    </div>
                </a-card>
            </div>

            <div class="right-container">
                <a-card class="card" :bordered="false">
                    <h2>统计</h2>
                    <div class="right-card-content">
                        <div class="grid-item">
                            <BuildOutlined class="icon" style="color: #1677ff"/>
                            <div>
                                <div>230</div>
                                <div>构建次数</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <CheckCircleOutlined class="icon" style="color: #52c41a;" />
                            <div>
                                <div>200</div>
                                <div>成功</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <CloseCircleOutlined class="icon" style="color: #f5222d;" />
                            <div>
                                <div>30</div>
                                <div>失败</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <RiseOutlined class="icon" style="color: #faad14;" />
                            <div>
                                <div>20%</div>
                                <div>成功率</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <RocketOutlined class="icon" style="color: #1677ff;" />
                            <div>
                                <div>230</div>
                                <div>发布次数</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <CheckCircleOutlined class="icon" style="color: #52c41a;" />
                            <div>
                                <div>200</div>
                                <div>成功</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <CloseCircleOutlined class="icon" style="color: #f5222d;" />
                            <div>
                                <div>30</div>
                                <div>失败</div>
                            </div>
                        </div>

                        <div class="grid-item">
                            <RiseOutlined class="icon" style="color: #faad14;" />
                            <div>
                                <div>20%</div>
                                <div>成功率</div>
                            </div>
                        </div>
                    </div>
                </a-card>
            </div>
        </div>

        <a-table :data-source="dataSource" :columns="columns">
        </a-table>

        <UpdatePasswordModal ref="updatePasswordModal" />
        <SaveModal ref="saveModal" />
        <UpdateModal ref="updateModal" />
    </Layout>
</template>

<script setup>
// Import
import { ref } from 'vue';
import Layout from "@/components/Layout.vue";
import store from "@/store";
import UpdatePasswordModal from "@/views/Profile/components/UpdatePasswordModal.vue";
import SaveModal from "@/views/Profile/components/SaveModal.vue";
import UpdateModal from "@/views/Profile/components/UpdateModal.vue"

// Variable
const userInfo = store.getters.userInfo;
const columns = ref([])
const dataSource = ref([]);
const updatePasswordModal = ref(false);
const saveModal = ref(false);
const updateModal = ref(false);

// Function
const showUpdatePasswordModal = () => {
    updatePasswordModal.value.visible = true;
};
const showSaveModal = () => {
    saveModal.value.visible = true;
};
const showUpdateModal = () => {
    updateModal.value.visible = true;
};

</script>

<style scoped>
.container {
    width: 100%;
    height: 300px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
}
.left-container {
    width: 100%;
}
.right-container {
    width: 100%;
}

.card {
    min-height: 280px;
    min-width: 600px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px
    rgba(0, 0, 0, 0.1);
}

.left-card-content  {
    display: flex;
    align-items: center;
    gap: 24px;
}

.left-card-content-item {
    margin: 0 0 16px 0;
    font-size: 16px;
}

.left-card-content-item h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
}

.left-card-content-item .email {
    color: #999;
    display: flex;
    gap: 14px;
}

.left-card-content-item .phone {
    color: #999;
    display: flex;
    gap: 14px;
}

.left-card-content-item .time {
    color: #999;
    display: flex;
    gap: 14px;
}

.left-card-content-item .btn-group {
    display: flex;
    gap: 16px;
}

.right-card-content {
    margin-top: 42px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
}

.right-card-content .grid-item {
    display: flex;
    gap: 32px;
    font-weight: 400;
    font-size: 14px;
    background-color: #fafafa;
    border-radius: 8px;
}

.right-card-content .icon {
    font-size: 24px;
}

</style>