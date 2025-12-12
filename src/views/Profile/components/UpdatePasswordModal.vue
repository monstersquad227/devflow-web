<template>
    <a-config-provider :locale="zhCN">
        <a-modal
                v-model:open="visible"
                title="修改密码"
                @ok="handleOk"
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

</template>

<script setup>
// Import
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref} from "vue";
import * as base64 from "js-base64";
import store from "@/store";
import {ChangePassword} from "@/http/base";
import {message} from "ant-design-vue";
import router from "@/router";

// Variable
const visible = ref(false);
const formRef = ref();
const formState = ref({
    password: '',
    new_password: '',
    confirm_new_password: '',
});
const userInfo = store.getters.userInfo;

// Function
const handleOk = async () => {
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
        visible.value = false;
        await store.dispatch('clearUserInfo');
        await router.push('/login');
    })
};
const validateConfirmPassword = async (_rule, value) => {
    if (value !== formState.value.new_password) {
        return Promise.reject('两次输入的新密码不一致');
    }
    return Promise.resolve();
};

// Export
defineExpose({
    visible,
});
</script>