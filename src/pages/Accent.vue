<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { WordsApiService, type Word } from '@/api/words';
    import { StatisticsApiService } from '@/api/statistics';

    import { useTasksStore, useTopicsStore, useRuleStore, useUsersStore } from '@/stores';
    import CommonTask from '@/components/CommonTask.vue';
    import AccentExam from '@/components/AccentExam.vue';
    import type { Rule } from '@/api/rules';


    const wordsApiService = new WordsApiService(axiosInstance)
    const statisticApiService = new StatisticsApiService(axiosInstance)

    const task = ref({
        count: 20,
        level: 10,
        errors: 30,
        topics: [],
    })
    const statistic = ref({success: 0, failed: 0})
    const tasksStore = useTasksStore()
    const topicsStore = useTopicsStore()
    const ruleStore = useRuleStore()
    const userStore = useUsersStore()

    const onlyAccentTopics = computed(() => topicsStore.topics.filter( topic => topic.type == "accent" ))
    const rules = computed( () => {
        if( tasksStore.currentWord == undefined || tasksStore.currentWord.rules == undefined ){
            return []
        }
        return ruleStore.rules.filter(
            (rule: Rule) => rule.type == 'accent' && tasksStore.currentWord?.rules.findIndex(ruleId => rule.id == ruleId) != -1
        )
    })
    watch( () => tasksStore?.currentWord?.rules, async (values) => {
        if( values ){
            values.forEach( item => ruleStore.loadRule(item) )
        }
    })

    function startExam(){
        statistic.value = {success: 0, failed: 0}
        wordsApiService.getAccentTask(task.value.topics, task.value.count, task.value.errors)
            .then( (data: Word[]) => {
                tasksStore.setWords(data)
                tasksStore.nextWord()
            })
    }

    function onCompleteWord(result: boolean){
        if( tasksStore.currentWord ){
            if( result ){
                statistic.value.success += 1;
                statisticApiService.updateUserStat({success: [tasksStore.currentWord.id], failed: []});
            }else{
                statistic.value.failed += 1;
                statisticApiService.updateUserStat({success: [], failed: [tasksStore.currentWord.id]});
            }
            userStore.user!.progressLoaded = false;
        }
    }

    onMounted(() => {
        if( !tasksStore.currentWord?.accents ){
            tasksStore.setWords([])
        }
    })
</script>

<template>
    <common-task class="item"
        title="Ударения"
        v-model:word="tasksStore.currentWord" v-model:statistics="statistic" v-model:task="task"
        :topics="onlyAccentTopics" :rules="rules" :total="tasksStore.totalWords" :current="tasksStore.countWord"
        @start="startExam" @next="tasksStore.nextWord" @complete="onCompleteWord">
        <accent-exam v-model="tasksStore.currentWord"></accent-exam>
    </common-task>
</template>
