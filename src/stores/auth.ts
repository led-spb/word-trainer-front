import { computed, ref } from 'vue'
import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(
        localStorage.getItem('accessToken')
    )

    const isAuthentificated = computed(() => {
        return !!accessToken.value
    })

    function setAccessToken(token: string){
        accessToken.value = token

        if( isAuthentificated ){
            localStorage.setItem('accessToken', token)
        }else{
            localStorage.removeItem('accessToken')
        }
    }
    
    return { accessToken, isAuthentificated, setAccessToken }
})
