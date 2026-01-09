<script setup lang="ts">
    import { useAuthStore } from '@/stores';
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useModal } from 'vuestic-ui';


    onMounted(() => {
        const { confirm } = useModal();

        confirm("Выйти из системы?")
            .then((ok) => {
                const router = useRouter()
                if( ok ){
                    useAuthStore().setAccessToken("")
                    router.push({name: 'login'})
                }else{
                    router.back()
                }
            })
    })

</script>

<template>

</template>