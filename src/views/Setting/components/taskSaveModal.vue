<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加任务" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form ref="formRef" :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="任务" name="name" :rules="[{ required: true, message: '请输入任务'}]">
                    <a-input v-model:value="formState.name" placeholder="请输入任务"/>
                </a-form-item>
                <a-form-item label="镜像" name="image_id" :rules="[{ required: true, message: '请选择镜像' }]">
                    <a-select v-model:value="formState.image_id" placeholder="请选择镜像" :options="imageOptions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";
import {getImageData, postSaveTask} from "@/http/setting";

const emit = defineEmits(["success"]);
const formRef = ref();
const visible = ref(false);
const formState = ref({
    name: '',
    image_id: null
});
const imageOptions = ref([]);
const handleOk = async () => {
    try {
        await formRef.value.validateFields();
        await postSaveTask(formState.value);
        emit("success");
        visible.value = false;
    } catch(error) {
        console.log(error);
    }
};

watchEffect(() => {
    if ( visible.value === true ) {
        formState.value = {
            name: '',
            image_id: null
        }
        getImageData(1, 100)
            .then((res) => {
                const { data } = res;
                imageOptions.value = data.map(item => ({
                    label: item.name,
                    value: item.id
                }))
            })
    }
});

defineExpose({
    visible,
});
</script>

<style scoped>

</style>