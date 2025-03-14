<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="logo" @click="handleLogo"/>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" @click="handleClick">
                <a-menu-item key="/project">
                    <UserOutlined />
                    <span>项目</span>
                </a-menu-item>
                <a-menu-item key="/setting">
                    <VideoCameraOutlined />
                    <span>设置</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                    <MenuUnfoldOutlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)"/>
                    <MenuFoldOutlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                    <div :style="{ display: 'inline-block', float: 'right', margin: '0 30px 0 0' }">
                        <img class="avatar" src="@/assets/avatar.png" alt="avatar" />
                        <a-dropdown>
                            <a class="ant-dropdown-link" @click.prevent>
                                {{ accountName }}
                                <DownOutlined />
                            </a>
                            <template #overlay>
                                <a-menu>
<!--                                    <a-menu-item>1st menu item</a-menu-item>-->
<!--                                    <a-menu-divider />-->
                                    <a-menu-item @click="logout()">退出登录</a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
            </a-layout-header>

            <!-- 正文主区域 -->
            <a-layout-content
                :style="{ margin: '24px 16px', padding: '24px', background: '#fff', overflow: 'scroll' }"
            >
                <slot></slot>
            </a-layout-content>

        </a-layout>
    </a-layout>
</template>

<script setup>

import {computed, ref, watchEffect} from 'vue';
import router from "@/router";
import store from "../store";
const selectedKeys = ref(['']);
const collapsed = ref(false);

const userInfo = computed(() => store.getters.userInfo);
const accountName = userInfo.value.user.name

watchEffect(() => {
    selectedKeys.value = [router.currentRoute.value.path];
});
function handleClick(info) {
    router.push(info.key);
}
function handleLogo() {
    router.push('/');
}
function logout() {
    store.dispatch('clearUserInfo')
    router.push('/login')
}

</script>

<style>
html, body, #app, #components-layout-demo-custom-trigger {
    height: 100%;
    margin: 0;
}
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
}
.avatar {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 10px;
}

.site-layout .site-layout-background {
    height: 100%;
    background: #fff;
}
</style>

