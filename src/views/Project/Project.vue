<template>
    <Layout>
        <a-button>添加项目</a-button>
        <a-table :dataSource="dataSource" :columns="columns" />
    </Layout>
</template>

<script>
import Layout from "@/components/Layout.vue";

export default {
    components: {Layout},
    setup() {
        return {
            dataSource: [
                {
                    key: '1',
                    name: '胡彦斌',
                    age: 32,
                    address: '西湖区湖底公园1号',
                },
                {
                    key: '2',
                    name: '胡彦祖',
                    age: 42,
                    address: '西湖区湖底公园1号',
                },
            ],

            columns: [
                {
                    title: '',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '名称',
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: '别名',
                    dataIndex: 'address',
                    key: 'address',
                },
                {},
                {},
                {},
            ],
        };
    },
};
</script>
