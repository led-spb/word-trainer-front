import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Word } from '@/api/words'


export const useWordsStore = defineStore('words', () => {
    const word = ref<Word>()
    const wordsBank = ref<Word[]>([])
    const totalWords = ref(0)
    const countWord = ref(0)

    function nextWord() {
        const index = Math.trunc(Math.random()*wordsBank.value.length)
        word.value = wordsBank.value.splice(index, 1).pop()
        countWord.value = Math.min(countWord.value+1, totalWords.value)
    }

    function setWords(values: Word[]){
        word.value = undefined
        wordsBank.value = values
        
        totalWords.value = values.length
        countWord.value = 0
    }

    const currentWord = computed(() => word.value)

    return { currentWord, countWord, totalWords, nextWord, setWords }
})
