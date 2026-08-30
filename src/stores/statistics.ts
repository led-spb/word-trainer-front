import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { StatisticsApiService } from '@/api/statistics'
import { axiosInstance } from '@/api/config'
import type { Word } from '@/api/words'

export const useStatisticsStore = defineStore('statistics', () => {
    const statisticsApiService = new StatisticsApiService(axiosInstance)

    const success = ref<Word[]>([])
    const failed = ref<Word[]>([])

    const storeSuccess = (word :Word) => {
        success.value.push(word)
        statisticsApiService.updateUserStat({success : [word.id]})
    }

    const storeFailed = (word :Word) => {
        failed.value.push(word)
        statisticsApiService.updateUserStat({failed : [word.id]})
    }

    const clear = () => {
        success.value = []
        failed.value = []
    }

    const statistic = computed(() => {
        return {
            success: success.value.length,
            failed: failed.value.length,
        }
    })

    return { success, failed, statistic, storeSuccess, storeFailed, clear }
})
