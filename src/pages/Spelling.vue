<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { WordsApiService, type Word } from '@/api/words';

    import { useWordsStore, useTopicsStore, useRuleStore, useStatisticsStore } from '@/stores';

    import CommonTask from '@/components/CommonTask.vue';
    import SpellingExam from '@/components/SpellingExam.vue';
    import type { Rule } from '@/api/rules';

    
    const wordsApiService = new WordsApiService(axiosInstance)

    const task = ref({
        count: 20,
        errors: 30,
        level: 10,
        topics: [],
    })
    const wordsStore = useWordsStore()
    const topicsStore = useTopicsStore()
    const ruleStore = useRuleStore()
    const statisticsStore = useStatisticsStore()

    const onlySpellingTopics = computed(() => topicsStore.topics.filter( topic => topic.type == "spelling"))
    
    const rules = computed( ()=> {
        if( wordsStore.currentWord == undefined || wordsStore.currentWord.rules == undefined ){
            return []
        }

        return ruleStore.rules.filter(
            (rule: Rule) => rule.type == 'spelling' && wordsStore!.currentWord!.rules.findIndex(ruleId => rule.id == ruleId )
        )
    })
    watch( () => wordsStore?.currentWord?.rules, async (values) => {
        if( values !== undefined ){
            values?.forEach( item => ruleStore.loadRule(item) )
        }
    })


    const startExam = () => {
        statisticsStore.clear()

        wordsApiService.getSpellingTask(task.value.topics, task.value.count, task.value.errors)
            .then( (data: Word[]) => {
                wordsStore.setWords(data)
                wordsStore.nextWord()
            })
    }

    const onCompleteWord = (result: boolean) => {
        if( wordsStore.currentWord ){
            if( result ) statisticsStore.storeSuccess(wordsStore.currentWord)
            else statisticsStore.storeFailed(wordsStore.currentWord)
        }
    }

    const sendUserRport = () => {
        if( wordsStore.currentWord ) wordsApiService.sendWordReport(wordsStore.currentWord)
    }

    onMounted(() => {
        if( !wordsStore.currentWord?.spellings ){
            wordsStore.setWords([])
        }
    })
</script>

<template>
    <common-task class="item"
        title="Орфограммы/Словарные слова" 
        v-model:statistics="statisticsStore.statistic"
        v-model:word="wordsStore.currentWord"
        v-model:task="task"
        :topics="onlySpellingTopics"
        :rules="rules"
        :total="wordsStore.totalWords"
        :current="wordsStore.countWord"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord" @report="sendUserRport">

        <spelling-exam v-model="wordsStore.currentWord"></spelling-exam>
    </common-task>
</template>