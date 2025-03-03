<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="logo" />
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item key="1">
                    <UserOutlined />
                    <span>nav 1</span>
                </a-menu-item>
                <a-menu-item key="2">
                    <VideoCameraOutlined />
                    <span>nav 2</span>
                </a-menu-item>
                <a-menu-item key="3">
                    <UploadOutlined />
                    <span>nav 3</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <!-- 左侧收缩小图标 -->
                <MenuUnfoldOutlined
                    v-if="collapsed"
                    class="trigger"
                    @click="() => (collapsed = !collapsed)"
                />
                <MenuFoldOutlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

                <!-- 右侧下拉框 -->
<!--                <Dropdown />-->
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

import { ref } from 'vue';
const selectedKeys = ref(['1']);
const collapsed = ref(false);

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

.site-layout .site-layout-background {
    height: 100%;
    background: #fff;
}
</style>

