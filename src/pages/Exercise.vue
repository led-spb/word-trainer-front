<script setup lang="ts">
    import { ref, computed, onMounted, watch } from 'vue';

    import { axiosInstance } from '@/api/config';
    import { StatisticsApiService } from '@/api/statistics';

    import { useTasksStore, useTopicsStore, useRuleStore, useUsersStore } from '@/stores';
    import CommonTask from '@/components/CommonTask.vue';
    import AccentExam from '@/components/AccentExam.vue';
    import SpellingExam from '@/components/SpellingExam.vue';
    import type { Rule } from '@/api/rules';
    import { useRouter } from 'vue-router';
    

    const router = useRouter()
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

    const topics = computed(() => topicsStore.topics)
    const rules = computed( () => {
        if( tasksStore.currentWord == undefined || tasksStore.currentWord.rules == undefined ){
            return []
        }
        return ruleStore.rules.filter(
            (rule: Rule) => tasksStore.currentWord?.rules.findIndex(ruleId => rule.id == ruleId) != -1
        )
    })
    watch( () => tasksStore?.currentWord?.rules, async (values) => {
        if( values ){
            values.forEach( item => ruleStore.loadRule(item) )
        }
    })

    async function startExercise(){
        await tasksStore.makeTask(
            task.value.count,
            Math.ceil(task.value.count*(task.value.errors/100)),
            task.value.topics
        )
    }

    function finishExercise(){
        tasksStore.finishTask()
        router.back()
    }

    function onCompleteWord(result: boolean){
        if( tasksStore.currentWord ){
            if( result ){
                statisticApiService.updateUserStat({success: [tasksStore.currentWord.id], failed: []});
            }else{
                statisticApiService.updateUserStat({success: [], failed: [tasksStore.currentWord.id]});
            }
            userStore.user!.progressLoaded = false;
        }
    }

    onMounted(() => {
        statistic.value = {success: 0, failed: 0}
    })
</script>

<template>
    <common-task class="item"
        title="Упражнение"
        v-model:word="tasksStore.currentWord" v-model:statistics="statistic" v-model:task="task"
        :topics="topics" :rules="rules" :total="tasksStore.totalWords" :current="tasksStore.countWord"
        @start="startExercise"
        @finish="finishExercise"
        @next="tasksStore.nextWord"
        @complete="onCompleteWord">
        <template v-if="tasksStore.currentWord">
            <accent-exam v-model="tasksStore.currentWord" v-if="tasksStore.currentWord.accents && tasksStore.currentWord.accents.length > 0" />
            <spelling-exam v-model="tasksStore.currentWord" v-else/>
        </template>
    </common-task>
</template>
