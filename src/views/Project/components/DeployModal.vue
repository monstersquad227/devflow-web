<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="发布项目" :bodyStyle="{ padding: '20px' }" @ok="handleOk" :confirm-loading="confirmLoading" okText="发布">
            <a-form ref="formRef" :model="formState" layout="vertical" >
                <a-form-item label="发布类型">
                    <a-radio-group v-model:value="formState.publish_type" @change="radioChange">
<!--                        <a-radio value="docker">Docker</a-radio>-->
                        <a-radio value="flowedge">FlowEdge</a-radio>
                        <a-radio value="kubernetes">Kubernetes</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="项目名" >
                            <a-input v-model:value="formState.deployment_name" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="环境" name="env" :rules="[{ required: true, message: '选择环境'}]">
                            <a-select v-model:value="formState.env" :options="envOptions" @change="envSelectChange" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item label="名称空间" v-if="formState.publish_type === 'kubernetes'">
                    <a-select v-model:value="formState.namespace" :options="namespaceOptions" />
                </a-form-item>
                <a-form-item label="发布版本" name="tag" :rules="[{ required: true, message: '请选择发布的版本' }]">
                    <a-select v-model:value="formState.tag" :options="tagOptions" />
                </a-form-item>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center" v-if="formState.publish_type === 'docker'">
                    <span>发布机器</span>
                    <a-transfer :data-source="dataSource" :render="item => item.title" v-model:target-keys="formState.ecs" style="margin-top: 20px" />
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center" v-if="formState.publish_type === 'flowedge'">
                    <span>发布节点</span>
                    <a-transfer :data-source="flowedgeDataSource" :render="item => item.title" v-model:target-keys="formState.ecs" style="margin-top: 20px" :titles="['可用节点', '已选节点']" />
                </div>

                <!-- 提示信息 -->
                <a-alert message="发布后，项目将立即更新到选定的环境" type="info" show-icon style="margin-top: 24px" />
            </a-form>
        </a-modal>
    </a-config-provider>
</template>

<script setup>
import {ref, defineProps, watchEffect, nextTick} from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { getEnvData, getNamespacesByEnv } from "@/http/setting";
import { getVmByApplication } from "@/http/vm";
import {deployProjects, getProjectTags} from "@/http/project";
import {getFlowedgesByApplication} from "@/http/flowedge";
import {hasPermission} from "@/utils/permission";
import {message} from "ant-design-vue";

const formRef = ref();
const props = defineProps({
    project: Object
});
const formState = ref({
    publish_type: 'flowedge',
    deployment_name: '',
    env: '',
    namespace: '',
    tag: '',
    ecs: []
});
const visible = ref(false);
const confirmLoading = ref(false);
const envOptions = ref([]);
const tagOptions = ref([]);
const namespaceOptions = ref([]);
const dataSource = ref([]);
const flowedgeDataSource = ref([]);
const radioChange = () => {
    if (formState.value.publish_type === 'docker') {
        getVmByApplication(props.project.deployment_name)
                .then((res) => {
                    dataSource.value = res.map(item => ({
                        key: item["public_ip"] || item["private_ip"],
                        title: item["instance_name"] || item["public_ip"] || "",
                    }))
                });
    }
    // else if (formState.value.publish_type === 'flowedge') {
    // getFlowedgesByApplication(props.project.deployment_name)
    //         .then((res) => {
    //             flowedgeDataSource.value = res.map(item => ({
    //                 key: item["agent_id"],
    //                 title: item["hostname"],
    //             }))
    //         })
    // }
};
const envSelectChange = () => {
    const envLabel = envOptions.value.find(item => item["value"] === formState.value.env);

    if (envLabel?.label === 'prod' && !hasPermission('project:deploy:prod')) {
        message.error("您没有生产环境发布权限！");
        formState.value.env = "";          // 清空选择
        tagOptions.value = [];             // 清空其它依赖项
        namespaceOptions.value = [];
        flowedgeDataSource.value = [];
        return;
    }

    getProjectTags(formState.value.deployment_name, envLabel["label"])
            .then((res) => {
                if (!res || !Array.isArray(res) || res.length === 0) {
                    tagOptions.value = [];
                    return;
                }

                tagOptions.value = res.map(item => ({
                    label: item.name,
                    value: item.name
                })).sort((a, b) => {
                    // 提取 "20240801_153654" 部分（去掉后面的 -xxx）
                    const dateA = a.value.split("-")[0];
                    const dateB = b.value.split("-")[0];
                    // 转换成 Date 对象
                    const parseDate = (dateStr) => {
                        const [date, time] = dateStr.split("_");
                        return new Date(
                                date.substring(0, 4),  // 年
                                date.substring(4, 6) - 1,  // 月（0-11）
                                date.substring(6, 8),  // 日
                                time.substring(0, 2),  // 时
                                time.substring(2, 4),  // 分
                                time.substring(4, 6)   // 秒
                        );
                    };
                    return parseDate(dateB) - parseDate(dateA); // 降序排序
                });
            });

    if (formState.value.publish_type === 'kubernetes') {
        getNamespacesByEnv(envLabel["label"])
                .then((res) => {
                    namespaceOptions.value = res.filter(item => !/^(kube-|cattle-|ingress-|default|local)/.test(item.metadata.name)).map(item => ({
                        label: item.metadata.name,
                        value: item.metadata.name
                    }))
                });
    } else if (formState.value.publish_type === 'flowedge') {
        // 获取 flowedge 数据并根据环境过滤
        getFlowedgesByApplication(props.project.deployment_name)
                .then((res) => {
                    const envPrefix = envLabel["label"]; // 获取环境名，如 "prod"、"dev"

                    flowedgeDataSource.value = res
                            .filter(item => item["hostname"].startsWith(envPrefix + "-")) // ✅ 过滤：只保留 prod-xxx、dev-xxx 等
                            .map(item => ({
                                key: item["agent_id"],
                                title: item["hostname"],
                            }));
                });
    }
};
const handleOk = async () => {
    confirmLoading.value = true;
    try {
        const data = {
            name: formState.value.deployment_name,
            env: envOptions.value.find(item => item["value"] === formState.value.env)["label"],
            publish_type: formState.value.publish_type,
            tag: formState.value.tag,
            ecs: formState.value.ecs,
        }
        await formRef.value.validate();
        await deployProjects(data, props.project.id);

        confirmLoading.value = false;
        visible.value = false;
    } catch (error) {
        console.log(error);
        confirmLoading.value = false;
    }

    // setTimeout(() => {
    //
    // }, 3000);
};

watchEffect(async () => {
    if (visible.value === true) {
        formState.value = {
            publish_type: 'flowedge',
            deployment_name: '',
            env: '',
            ecs: [],
        };
        tagOptions.value = [];
        namespaceOptions.value = [];
        flowedgeDataSource.value = [];

        // 清除之前的验证错误
        await nextTick(() => {
            formRef.value?.clearValidate();
        });

        await getEnvData(1, 100)
                .then((res) => {
                    const { data } = res
                    envOptions.value = data.map(item => ({
                        label: item.name,
                        value: item.id
                    }))
                });
    }
    if (props.project) {
        formState.value.deployment_name = props.project.deployment_name;
    }
});

// function radioChange() {
//     if (formState.value.publish_type === 'docker') {
//         getVmByApplication(props.project.deployment_name)
//             .then((res) => {
//                 dataSource.value = res.map(item => ({
//                     key: item["public_ip"] || item["private_ip"],
//                     title: item["instance_name"] || item["public_ip"] || "",
//                 }))
//             });
//     }
// }
// function envSelectChange() {
//     const envLabel = envOptions.value.find(item => item["value"] === formState.value.env)
//     getProjectTags(formState.value.deployment_name, envLabel["label"])
//         .then((res) => {
//             if (!res || !Array.isArray(res) || res.length === 0) {
//                 tagOptions.value = [];
//                 return;
//             }
//
//             tagOptions.value = res.map(item => ({
//                 label: item.name,
//                 value: item.name
//             })).sort((a, b) => {
//                 // 提取 "20240801_153654" 部分（去掉后面的 -xxx）
//                 const dateA = a.value.split("-")[0];
//                 const dateB = b.value.split("-")[0];
//                 // 转换成 Date 对象
//                 const parseDate = (dateStr) => {
//                     const [date, time] = dateStr.split("_");
//                     return new Date(
//                         date.substring(0, 4),  // 年
//                         date.substring(4, 6) - 1,  // 月（0-11）
//                         date.substring(6, 8),  // 日
//                         time.substring(0, 2),  // 时
//                         time.substring(2, 4),  // 分
//                         time.substring(4, 6)   // 秒
//                     );
//                 };
//                 return parseDate(dateB) - parseDate(dateA); // 降序排序
//             });
//
//         })
//
//     if (formState.value.publish_type === 'kubernetes') {
//         getNamespacesByEnv(envLabel["label"])
//             .then((res) => {
//                 namespaceOptions.value = res.filter(item => !/^(kube-|cattle-|ingress-|default|local)/.test(item.metadata.name)).map(item => ({
//                     label: item.metadata.name,
//                     value: item.metadata.name
//                 }))
//             });
//     }
// }

defineExpose({
    visible,
});
</script>