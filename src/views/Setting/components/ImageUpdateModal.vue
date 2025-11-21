<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="更新镜像" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="环境名">
                    <a-input v-model:value="formState.name" placeholder="请输入镜像名"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";
import {updateImage} from "@/http/setting";

const emit = defineEmits(["success"]);
const visible = ref(false);
const props = defineProps({
    image: Object
});
const formState = ref({
    id: null,
    name: ''
});
const handleOk = async () => {
    try {
        await updateImage(formState.value.id, formState.value);
        emit("success");
        visible.value = false;
    } catch (error) {
        console.log(error);
    }
};

watchEffect(() => {
    if (props.image && visible.value === true) {
        formState.value.id = props.image.id;
        formState.value.name = props.image.name;
    }
});

defineExpose({
    visible,
});
</script>

<style scoped>

</style>