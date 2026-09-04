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

    // reload propgress and statistic on user changed
    watch(user, (value) => {
        if(value){
            loadUserProgress()
            loadUserStat()
        }
    })

    const loadUserInfo = () => {
        userApiService.getCurrentUser().then( (value: User) => {
            user.value = value
            localStorage.setItem('user', value.name)
        })
    }

    function loadUserProgress(){
        userApiService.getUserProgress().then( (value: UserProgress) => {
            progress.value = value
        })
    }

    function loadUserStat(){
        statisticsApiService.getUserStat().then( (data: UserDayStatistics[]) => {
            statistics.value = data
        })

        statisticsApiService.getUserTrobles().then( (data: UserWordStatistics[]) => {
            troubles.value = data
        })

        statisticsApiService.getTopicStatistics().then( (data: TopicStatistics[]) => {
            topicStatistic.value = data
        })
    }

    function loadUserRating(){
        ratingApiService.getUserRating().then( (value: UserRating[]) => {
            rating.value = value
        })
    }

    return { user, progress, troubles, statistics, topicStatistic, rating, loadUserInfo, loadUserProgress, loadUserStat, loadUserRating}
})
