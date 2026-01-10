<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useAuthStore } from '@/stores';
    import {useRouter, useRoute} from 'vue-router'
    import { useColors } from 'vuestic-ui';

    const showSidebar = ref(false)
    const auth = useAuthStore()
    const router = useRouter()
    const colorManager = useColors()

    const darkTheme = computed({
        get() {
            return colorManager.currentPresetName.value == 'dark'
        },
        set(value: boolean) {
            colorManager.applyPreset(value?'dark':'light')
            localStorage.setItem('darkMode', JSON.stringify(value))
        }
    })

    onMounted(() =>{
        const value = localStorage.getItem('darkMode') || 'false'
        darkTheme.value = JSON.parse(value)
    })

    const links = [
        {name: 'Домой', route: 'home', icon: 'home', visible: () => true},
        {name: 'Тренировка', route: 'spelling', visible: () => auth.isAuthentificated},
        {name: 'Вход', route: 'login', icon: 'login', visible: () => !auth.isAuthentificated},
        {name: 'Профиль', route: 'profile', visible: () => auth.isAuthentificated},
        {name: 'Выход', route: 'logout', icon: 'logout', visible: () => auth.isAuthentificated },
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
                        <va-icon :name="item.icon" v-if="item.icon"/>
                        <va-sidebar-item-title>{{ item.name }}</va-sidebar-item-title>
                    </va-sidebar-item-content>

                </va-sidebar-item>

                <va-spacer/>
                <va-sidebar-item>
                    <va-sidebar-item-content>
                        <va-switch size="small" v-model="darkTheme">
                            <template #innerLabel>
                                <va-icon :name="darkTheme ? 'dark_mode' : 'light_mode'"></va-icon>
                            </template>
                        </va-switch>
                    </va-sidebar-item-content>
                </va-sidebar-item>
                <va-sidebar-item>
                    <va-sidebar-item-content>
                        <va-icon name="settings"/>
                        <va-sidebar-item-title>Настройки</va-sidebar-item-title>
                    </va-sidebar-item-content>
                </va-sidebar-item>

            </va-sidebar>

        </template>

        <template #content>
            <div class="row" style="min-height: 10vh;"/>
            <router-view></router-view>
        </template>
    </va-layout>

</template>


<style scoped>
</style>
