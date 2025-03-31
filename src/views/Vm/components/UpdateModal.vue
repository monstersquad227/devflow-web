<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="更新机器" :bodyStyle="{ padding: '20px' }" @ok="handleOk" @cancel="handleCancel" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="实例ID">
                    <a-input v-model:value="formState.instance_id" disabled />
                </a-form-item>
                <a-form-item label="实例名称">
                    <a-input v-model:value="formState.instance_name" />
                </a-form-item>
                <a-form-item label="内网IP">
                    <a-input v-model:value="formState.private_ip" />
                </a-form-item>
                <a-form-item label="公网IP">
                    <a-input v-model:value="formState.public_ip" />
                </a-form-item>
                <a-form-item label="配置">
                    <a-select v-model:value="formState.spec" :options="specOptions"/>
                </a-form-item>
                <a-form-item label="所属项目">
                    <a-input v-model:value="formState.application" />
                </a-form-item>
                <a-form-item label="地区">
                    <a-select v-model:value="formState.region" :options="regionOptions"/>
                </a-form-item>
                <a-form-item label="平台">
                    <a-select v-model:value="formState.cloud_provider" :options="cloudProviderOptions"/>
                </a-form-item>
                <a-form-item label="系统">
                    <a-select v-model:value="formState.os" :options="osOptions"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {defineProps, ref, watchEffect} from "vue";

const formState = ref({
    instance_id: '',
    instance_name: '',
    private_ip: '',
    public_ip: '',
    spec: '',
    application: '',
    region: '',
    cloud_provider: '',
    os: ''
})
const visible = ref(false);
const specOptions = ref([
    { label: '1C2G', value: 'small' },
    { label: '2C4G', value: 'medium' },
    { label: '4C8G', value: 'large' },
    { label: '8C16G', value: 'extraLarge' },
]);
const regionOptions = ref([
    { label: '上海', value: 'cn-shanghai' },
    { label: '杭州', value: 'cn-hangzhou' },
    { label: '香港', value: 'cn-hongkong'},
    { label: '新加坡', value: 'ap-southeast-1' },
]);
const cloudProviderOptions = ref([
    { label: '阿里云', value: 'aliyun' },
    { label: '华为云', value: 'huawei' },
    { label: '腾讯', value: 'tencent' },
    { label: 'AWS', value: 'aws' },
    { label: '机房', value: 'local' }
]);
const osOptions = ref([
    { label: 'Centos', value: 'centos' },
    { label: 'Windows', value: 'win' },
    { label: 'Ubuntu', value: 'ubuntu' },
    { label: 'Debian', value: 'debian' }
])
const props = defineProps({
    vm: Object,
});
const handleOk = () => {
    console.log("提交的构建数据：", formState.value);
    visible.value = false;
};
const handleCancel = () => {
    visible.value = false;
};

watchEffect(() => {
    if (props.vm && visible.value === true) {
        formState.value.instance_id = props.vm.instance_id;
        formState.value.instance_name = props.vm.instance_name;
        formState.value.private_ip = props.vm.private_ip;
        formState.value.public_ip = props.vm.public_ip;
        formState.value.spec = props.vm.spec;
        formState.value.region = props.vm.region;
        formState.value.cloud_provider = props.vm.cloud_provider;
        formState.value.os = props.vm.os;
    }
})

defineExpose({
    visible,
});
</script>

<style scoped>

</style>