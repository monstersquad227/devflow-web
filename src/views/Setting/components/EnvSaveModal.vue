<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
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
import {ref} from "vue";
import {postSaveEnv} from "@/http/setting";

const visible = ref(false);
const formState = ref({
    name: ''
});
const handleOk = () => {
    postSaveEnv(formState.value)
    visible.value = false;
};

defineExpose({
    visible,
});
</script>

<style scoped>

</style>