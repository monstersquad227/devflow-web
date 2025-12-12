<template>
    <a-config-provider :locale="zhCN">
        <a-modal
                v-model:open="visible"
                title="修改信息"
                @ok="handleOk"

        >
            <a-form :model="formState" label-position="right" layout="vertical">
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="名称">
                            <a-input v-model:value="formState.name" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="账号">
                            <a-input v-model:value="formState.account" />
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="邮箱" >
                            <a-input v-model:value="formState.email" />
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="手机号">
                            <a-input v-model:value="formState.mobile" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>
<script setup>
// Import
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";
import store from "@/store";

// Variable
const visible = ref(false);
const formState = ref({
    name: "",
    account: "",
    email: "",
    mobile: "",
});
const userInfo = store.getters.userInfo;

// Function
const handleOk = async () => {
    const data = {
        id: userInfo.user.id,
        name: formState.value.name,
        account: formState.value.account,
        email: formState.value.email,
        mobile: formState.value.mobile,
    };
    console.log(data);
    visible.value = false;
};

watchEffect(()=> {
    if (visible.value === true) {
        formState.value.name = userInfo.user.name;
        formState.value.account = userInfo.user.account;
        formState.value.email = userInfo.user.email;
        formState.value.mobile = userInfo.user.mobile;
    }
});

// Export
defineExpose({
    visible,
});
</script>