import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/home',
        redirect: '/project',
    },
    {
        path: '/project',
        component: () => import('@/views/NotFound.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
