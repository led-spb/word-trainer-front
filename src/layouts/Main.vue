<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';
    import { useAuthStore, useUsersStore, useStatisticsStore } from '@/stores';
    import { useRouter, useRoute} from 'vue-router'
    import { useColors, useToast } from 'vuestic-ui';
    import { axiosInstance } from '@/api/config';

    const showSidebar = ref(false)
    const authStore = useAuthStore()
    const userStore = useUsersStore()
    const statisticsStore = useStatisticsStore()

    const router = useRouter()
    const colorManager = useColors()
    const toastManager = useToast()

    const darkTheme = computed({
        get() {
            return colorManager.currentPresetName.value == 'dark'
        },
        set(value: boolean) {
            colorManager.applyPreset(value ? 'dark': 'light')
            localStorage.setItem('darkMode', JSON.stringify(value))
            showSidebar.value = false
        }
    })

    const links = [
        {name: 'Домой', route: 'home', icon: 'home', visible: () => authStore.isAuthentificated},
        {name: 'Орфограммы', route: 'spelling', icon: 'spellcheck', visible: () => authStore.isAuthentificated},
        {name: 'Ударения', route: 'accent', icon: 'format_size', visible: () => authStore.isAuthentificated},
        {name: 'Рейтинг', route: 'rating', icon: 'leaderboard', visible: () => authStore.isAuthentificated},
        // {name: 'Правила', route: 'rules', icon: 'rule', visible: () => authStore.isAuthentificated},
        {name: 'Вход', route: 'login', icon: 'login', visible: () => !authStore.isAuthentificated},
        {name: 'Выход', route: 'logout', icon: 'logout', visible: () => authStore.isAuthentificated },
    ]
    const panelItems = computed( () => {
        return links.filter(item => item.visible())
    })

    const setLinkActive = (link: any) => {
        showSidebar.value = false
        router.push( {name: link.route} )
    }

    const isLinkActive = (link: any) => {
        return useRoute().name == link.route
    }

    watch(
        () => authStore.accessToken, 
        (value) => {
            userStore.loadUserInfo()
            statisticsStore.isChanged = false
        },
        {
            immediate: true
        }
    )

    onMounted(() => {
        axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log('Global request handler', error);

                if( error.response && error.response.status == 401 ){
                    authStore.setAccessToken(null)
                    router.push({name: 'login'})
                    return Promise.reject(error)
                }

                toastManager.notify({
                    message: 'Ошибка при обработке запроса на сервере',
                    color: 'danger'
                });

                return Promise.reject(error)
            }
        )
        // if( authStore.accessToken ){
        //     userStore.loadUserInfo()
        // }
    })
</script>


<template>

    <va-layout style="min-height: 100vh;" :left="{ absolute: true, fixed: true }" :top="{ fixed: true }">
        <template #top>
            <va-app-bar top>
                <va-button :icon="showSidebar ? 'menu_open' : 'menu'" @click="showSidebar = !showSidebar" class="toolbar_item"/>
                <va-navbar-item class="font-bold va-h6">Тренажер слов</va-navbar-item>
                <va-spacer/>

                <va-badge :text="userStore.progress?.series" overlap class="toolbar_item" v-if="userStore.progress?.series">
                <va-icon name="local_fire_department" class="toolbar_item"/>
                </va-badge>
                <va-navbar-item class="toolbar_item"></va-navbar-item>

                <template v-if="userStore.user">
                    <va-avatar 
                        class="toolbar_item"
                        color="warning"
                        size="small" 
                        :src="'uploads/'+userStore.user?.avatar"
                        @click="router.push({name: 'profile'})"
                        v-if="userStore.user.avatar"></va-avatar>
                    <va-avatar 
                        class="toolbar_item"
                        color="warning"
                        size="small" 
                        @click="router.push({name: 'profile'})"
                        v-else>{{ userStore.user.name.slice(0,1).toUpperCase() }}.</va-avatar>
                </template>
            </va-app-bar>
        </template>

        <template #left>

            <va-sidebar v-model="showSidebar" closeOnClickOutside>
                <va-sidebar-item v-for="(item, idx) in panelItems" 
                    :active="isLinkActive(item)" @click="setLinkActive(item)">
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
            <div class="container mt-5" >
                <router-view></router-view>
            </div>
        </template>
    </va-layout>

</template>


<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        /* justify-content: space-evenly; */
        align-items: stretch;
        align-content: center;

        gap: 20px;
    }
</style>


<style lang="scss">
    @media all and (max-width: 576px) {
        .item {
            min-width: 380px;
            max-width: 380px;
        }
    }

    @media (min-width: 625px) {
        .item {
            min-width: 600px;
            max-width: 600px;
        }
    }

    html {
        font-size: 11pt;
    }

    .toolbar_item {
        margin-right: 10px;
        cursor: pointer;
    }

    .card-icon {
        margin-right: 4px;
    }

    @media all and (max-width: 576px) {
        .va-modal--mobile-fullscreen .va-modal__dialog {
            margin: 0 !important;
            min-width: 360px !important;
            min-height: 0vh !important;
            border-radius: 0;
        }
    }
</style>