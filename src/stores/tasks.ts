import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Word } from '@/api/words'
import { axiosInstance } from '@/api/config'
import { type Task, TasksApiService } from '@/api/tasks';



export const useTasksStore = defineStore('tasks', () => {
    const taskApiService = new TasksApiService(axiosInstance)

    const word = ref<Word>()
    const wordsBank = ref<Word[]>([])
    const totalWords = ref(0)
    const countWord = ref(0)
    const currentTask = ref<Task>()

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
        nextWord()
    }

    const loadTask = async (task: Task) => {
        currentTask.value = task
        setWords(await taskApiService.getTaskContent(task.id))
    }

    const makeTask = async (word_count: number, repeat_count: number, topics: number[]) => {
        currentTask.value = undefined
        setWords(await taskApiService.makeTaskContent(word_count, repeat_count, topics))
    }

    const finishTask = async () => {
        if( currentTask.value ){
            await taskApiService.completeTask(currentTask.value.id)
        }
        currentTask.value = undefined
    }

    return {
        currentWord: computed(() => word.value),
        countWord,
        currentTask,
        totalWords,
        loadTask,
        makeTask,
        finishTask,
        nextWord,
        setWords 
    }
})
