import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { axiosInstance } from '@/api/config'

import { UsersApiService } from '@/api/users'
import { StatisticsApiService } from '@/api/statistics'
import { RatingApiService, type UserRating } from '@/api/rating'
import type { User, UserProgress } from '@/api/users'
import type { UserDayStatistics, UserWordStatistics, TopicStatistics } from '@/api/statistics'


export const useUsersStore = defineStore('users', () => {
    const user = ref<User>()
    const statistics = ref<UserDayStatistics[]>([])
    const topicStatistic = ref<TopicStatistics[]>([])

    const progress = ref<UserProgress>()
    const troubles = ref<UserWordStatistics[]>([])
    const rating = ref<UserRating[]>([])

    const userApiService = new UsersApiService(axiosInstance)
    const ratingApiService = new RatingApiService(axiosInstance)
    const statisticsApiService = new StatisticsApiService(axiosInstance)

    // reload progress and statistic on user changed
    watch(user, (value) => {
        if(value){
            loadUserProgress()
        }
    })

    async function reloadUserInfo() {
        user.value = {...await userApiService.getCurrentUser(), progressLoaded: false}
        localStorage.setItem('user', user.value.name)
    }

    async function loadUserProgress(){
        if( !user.value || user.value.progressLoaded )
            return

        await Promise.all([
            (async () => { 
                progress.value = await userApiService.getUserProgress()
            })(),
            (async () => { 
                statistics.value = await statisticsApiService.getUserStat()
            })(),
            (async () => {
                topicStatistic.value = await statisticsApiService.getTopicStatistics()
            })(),
            (async () => { 
                troubles.value = await statisticsApiService.getUserTrobles()
            })(),
        ])

        user.value.progressLoaded = true
    }

    async function loadUserRating(){
        rating.value = await ratingApiService.getUserRating()
    }

    return { user, progress, troubles, statistics, topicStatistic, rating, reloadUserInfo, loadUserProgress, loadUserRating }
})
