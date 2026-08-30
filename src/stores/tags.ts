import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { tagsApi } from '@/api/tags'


export const useTagsStore = defineStore('tags', () => {
    const tags_data = ref()

    const tags = computed(() => {
        if( typeof tags_data.value == "undefined" ){
            tagsApi.getTagsDictionary().then( (data) => {
                tags_data.value = data
            })

        }
        return tags_data.value
    } )

    return { tags }
})
