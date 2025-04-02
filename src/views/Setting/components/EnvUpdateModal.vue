<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="更新环境" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="环境名">
                    <a-input v-model:value="formState.name" placeholder="请输入环境名"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import { ref, watchEffect } from "vue";
import { updateEnv } from "@/http/setting";

const visible = ref(false);
const props = defineProps({
    env: Object,
});
const formState = ref({
    id: null,
    name: ''
});
const handleOk = () => {
    updateEnv(formState.value.id, formState.value)
    visible.value = false;
};

watchEffect(() => {
    if (props.env) {
        formState.value.id = props.env.id;
        formState.value.name = props.env.name;
    }
});

defineExpose({
    visible,
});
</script>

<style scoped>

</style>