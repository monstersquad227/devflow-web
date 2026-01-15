<template>
    <a-config-provider :locale="zhCN">
        <a-modal v-model:open="visible" title="详情">
            <template #footer>
<!--                <a-button key="submit" type="primary" @click="visible = false">知道了</a-button>-->
            </template>
            <div
                    v-html="formattedMetadata"
                    :style="{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: '1.8',
                    overflow: 'auto',
                    fontFamily: 'Consolas, Monaco, monospace',
                    whiteSpace: 'pre'
                }"
            ></div>
        </a-modal>
    </a-config-provider>
</template>

<script setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {ref, computed} from "vue";

const visible = ref(false);
const metadata = ref({});

const formattedMetadata = computed(() => {
    const formatValue = (value) => {
        const val = String(value);
        if (val === 'TRUE' || val === 'true') {
            return `<span style="color: #52c41a; font-weight: 500;">"${val}"</span>`;
        }
        if (val === 'FALSE' || val === 'false') {
            return `<span style="color: #ff4d4f; font-weight: 500;">"${val}"</span>`;
        }
        if (val === 'INTERNAL') {
            return `<span style="color: #52c41a; font-weight: 500;">"${val}"</span>`;
        }
        if (val === 'PUBLIC') {
            return `<span style="color: #faad14; font-weight: 500;">"${val}"</span>`;
        }
        return `<span style="color: #262626;">"${val}"</span>`;
    };

    const lines = [];
    lines.push('{');
    const entries = Object.entries(metadata.value);
    entries.forEach(([key, value], index) => {
        const comma = index < entries.length - 1 ? ',' : '';
        lines.push(
                `  <span style="color: #1890ff; font-weight: 500;">"${key}"</span>: ${formatValue(value)}${comma}`
        );
    });
    lines.push('}');

    return lines.join('\n');
});

defineExpose({
    visible,
    metadata,
});
</script>

<style scoped>
</style>