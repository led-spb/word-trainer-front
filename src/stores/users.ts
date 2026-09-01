import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosInstance } from '@/api/config'

import { UsersApiService } from '@/api/users'
import { StatisticsApiService } from '@/api/statistics'
import { RatingApiService, type UserRating } from '@/api/rating'
import type { User, UserProgress } from '@/api/users'
import type { UserDayStatistics, UserWordStatistics, TopicStatistics } from '@/api/statistics'


export const useUsersStore = defineStore('users', () => {
    const user = ref<User>()
    const statistics = ref<UserDayStatistics[]>()
    const progress = ref<UserProgress>()
    const troubles = ref<UserWordStatistics[]>()
    const rating = ref<UserRating[]>()
    const topicsProgress = ref<TopicStatistics[]>()

    const userApiService = new UsersApiService(axiosInstance)
    const ratingApiService = new RatingApiService(axiosInstance)
    const statisticsApiService = new StatisticsApiService(axiosInstance)

    const setUserInfo = (info: User) => {
        user.value = info
    }
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
            topicsProgress.value = data
        })
    }

    function loadUserRating(){
        ratingApiService.getUserRating().then( (value: UserRating[]) => {
            rating.value = value
        })
    }

    function accumulateStatistics(fromDate :Date){
        const days = statistics.value?.filter( (item: any) => {
             return item.recorded_at >= fromDate
        })
        return days?.reduce(
            (acc: any, item: any) => {
                acc.success += item.success
                acc.failed += item.failed

                return acc
            },
            {
                success: 0,
                failed: 0,
            }
        )
    }

    const dailyStats = computed(() => {
        return (offset :number) => {
            const fromDate = new Date()
            fromDate.setHours(0)
            fromDate.setMinutes(0)
            fromDate.setSeconds(0)
            fromDate.setMilliseconds(0)

            fromDate.setDate(fromDate.getDate() - offset)
            return accumulateStatistics(fromDate)
        }
    })

    return { user, progress, troubles, topicsProgress, statistics, aggregateStat: dailyStats, rating, setUserInfo, loadUserInfo, loadUserProgress, loadUserStat, loadUserRating}
})
