import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'


const router = createRouter({
    //history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(),
    routes: [ 
        {
            path: '/',
            component: () => import('@/layouts/Main.vue'),
            children: [
                {   path: '',
                    name: 'about',
                    component: () => import('@/pages/About.vue')
                },
                {
                    path: 'spelling',
                    name: 'spelling',
                    component: () => import('@/pages/Spelling.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/pages/Login.vue')
                },
                {
                    path: 'logout',
                    name: 'logout',
                    component: () => import('@/pages/Logout.vue')
                },
            ]
        },
        {
            path: '/:catchAll(.*)*',
            component: () => import('@/pages/ErrorNotFound.vue')
        }
    ],
})


router.beforeEach(async (to, from) => {
    const auth = useAuthStore()
    const requiresAuth = to.meta.requiresAuth

    if( !auth.isAuthentificated && requiresAuth ){
        return {name: 'login', query: {redirect: to.fullPath}}
    }

    if( auth.isAuthentificated && to.name == 'login'){
        return {name: 'about'}
    }
})

export default router
