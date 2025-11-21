<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加镜像" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form ref="formRef" :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="镜像名" name="name" :rules="[{ required: true, message: '请输入镜像名' }]">
                    <a-input v-model:value="formState.name" placeholder="请输入镜像名"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import { ref } from "vue";
import { postSaveImage } from "@/http/setting";

const emit = defineEmits(["success"]);
const formRef = ref();
const visible = ref(false);
const formState = ref({
    name: '',
});
const handleOk = async () => {
    try {
        await formRef.value.validateFields();
        await postSaveImage(formState.value);
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