<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import { axiosInstance } from '@/api/config';
    import { UsersApiService } from '@/api/users';
    import { InviteApiService, type UserRegister } from '@/api/invite';

    import { useToast, useForm } from 'vuestic-ui';
    import { useAuthStore } from '@/stores';

    const route = useRoute()
    const router = useRouter()
    const toastManager = useToast()
    const authStore = useAuthStore()

    const usersApiService = new UsersApiService(axiosInstance)
    const inviteApiService = new InviteApiService(axiosInstance)

    const {isValid} = useForm('registerForm')

    const invite = ref({
        hash: "",
        status: false,
    })

    const form = ref({
        email: "",
        name: "",
        password: "",
        retype: "",
    })
    const isInviteValid = computed( () => {
        return invite.value.status

    })

    const register = () => {
        const email = form.value.email
        const name = form.value.name
        const password = form.value.password

        inviteApiService.registerUser(
            <UserRegister>{
                email, name, password, invite: invite.value.hash
            }
        ).then( (status: any) => {
            if( !status ){
                toastManager.notify({
                    message: 'Не удалось зарегистрировать пользователя, возможно имя уже занято',
                    color: "warning",
                })
            }else{
                usersApiService.getToken(email, password).then( (data) => {
                    localStorage.setItem('username', email)

                    authStore.setAccessToken(data.accessToken);
                    router.push({name: "home"})
                })
            }
        }).finally( () => {
            
        })
    }

    onMounted(() => {
        const invite_hash = String(route.params.invite)
        invite.value.hash = invite_hash

        inviteApiService.checkInvite(invite_hash).then(
            status => {
                invite.value.status = !!status
            }
        )
    })

    const notEmpty = (v: string) => Boolean(v) || 'Поле обязательно для заполнения'
    const tooShort = (size :number) => (v: string) => v.length>=size || 'Слишком короткое значение'
    const wrongChars = (v: string) => /^[a-zA-Z][a-zA-Z0-9_]+$/.test(v) || 'Только латинские символы, цифры и _'
    const isEmail = (v:string) => /.+@.+\..+/.test(v) || 'Некорректный Email'
</script>

<template>
    <template v-if="!isInviteValid">
        <va-alert color="warning"
            description="Регистрация новых пользователей недоступна"
        />
    </template>
    <template v-else>
        <va-card class="item">
            <va-card-title>Регистрация</va-card-title>
            <va-card-content>
                <va-form ref="registerForm">
                <va-input label="E-Mail" v-model="form.email" class="row" :rules="[notEmpty, tooShort(4), isEmail]"/>
                <va-input label="Имя" v-model="form.name" class="row" :rules="[notEmpty, tooShort(4), wrongChars]"/>
                <va-input label="Пароль" v-model="form.password" type="password" class="row" :rules="[notEmpty, tooShort(6)]"/>
                <va-input label="Поворите пароль" v-model="form.retype" type="password" class="row"
                   :rules="[notEmpty, (v) => v == form.password || 'Пароли должны совпадать']"/>
                </va-form>
            </va-card-content>
            <va-card-actions align="right">
                <va-button preset="secondary">Отмена</va-button>
                <va-button @click="register" :disabled="!isValid">Регистрация</va-button>
            </va-card-actions>
        </va-card>
    </template>
</template>
