<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="添加机器" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" :rules="rules" ref="formRef" layout="horizontal" :labelCol="{ style: { width: '80px' } }" :wrapperCol="{ span: 20 }">
                <a-form-item label="实例ID">
                    <a-input v-model:value="formState.instance_id" placeholder="请输入项目ID" />
                </a-form-item>
                <a-form-item label="实例名称" name="instance_name">
                    <a-input v-model:value="formState.instance_name" placeholder="请输入实例名称" />
                </a-form-item>
                <a-form-item label="实例密码" name="password">
                    <a-input v-model:value="formState.password" placeholder="请输入实例密码" />
                </a-form-item>
                <a-form-item label="内网IP" name="private_ip">
                    <a-input v-model:value="formState.private_ip" placeholder="请输入内网IP" />
                </a-form-item>
                <a-form-item label="公网IP" name="public_ip">
                    <a-input v-model:value="formState.public_ip" placeholder="请输入公网IP" />
                </a-form-item>
                <a-form-item label="配置" name="spec">
                    <a-select v-model:value="formState.spec" placeholder="请选择配置" :options="specOptions" />
                </a-form-item>
                <a-form-item label="所属项目">
                    <a-input v-model:value="formState.application" placeholder="请输入所属项目" />
                </a-form-item>
                <a-form-item label="地区" name="region">
                    <a-select v-model:value="formState.region" placeholder="请选择实例所在地区" :options="regionOptions" />
                </a-form-item>
                <a-form-item label="平台" name="cloud_provider">
                    <a-select v-model:value="formState.cloud_provider" placeholder="请选择机器所属平台" :options="cloudProviderOptions" />
                </a-form-item>
                <a-form-item label="系统" name="os">
                    <a-select v-model:value="formState.os" placeholder="请选择机器系统" :options="osOptions" />
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

const formRef = ref();
const rules = ref({
    instance_name: [
        { required: true, message: '请输入实例名称' },
        { pattern: /^[A-Z]+-[A-Z0-9\-]+$/, message: '格式应为 环境-名称，例如 PROD-AUTH'}
    ],
    password: [
        { required: true, message: '请输入实例密码' },
        { pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,32}$/, message: '密码需包含字母、数字和特殊字符，且8-32位' }
    ],
    private_ip: [
        { required: true, message: '请输入内网IP' },
        {
            pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
            message: '请输入合法的 IPv4 地址，例如 192.168.1.1'
        }
    ],
    public_ip: [
        {
            pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
            message: '请输入合法的 IPv4 地址，例如 8.8.8.8'
        }
    ],
    spec: [
        { required: true, message: '请选择配置' }
    ],
    region: [
        { required: true, message: '请选择实例所在地区' }
    ],
    cloud_provider: [
        { required: true, message: '请选择机器所属平台' }
    ],
    os: [
        { required: true, message: '请选择机器系统' }
    ]
});

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
    { label: '64C128G', value: 'mega' },
    { label: '128C256G', value: 'tera' },
    { label: '256C512G', value: 'peta' },
    { label: '512C1T', value: 'exa' },
]);
const regionOptions = ref([
    { label: '上海', value: 'cn-shanghai' }
    // { label: '杭州', value: 'cn-hangzhou' },
    // { label: '香港', value: 'cn-hongkong'},
    // { label: '新加坡', value: 'ap-southeast-1' },
]);
const cloudProviderOptions = ref([
    { label: '本地云', value: 'local' },
    { label: '阿里云', value: 'aliyun' }
    // { label: '华为云', value: 'huawei' },
    // { label: '腾讯云', value: 'tencent' },
    // { label: 'AWS云', value: 'aws' },
]);
const osOptions = ref([
    { label: 'Centos', value: 'centos' },
    { label: 'Windows', value: 'windows' }
    // { label: 'Debian', value: 'debian' }
]);
const handleOk = () => {
    formRef.value.validate().then(async()=> {
        formState.value.password = Base64.encode(formState.value.password);
        await postSaveVmData(formState.value)
        visible.value = false;
    })
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
