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
            auth: true
        }
    },
    {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/Project/Project.vue'),
        meta: {
            auth: true,
            title: '项目列表',
            icon: 'AppstoreOutlined',
            roles: ['Owner', 'Maintainer', 'Developer', 'Reporter'],
        }
    },
    {
        path: '/project/:projectId',
        name: 'ProjectDetail',
        component: () => import('@/views/Project/Detail.vue'),
        meta: {
            auth: true,
            roles: ['Owner', 'Maintainer', 'Developer', 'Reporter']
        }
    },
    {
        path: '/vm',
        name: 'Vm',
        component: () => import('@/views/Vm/Vm.vue'),
        meta: {
            auth: true,
            title: '机器列表',
            icon: 'HddOutlined',
            roles: ['Owner']
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/Setting/Setting.vue'),
        meta: {
            auth: true,
            title: '配置列表',
            icon: 'SettingOutlined',
            roles: ['Owner', 'Maintainer']
        }
    },
    {
        path: '/flowedge',
        name: 'FlowEdge',
        component: () => import('@/views/Flowedge/Flowedge.vue'),
        meta: {
            auth: true,
            title: 'Edge列表',
            icon: 'InstagramOutlined',
            roles: ['Owner']
        }
    },
    {
        path: '/kong',
        name: 'Kong',
        component: () => import('@/views/Kong/Kong.vue'),
        meta: {
            auth: true,
            title: 'Kong列表',
            icon: 'InstagramOutlined',
            roles: ['Owner']
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
            const roles = store.getters.roles;
            if (to.meta.roles && !roles.some(role => to.meta.roles.includes(role))) {
                next('/');
            } else {
                next();
            }
        }
    } else {
        next(to.meta?.auth ? '/login' : undefined);
    }
})

export default router
