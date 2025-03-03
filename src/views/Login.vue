<template>
    <div class="login-container">
        <div class="login-region">
            <h3>Devflow Platform</h3>

            <a-input v-model:value="account" placeholder="请输入用户名" size="large" :style="{ margin: '0 0 20px 0' }">
                <template #prefix>
                    <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
            </a-input>

            <a-input-password v-model:value="password" placeholder="请输入密码" size="large">
                <template #prefix>
                    <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
            </a-input-password>

            <a-button :loading="loading" type="primary" size="large" :style="{ margin: '20px 0 0 0', width: '100%'}" @click="loginSubmit" @keydown.enter="loginSubmit">Login</a-button>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const account = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const loginSubmit = async () => {
    loading.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        loading.value = false;
        await router.push('/home')
        console.log('登录成功！');
    } catch (error) {
        loading.value = false;
        console.error('登录失败！', error);
    }
};
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/backgroud.jpg');
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-region {
    max-width: 400px;
    padding: 20px;
    background-color: transparent;
}
h3 {
    font-size: 26px;
    color: #eee;
    text-align: center;
    margin: 0 auto 40px auto;
}
</style>

