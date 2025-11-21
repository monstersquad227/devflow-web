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
import {getImageData, updateTask} from "@/http/setting";

const emit = defineEmits(["success"]);
const visible = ref(false);
const props = defineProps({
    task: Object,
});
const formState = ref({
    id: '',
    name: '',
    image_id: ''
});
const imageOptions = ref([]);
const handleOk = async () => {
    try {
        await updateTask(formState.value.id, formState.value)
        emit("success")
        visible.value = false;
    } catch (error) {
        console.log(error);
    }
};

watchEffect(() => {
    if (visible.value === true) {
        getImageData(1, 100)
                .then((res) => {
                    const { data } = res;
                    imageOptions.value = data.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                })
    }
    if (props.task) {
        formState.value.id = props.task.id;
        formState.value.name = props.task.name;
        formState.value.image_id = props.task.image_id;
    }
});

defineExpose({
    visible,
});
</script>

<style scoped>

</style>