<template>
    <a-layout class="layout-container">
        <!-- 侧边栏 -->
        <a-layout-sider
                v-model:collapsed="collapsed"
                :trigger="null"
                collapsible
        >
            <div class="logo" @click="handleLogo" />

            <a-menu
                    v-model:selectedKeys="selectedKeys"
                    theme="dark"
                    mode="inline"
                    @click="handleClick"
            >
                <!-- 根据后端返回的 menus 渲染菜单 -->
                <a-menu-item
                        v-for="{path, permission_code, permission_name} in menus"
                        :key="path"
                >
                    <component :is="getIconComponent(permission_code)" />
                    <span>{{ permission_name }}</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>

        <!-- 右侧布局 -->
        <a-layout>
            <!-- 头部 -->
            <a-layout-header class="layout-header">
                <!-- 左侧折叠按钮 -->
                <MenuUnfoldOutlined
                        v-if="collapsed"
                        class="trigger"
                        @click="() => (collapsed = !collapsed)"
                />
                <MenuFoldOutlined
                        v-else
                        class="trigger"
                        @click="() => (collapsed = !collapsed)"
                />

                <!-- 右侧用户信息 -->
                <div class="user-info">
                    <img class="avatar" src="@/assets/avatar.png" alt="avatar" />

                    <a-dropdown>
                        <a class="ant-dropdown-link" @click.prevent>
                            {{ accountName }}
                            <DownOutlined />
                        </a>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item @click="goToProfile()">
                                    <UserOutlined /> 个人中心
                                </a-menu-item>
                                <a-menu-divider />
                                <a-menu-item @click="logout()">
                                    <LogoutOutlined /> 退出登录
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </a-layout-header>

            <!-- 正文主区域 -->
            <a-layout-content class="layout-content">
                <slot></slot>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store';
import {
    AppstoreOutlined,
    HddOutlined,
    InstagramOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons-vue";

const router = useRouter();
const selectedKeys = ref(['']);
const collapsed = ref(false);

const userInfo = computed(() => store.getters.userInfo);
const menus = computed(() => store.getters.menus)
const accountName = userInfo.value.user.name;

watchEffect(() => {
    selectedKeys.value = [router.currentRoute.value.path];
});

// const menuRoutes = computed(() =>
//         router.options.routes
//                 .filter(route => route.meta?.title)
//                 .filter(route => !route.meta?.hideInMenu)
//                 .filter(route => {
//                     const roles = store.getters.roles;
//                     return !route.meta.roles || roles.some(role => route.meta.roles.includes(role));
//                 })
// );
// 图标映射表
const iconMap = {
    'project': AppstoreOutlined,
    'vm': HddOutlined,
    'user': UserOutlined,
    'role': TeamOutlined,
    'setting': SettingOutlined,
    'flowedge': InstagramOutlined,
};
// 根据权限码获取对应的图标组件
const getIconComponent = (permission_code) => {
    return iconMap[permission_code] || AppstoreOutlined;
};

const handleClick = (info) => {
    router.push(info.key);
};

const handleLogo = () => {
    router.push('/');
};

const goToProfile = () => {
    router.push('/profile');
};

const logout = () => {
    store.dispatch('clearUserInfo');
    router.push('/login');
};
</script>

<style scoped>
/* 基础布局 */
html,
body,
#app,
.layout-container {
    height: 100%;
    margin: 0;
}

.layout-container {
    height: 100vh;
}

/* Logo */
.logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
    cursor: pointer;
}

/* 头部 */
.layout-header {
    background: #fff;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

/* 用户信息区域 */
.user-info {
    display: flex;
    align-items: center;
    margin-right: 30px;
}

.avatar {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    margin-right: 10px;
}

.ant-dropdown-link {
    color: rgba(0, 0, 0, 0.85);
}

/* 主内容区域 */
.layout-content {
    margin: 24px 16px;
    padding: 24px;
    background: #fff;
    overflow: auto;
}
</style>