<template>
    <Layout>
            <div class="container">
                <!-- 头部个人信息卡片 -->
                <a-card class="profile-header" :bordered="false">
                    <div class="profile-info">
                        <a-avatar :size="100" :src="userInfo.avatar">
                            <template #icon><UserOutlined /></template>
                        </a-avatar>
                        <div class="info-content">
                            <h2>{{ userInfo.name }}</h2>
                            <p class="role">{{ userInfo.role }}</p>
                            <p class="email">
                                <MailOutlined /> {{ userInfo.email }}
                            </p>
                            <a-button type="primary" @click="showEditModal">
                                <EditOutlined /> 编辑资料
                            </a-button>
                        </div>
                    </div>
                </a-card>

                <!-- 统计信息 -->
                <a-row :gutter="16" class="stats-row">
                    <a-col :span="6">
                        <a-card class="stat-card">
                            <a-statistic
                                    title="项目数量"
                                    :value="stats.projects"
                                    :prefix="h(ProjectOutlined)"
                            />
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card class="stat-card">
                            <a-statistic
                                    title="待办任务"
                                    :value="stats.tasks"
                                    :prefix="h(FileTextOutlined)"
                            />
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card class="stat-card">
                            <a-statistic
                                    title="完成率"
                                    :value="stats.completion"
                                    suffix="%"
                                    :prefix="h(CheckCircleOutlined)"
                            />
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card class="stat-card">
                            <a-statistic
                                    title="工作时长"
                                    :value="stats.hours"
                                    suffix="小时"
                                    :prefix="h(ClockCircleOutlined)"
                            />
                        </a-card>
                    </a-col>
                </a-row>

                <!-- 主要内容区域 -->
                <a-row :gutter="16" class="content-row">
                    <!-- 左侧：最近活动 -->
                    <a-col :span="12">
                        <a-card title="最近活动" :bordered="false">
                            <a-timeline>
                                <a-timeline-item
                                        v-for="activity in activities"
                                        :key="activity.id"
                                        :color="activity.color"
                                >
                                    <p class="activity-time">{{ activity.time }}</p>
                                    <p class="activity-desc">{{ activity.description }}</p>
                                </a-timeline-item>
                            </a-timeline>
                        </a-card>
                    </a-col>

                    <!-- 右侧：账户设置 -->
                    <a-col :span="12">
                        <a-card title="账户设置" :bordered="false">
                            <a-list :data-source="settings">
                                <template #renderItem="{ item }">
                                    <a-list-item>
                                        <a-list-item-meta :description="item.description">
                                            <template #title>
                                                <component :is="item.icon" style="margin-right: 8px" />
                                                {{ item.title }}
                                            </template>
                                        </a-list-item-meta>
                                        <template #actions>
                                            <a-switch
                                                    v-if="item.type === 'switch'"
                                                    v-model:checked="item.value"
                                            />
                                            <a-button
                                                    v-else
                                                    type="link"
                                                    @click="handleSetting(item.key)"
                                            >
                                                设置
                                            </a-button>
                                        </template>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-card>
                    </a-col>
                </a-row>
            </div>

            <!-- 编辑资料弹窗 -->
            <a-modal
                    v-model:open="editModalVisible"
                    title="编辑个人资料"
                    @ok="handleEditSubmit"
                    @cancel="handleEditCancel"
            >
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
import {BellOutlined, LockOutlined, SafetyOutlined, SettingOutlined} from "@ant-design/icons-vue";

// 用户信息
const userInfo = reactive({
    name: '张三',
    role: '前端开发工程师',
    email: 'zhangsan@example.com',
    avatar: ''
});

// 统计数据
const stats = reactive({
    projects: 12,
    tasks: 8,
    completion: 85,
    hours: 156
});

// 最近活动
const activities = ref([
    {
        id: 1,
        time: '2025-10-20 14:30',
        description: '完成了项目 "Devflow Platform" 的需求评审',
        color: 'green'
    },
    {
        id: 2,
        time: '2025-10-20 11:20',
        description: '更新了用户管理模块的代码',
        color: 'blue'
    },
    {
        id: 3,
        time: '2025-10-19 16:45',
        description: '参与了技术分享会议',
        color: 'gray'
    },
    {
        id: 4,
        time: '2025-10-19 10:00',
        description: '创建了新的功能分支',
        color: 'blue'
    }
]);

// 账户设置
const settings = reactive([
    {
        key: 'notification',
        title: '消息通知',
        description: '接收系统消息和任务提醒',
        icon: BellOutlined,
        type: 'switch',
        value: true
    },
    {
        key: 'password',
        title: '修改密码',
        description: '定期更新密码以保护账户安全',
        icon: LockOutlined,
        type: 'button'
    },
    {
        key: 'security',
        title: '安全设置',
        description: '两步验证、登录设备管理',
        icon: SafetyOutlined,
        type: 'button'
    },
    {
        key: 'privacy',
        title: '隐私设置',
        description: '控制个人信息的可见范围',
        icon: SettingOutlined,
        type: 'button'
    }
]);

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

const handleSetting = (key) => {
    message.info(`正在打开 ${key} 设置...`);
};
</script>

<style scoped>
.my-profile {
    padding: 24px;
    background: #f0f2f5;
    min-height: calc(100vh - 64px);
}

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

.info-content .role {
    color: #666;
    margin: 0 0 8px 0;
    font-size: 16px;
}

.info-content .email {
    color: #999;
    margin: 0 0 16px 0;
}

/* 统计卡片 */
.stats-row {
    margin-bottom: 24px;
}

.stat-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

/* 内容区域 */
.content-row {
    margin-bottom: 24px;
}

.content-row .ant-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 400px;
}

/* 活动时间线 */
.activity-time {
    color: #999;
    font-size: 12px;
    margin: 0 0 4px 0;
}

.activity-desc {
    margin: 0;
    color: #333;
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