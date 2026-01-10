import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { usersApi } from '@/api/users'


export const useUsersStore = defineStore('users', () => {
    const currentUser = ref()
    const currentUserStat = ref()

    function loadCurrentUser(){
        usersApi.getCurrentUser( data => {
            currentUser.value = data
        })
        usersApi.getUserStat( data => {
            currentUserStat.value = data
        })
    }

    return { currentUser, currentUserStat, loadCurrentUser }
})
