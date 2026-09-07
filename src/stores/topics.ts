import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Topic, topicsApi } from '@/api/topics'


export const useTopicsStore = defineStore('topics', () => {
    const topics_data = ref<Topic[]>([])

    topicsApi.getTopicsDictioary().then( data => {
        topics_data.value = data
    })

    return { topics: computed(() => topics_data.value) }
})
