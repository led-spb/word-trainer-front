import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/Main.vue'),
            children: [
                {   path: '', name: 'home',
                    component: () => import('@/pages/Home.vue'),
                    meta: { requiresAuth: true },
                },
                {   path: 'rating', name: 'rating',
                    component: () => import('@/pages/Rating.vue'),
                    meta: { requiresAuth: true },
                },
                {   path: 'profile', name: 'profile',
                    component: () => import('@/pages/Profile.vue'),
                    meta: { requiresAuth: true },
                },
                {
                    path: 'login', name: 'login',
                    component: () => import('@/pages/Login.vue')
                },
                {
                    path: 'logout', name: 'logout',
                    component: () => import('@/pages/Logout.vue')
                },
                {   path: 'register/:invite', name: 'register',
                    component: () => import('@/pages/Register.vue')
                },
                {   path: 'admin', name: 'admin',
                    component: () => import('@/pages/Admin.vue'),
                    meta: { requiresAuth: true },
                },
                {   path: 'rules', name: 'rules',
                    component: () => import('@/pages/Rules.vue'),
                    meta: { requiresAuth: true },
                },
                {   path: 'exercise', name: 'exercise',
                    component: () => import('@/pages/Exercise.vue'),
                    meta: { requiresAuth: true },
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
        return {name: 'home'}
    }
})

export default router
