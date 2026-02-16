<script setup lang="ts">
    import { ref} from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { axiosInstance } from '@/api/config';
    import { UsersApiService, type UserToken } from '@/api/users';

    import { useAuthStore } from '@/stores';
    import { useToast, useForm } from 'vuestic-ui';
    import type { AxiosError } from 'axios';

    const auth = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    const toastManager = useToast()
    const usersApiService = new UsersApiService(axiosInstance)

    const {isValid} = useForm('loginForm')
    const isEmail = (v:string) => /.+@.+\..+/.test(v) || 'Некорректный Email'
    const notEmpty = (v: string) => Boolean(v) || 'Поле обязательно для заполнения'

    const form = ref({
        email: localStorage.getItem('username') || '',
        password: '',
    })

    const onLogin = () => {
        usersApiService.getToken(form.value.email, form.value.password)
            .then((token: UserToken) => {
                localStorage.setItem('username', form.value.email)
                auth.setAccessToken(token.accessToken);

                const redirectPath = route.query.redirect;
                if( redirectPath ){
                    router.push({path: String(redirectPath)})
                }else{
                    router.push({name: "home"})
                }
            })
            .catch((error: AxiosError) => {
                if( error.status == 401 ){
                    toastManager.notify({
                        message: 'Неверные логин/пароль',
                        color: "warning",
                    })
                }
            })
    }
</script>


<template>
    <va-modal :model-value="true" size="auto" withoutTransitions :hideDefaultActions="true">
        <template v-slot:default>
            <va-form ref="loginForm">
                <va-input label="E-Mail" v-model="form.email" class="row" :rules="[notEmpty]"/>
                <va-input label="Пароль" v-model="form.password" type="password" class="row" :rules="[notEmpty]"/>
                <va-button style="display: none" @click="onLogin()" type="submit"></va-button>
            </va-form>
        </template>
        <template v-slot:footer>
            <va-button class="mr-4" preset="secondary" @click="router.back()">Cancel</va-button>
            <va-button :disabled="!isValid" @click="onLogin()">Login</va-button>
        </template>
    </va-modal>
</template>
