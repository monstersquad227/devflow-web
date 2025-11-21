<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form ref="formRef" :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="环境名" name="name" :rules="[{ required: true, message: '请输入环境名' }]">
                    <a-input v-model:value="formState.name" placeholder="请输入环境名"/>
                </a-form-item>
                <a-form-item label="备注" name="remark" :rules="[{ required: true, message: '请输入备注' }]">
                    <a-input v-model:value="formState.remark" placeholder="请输入备注"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref} from "vue";
import {postSaveEnv} from "@/http/setting";

const emit = defineEmits(["success"]);
const visible = ref(false);
const formRef = ref();
const formState = ref({
    name: '',
    remark: ''
});
const handleOk = async () => {
    try {
        await formRef.value.validateFields();
        await postSaveEnv(formState.value);
        emit("success");
        visible.value = false;
    } catch (error) {
        console.log(error);
    }
};

defineExpose({
    visible,
});
</script>

<style scoped>

</style>