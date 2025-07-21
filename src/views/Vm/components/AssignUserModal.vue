<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="分配用户" :bodyStyle="{ padding: '20px' }" @ok="handleOk" >
            <a-form :model="formState" layout="horizontal" :labelCol="{ style: { width: '50px' } }" :wrapperCol="{ span: 20 }">
                <a-form-item label="用户">
                    <a-select mode="multiple" @popupScroll="popupScroll" v-model:value="formState.users" placeholder="请选择用户" :options="userOptions"/>
                </a-form-item>
            </a-form>
        </a-modal>>
    </a-config-provider>
</template>

<script setup>

import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, watchEffect} from "vue";
import {getUsers} from "@/http/base";
import {getUsersByVm, postUsersByUser} from "@/http/vm";

const visible = ref(false);
const vmId = ref(0);
const formState = ref({
    users: [],
})
const userOptions = ref([])
const popupScroll = () => {
    console.log('popupScroll');
};

const handleOk = async () => {
    const body = Array.isArray(formState.value.users)
            ? formState.value.users.map((u) => (typeof u === 'object' ? u.value : u))
            : []
    await postUsersByUser(vmId.value, { users: body });
    visible.value = false;
    // console.log('机器：', vmId.value+ "最终的用户 ID 列表:", body,)
}

watchEffect(async () => {
    if (visible.value && vmId.value !== undefined) {
        const res = await getUsers()
        userOptions.value = res.map((item) => ({
            label: item.name,
            value: item.id,
        }));
        const resUsers = await getUsersByVm(vmId.value);
        formState.value.users = resUsers.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }
})

defineExpose({
    visible,
    vmId,
});
</script>

<style scoped>

</style>