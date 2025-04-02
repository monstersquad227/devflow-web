<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加任务" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="任务">
                    <a-input v-model:value="formState.name" placeholder="请输入任务"/>
                </a-form-item>
                <a-form-item label="镜像">
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

const visible = ref(false);
const formState = ref({
    name: '',
    image_id: null
});
const imageOptions = ref([]);
const handleOk = () => {
    postSaveTask(formState.value);
    console.log(formState.value);
    visible.value = false;
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