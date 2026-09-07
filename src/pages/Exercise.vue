<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { WordsApiService, type Word } from '@/api/words';
    import { StatisticsApiService } from '@/api/statistics';

    import { useTasksStore, useTopicsStore, useRuleStore, useUsersStore } from '@/stores';
    import CommonTask from '@/components/CommonTask.vue';
    import AccentExam from '@/components/AccentExam.vue';
    import SpellingExam from '@/components/SpellingExam.vue';
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

    async function startExam(){
        statistic.value = {success: 0, failed: 0}

        const results = await Promise.all([
            wordsApiService.getAccentTask([], 20, 100),
            wordsApiService.getSpellingTask([], 20, 100)
        ])

        tasksStore.setWords([...results[0], ...results[1]] )
        tasksStore.nextWord()
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
        startExam()
    })
</script>

<template>
    <common-task class="item"
        title="Повторение"
        v-model:word="tasksStore.currentWord" v-model:statistics="statistic" v-model:task="task"
        :topics="onlyAccentTopics" :rules="rules" :total="tasksStore.totalWords" :current="tasksStore.countWord"
        @start="startExam" @next="tasksStore.nextWord" @complete="onCompleteWord">
        <template v-if="tasksStore.currentWord">
            <accent-exam v-model="tasksStore.currentWord" v-if="tasksStore.currentWord.accents && tasksStore.currentWord.accents.length > 0" />
            <spelling-exam v-model="tasksStore.currentWord" v-else/>
        </template>
    </common-task>
</template>
