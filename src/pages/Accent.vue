<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { WordsApiService, type Word } from '@/api/words';

    import { useWordsStore, useTopicsStore, useRuleStore, useStatisticsStore } from '@/stores';
    import CommonTask from '@/components/CommonTask.vue';
    import AccentExam from '@/components/AccentExam.vue';
    import type { Rule } from '@/api/rules';


    const wordsApiService = new WordsApiService(axiosInstance)
    const task = ref({
        count: 20,
        level: 10,
        errors: 30,
        topics: [],
    })
    const wordsStore = useWordsStore()
    const topicsStore = useTopicsStore()
    const ruleStore = useRuleStore()
    const statisticsStore = useStatisticsStore()

    const onlyAccentTopics = computed(() => topicsStore.topics.filter( topic => topic.type == "accent" ))
    const rules = computed( () => {
        if( wordsStore.currentWord == undefined || wordsStore.currentWord.rules == undefined ){
            return []
        }
        return ruleStore.rules.filter(
            (rule: Rule) => rule.type == 'accent' && wordsStore!.currentWord!.rules.findIndex(ruleId => rule.id == ruleId )
        )
    })
    watch( () => wordsStore?.currentWord?.rules, async (values) => {
        if( values !== undefined ){
            values?.forEach( item => ruleStore.loadRule(item) )
        }
    })

    function startExam(){
        statisticsStore.clear()
        wordsApiService.getAccentTask(task.value.topics, task.value.count, task.value.errors)
            .then( (data: Word[]) => {
                wordsStore.setWords(data)
                wordsStore.nextWord()
            })
    }

    function onCompleteWord(result: boolean){
        if( wordsStore.currentWord ){
            if( result ) statisticsStore.storeSuccess(wordsStore.currentWord)
            else statisticsStore.storeFailed(wordsStore.currentWord)
        }
    }

    onMounted(() => {
        if( !wordsStore.currentWord?.accents ){
            wordsStore.setWords([])
        }
    })
</script>

<template>
    <common-task class="item"
        title="Ударения"
        v-model:word="wordsStore.currentWord" v-model:statistics="statisticsStore.statistic" v-model:task="task"
        :topics="onlyAccentTopics" :rules="rules" :total="wordsStore.totalWords" :current="wordsStore.countWord"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord">
        <accent-exam v-model="wordsStore.currentWord"></accent-exam>
    </common-task>
</template>
