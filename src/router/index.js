import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                // {
                //     path: '/',
                //     name: 'dashboard',
                //     component: () => import('@/views/Dashboard.vue')
                // },
                {
                    path: '/',
                    name: 'recondata',
                    component: () => import('@/views/pages/ReconData.vue')
                },
                {
                    path: '/master-data',
                    name: 'masterdata',
                    component: () => import('@/views/pages/MasterData.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isAuthenticatedDataA = localStorage.getItem('DataA') !== null;

    if (to.path === '/auth/login' && isAuthenticatedDataA) {
        next({ path: '/' });
    } else if (!isAuthenticatedDataA && to.path !== '/auth/login') {
        next({ path: '/auth/login' });
    } else {
        next();
    }
});

export default router;
