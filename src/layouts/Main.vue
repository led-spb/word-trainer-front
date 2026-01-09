<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useAuthStore } from '@/stores';
    import {useRouter, useRoute} from 'vue-router'
    

    const showSidebar = ref(false)
    const auth = useAuthStore()
    const router = useRouter()

    const links = [
        {name: 'Домой', route: 'about', visible: () => true},
        {name: 'Тренировка', route: 'spelling', visible: () => auth.isAuthentificated},
        {name: 'Вход', route: 'login', visible: () => !auth.isAuthentificated},
        {name: 'Профиль', route: 'profile', visible: () => auth.isAuthentificated},
        {name: 'Выход', route: 'logout', visible: () => auth.isAuthentificated },
    ]
    const panelItems = computed( () => {
        return links.filter(item => item.visible())
    })

    function setLinkActive(link: any){
        showSidebar.value = false
        router.push( {name: link.route} )
    }

    function isLinkActive(link: any){
        return useRoute().name == link.route
    }

</script>


<template>
    
    <!-- <div class="container">
        <va-navbar color="primary" class="py-2">
            <template #left>
            <va-button :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar"/>
            </template>
            <template #center>
                <va-navbar-item class="font-bold text-lg"></va-navbar-item>
            </template>
        </va-navbar>



        <div class="content">
        <va-sidebar>
            <va-sidebar-item>
                <va-sidebar-item-content>heres</va-sidebar-item-content>
            </va-sidebar-item>
        </va-sidebar>
            <va-content>
                <router-view>
                </router-view>
            </va-content>
        </div>
    </div> -->

    <va-layout style="min-height: 100vh;" :left="{absolute: true}">
        <template #top>
            <va-navbar color="primary" class="py-2">
                <template #left>
                <va-button :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar"/>
                </template>
                <template #center>
                    <va-navbar-item class="font-bold text-lg"></va-navbar-item>
                </template>
            </va-navbar>
        </template>

        <template #left>

            <va-sidebar v-model="showSidebar">
                <va-sidebar-item v-for="(item, idx) in panelItems" 
                    :active="isLinkActive(item)"
                    @click="setLinkActive(item)"
                >
                    <va-sidebar-item-content>
                        <va-sidebar-item-title>{{ item.name }}</va-sidebar-item-title>
                    </va-sidebar-item-content>

                </va-sidebar-item>
                
                <!-- <va-sidebar-item>
                    <va-sidebar-item-content>
                        <va-sidebar-item-title>Home</va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>

                <va-sidebar-item>
                    <va-sidebar-item-content>
                        <va-sidebar-item-title>Login</va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>

                <va-sidebar-item @click="">
                    <va-sidebar-item-content>
                        <va-sidebar-item-title>Spelling</va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item> -->
            </va-sidebar>

        </template>

        <template #content>
            <router-view></router-view>
        </template>
    </va-layout>

</template>


<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex-grow: 1;
    }
</style>
