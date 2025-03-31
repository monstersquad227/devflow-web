<template>
    <Layout>
        <div class="dashboard">
            <div class="container">
                <img src="@/assets/dashboard.png"  alt="dashboard"/>
                <p>欢迎进入 Devflow Platform 管理系统</p>
                <span>请点击左侧菜单开始工作吧~</span>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
</script>

<style>
.dashboard {
    .container {
        overflow: auto;
        padding-top: 14%;
        text-align: center;
        background-color: #fff;
        height: calc(100vh - 134px);

        img {
            width: 386px;
            height: 283px;
        }

        p {
            color: #343434;
            font-size: 18px;
            font-weight: 500;
            margin: 26px 0 10px;
        }

        span {
            font-size: 14px;
            color: #676767;
        }
    }
}
</style>
