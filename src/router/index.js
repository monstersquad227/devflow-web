import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
    },
    {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/Project.vue')

    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
