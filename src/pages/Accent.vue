<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { WordsApiService, type Word } from '@/api/words';

    import { useWordsStore, useTagsStore, useRuleStore, useStatisticsStore } from '@/stores';
    import CommonTask from '@/components/CommonTask.vue';
    import AccentExam from '@/components/AccentExam.vue';


    const wordsApiService = new WordsApiService(axiosInstance)
    const task = ref({
        count: 20,
        level: 10,
        errors: 30,
        tags: [],
    })
    const wordsStore = useWordsStore()
    const tagsStore = useTagsStore()
    const ruleStore = useRuleStore()
    const statisticsStore = useStatisticsStore()

    const allAccentTags = computed(() => {
        return tagsStore.tags?.filter( (tag :any) => {
            return tag?.type == "accent"
        } )
    })
    const currentRuleList = computed(() => {
        return wordsStore?.currentWord?.rules?.map(
             (ruleId: number) => ruleStore.ruleById(ruleId)
        ).filter(
            (rule: any) => rule?.type == "accent"
        )
    })

    function startExam(){
        statisticsStore.clear()

        wordsApiService.getAccentTask(task.value.tags, task.value.count, task.value.errors)
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
        :tags="allAccentTags" :rules="currentRuleList" :total="wordsStore.totalWords" :current="wordsStore.countWord"
        @start="startExam" @next="wordsStore.nextWord" @complete="onCompleteWord">
        <accent-exam v-model="wordsStore.currentWord"></accent-exam>
    </common-task>
</template>
