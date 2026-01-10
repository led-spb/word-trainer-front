<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';

    const userStore = useUsersStore()

    const topFailed = computed( () => {
        return userStore.currentUserStat?.failed
    })

    onMounted(() => {
        userStore.loadCurrentUser()
    })
</script>


<template>
    <div class="row justify-center">
        <!-- <va-card>
            <va-card-title>Топ слов с ошибками</va-card-title>
            <va-card-content>
                <ol class="va-ordered">
                    <li v-for="item in userStore.currentUserStat?.failed">{{ item.word.fullword }}</li>
                </ol>
            </va-card-content>
        </va-card> -->

        <va-card>
            <va-card-title>Топ слов с ошибками</va-card-title>
            <va-card-content>
                <div class="va-table-responsive">
                    <table class="va-table">
                    <thead>
                        <tr>
                        <th>Слово</th>
                        <th>Ошибок</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in topFailed" :key="item.word.id">
                        <td>{{ item.word.fullword }}</td>
                        <td>{{ item.frequency }}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </va-card-content>
        </va-card>
    </div>    
</template>
