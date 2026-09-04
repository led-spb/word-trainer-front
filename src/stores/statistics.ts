import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { StatisticsApiService } from '@/api/statistics'
import { axiosInstance } from '@/api/config'
import type { Word } from '@/api/words'

export const useStatisticsStore = defineStore('statistics', () => {
    const statisticsApiService = new StatisticsApiService(axiosInstance)

    const success = ref<Word[]>([])
    const failed = ref<Word[]>([])
    const isChanged = ref<boolean>(true)

    const storeSuccess = (word :Word) => {
        success.value.push(word)
        statisticsApiService.updateUserStat({success : [word.id]})
        isChanged.value = true
    }

    const storeFailed = (word :Word) => {
        failed.value.push(word)
        statisticsApiService.updateUserStat({failed : [word.id]})
        isChanged.value = true
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

    return { success, failed, statistic, isChanged, storeSuccess, storeFailed, clear }
})
