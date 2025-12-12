<template>
    <a-config-provider :locale="zhCN">
        <a-modal
            v-model:open="visible"
            title="添加用户"
            @ok="handleOk"
        >
            <a-form ref="formRef" :model="formState" layout="vertical">
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
                            <a-input v-model:value="formState.name" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="账号" name="account" :rules="[{ required: true, message: '请输入账号' }]">
                            <a-input v-model:value="formState.account" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱' }]">
                            <a-input v-model:value="formState.email" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="手机号" name="mobile" :rules="[{ required: true, message: '请输入手机号' }]">
                            <a-input v-model:value="formState.mobile" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input-password v-model:value="formState.password" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>
<script setup>
// Import
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";

// Variable
const visible = ref(false);
const formRef = ref();
const formState = ref({
    name: '',
    account: '',
    email: '',
    mobile: '',
    password: '',
});

// Function
const handleOk = async () => {
    formRef.value.validate().then( async () => {
        const data = {
            name: formState.value.name,
            account: formState.value.account,
            email: formState.value.email,
            mobile: formState.value.mobile,
            password: formState.value.password,
        };
        console.log(data);
        visible.value = false;
    });
};

watchEffect(() => {
    if (visible.value === true) {
        formState.value.name = '';
        formState.value.account = '';
        formState.value.email = '';
        formState.value.mobile = '';
        formState.value.password = '';
    }
})

// Export
defineExpose({
    visible,
})
</script>