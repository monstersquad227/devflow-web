<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加机器" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-item label="实例ID">
                    <a-input v-model:value="formState.instance_id" placeholder="请输入项目ID" />
                </a-form-item>
                <a-form-item label="实例名称">
                    <a-input v-model:value="formState.instance_name" placeholder="请输入实例名称" />
                </a-form-item>
                <a-form-item label="实例密码">
                    <a-input v-model:value="formState.password" placeholder="请输入实例密码" />
                </a-form-item>
                <a-form-item label="内网IP">
                    <a-input v-model:value="formState.private_ip" placeholder="请输入内网IP" />
                </a-form-item>
                <a-form-item label="公网IP">
                    <a-input v-model:value="formState.public_ip" placeholder="请输入公网IP" />
                </a-form-item>
                <a-form-item label="配置">
                    <a-select v-model:value="formState.spec" placeholder="请选择配置" :options="specOptions" />
                </a-form-item>
                <a-form-item label="所属项目">
                    <a-input v-model:value="formState.application" placeholder="请输入所属项目" />
                </a-form-item>
                <a-form-item label="地区">
                    <a-select v-model:value="formState.region" placeholder="请输入实例所在地区" :options="regionOptions" />
                </a-form-item>
                <a-form-item label="平台">
                    <a-select v-model:value="formState.cloud_provider" placeholder="请输入机器所属平台" :options="cloudProviderOptions" />
                </a-form-item>
                <a-form-item label="系统">
                    <a-select v-model:value="formState.os" placeholder="请输入机器系统" :options="osOptions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import { ref, watchEffect } from "vue";
import { Base64 } from "js-base64";
import { postSaveVmData } from "@/http/vm";

const visible = ref(false);
const formState = ref({
    instance_id: '',
    instance_name: '',
    password: '',
    private_ip: '',
    public_ip: '',
    spec: '',
    application: '',
    region: '',
    cloud_provider: '',
    os: ''
});
const specOptions = ref([
    { label: '1C2G', value: 'small' },
    { label: '2C4G', value: 'medium' },
    { label: '4C8G', value: 'large' },
    { label: '8C16G', value: 'xlarge' },
    { label: '16C32G', value: '2xlarge' },
    { label: '32C64G', value: 'ultra' },
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
    { label: '腾讯云', value: 'tencent' },
    { label: 'AWS云', value: 'aws' },
    { label: '本地云', value: 'local' },
]);
const osOptions = ref([
    { label: 'Centos', value: 'centos' },
    { label: 'Ubuntu', value: 'ubuntu' },
    { label: 'Debian', value: 'debian' }
]);
const handleOk = () => {
    formState.value.password = Base64.encode(formState.value.password);
    postSaveVmData(formState.value)
    visible.value = false;
};

watchEffect(() => {
    if (visible.value === true) {
        formState.value = {
            instance_id: '',
            instance_name: '',
            password: '',
            private_ip: '',
            public_ip: '',
            spec: '',
            application: '',
            region: '',
            cloud_provider: '',
            os: ''
        }
    }
});

defineExpose({
    visible,
});
</script>
