import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login/Login.vue')
    },
    {
        path: '/',
        name: 'Dashboard',
        component: ()=> import('@/views/Dashboard/Dashboard.vue'),
        meta: {
            auth: true,
            title: '首页'
        }
    },
    {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/Project/Project.vue'),
        meta: {
            auth: true,
            title: '项目列表'
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/Project/Project.vue'),
        meta: {
            auth: true,
            title: '配置列表'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound/NotFound.vue'),
    }
]

const WhiteList = ['NotFound']

const router = createRouter({
    history: createWebHistory(),
    routes
})


router.beforeEach((to, from, next) => {
    if (WhiteList.includes(to.name)) {
        next()
        return
    }

    if (store.getters.isLogin) {
        if (to.name === "Login") {
            next('/')
        } else {
            next()
        }
    } else {
        next(to.meta?.auth ? '/login' : undefined);
    }
})

export default router
