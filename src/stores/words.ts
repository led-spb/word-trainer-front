import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { wordsApi } from '../api/words'


export const useWordsStore = defineStore('words', () => {
    const currentWord = ref()
    const wordsBank = ref([].values())

    function nextWord() {
        const item = wordsBank.value.next()
        currentWord.value = item.done ? undefined : item.value
    }

    function getWords(count: Number, minLevel :Number, maxLevel :Number){
        wordsApi.getSpellingTask( count, minLevel, maxLevel, data => {
            wordsBank.value = data.values()
            nextWord()
        })
    }

    return { currentWord, getWords, nextWord}
})
