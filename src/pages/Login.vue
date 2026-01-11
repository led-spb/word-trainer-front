<script setup lang="ts">
  import {ref} from 'vue'
  import {useRouter, useRoute} from 'vue-router'
  import {usersApi} from '@/api/users'
  import {useAuthStore} from '@/stores';

  const auth = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const form = ref({
    login: '',
    password: ''
  })

  function onLogin(){
    usersApi.getToken(form.value.login, form.value.password,
      data => {
        auth.setAccessToken(data.access_token);

        const redirectPath = route.query.redirect;
        if( redirectPath ){
            router.push({path: ""+redirectPath})
        }else{
            router.push({name: "home"})
        }
      }
    )
  }
</script>


<template>
    <VaModal :model-value="true" size="auto" withoutTransitions okText="Login" v-on:ok="onLogin()" v-on:cancel="router.back()">
        <VaForm class="flex">
            <VaInput label="Login" v-model="form.login" class="row" :rules="[(v) => Boolean(v) || 'Login is required']"/>
            <VaInput label="Password" v-model="form.password" type="password" class="row" :rules="[(v) => Boolean(v) || 'Password is required']"/>
        </VaForm>
    </VaModal>
</template>
