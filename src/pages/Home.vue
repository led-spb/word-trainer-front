<script setup lang="ts">
    import { ref, onMounted, computed, watch } from 'vue';
    import { useUsersStore, useTasksStore } from '@/stores';
    import { useRouter} from 'vue-router'

    import TaskStatistic from '@/components/TaskStatistic.vue';
    import Word from '@/components/Word.vue';
    import ProgressChart from '@/components/ProgressChart.vue';
    import TopicChart from '@/components/TopicChart.vue';
    import { useColors } from 'vuestic-ui';
    import type { Statistic, TopicStatistics, UserDayStatistics } from '@/api/statistics';
    import type { Task } from '@/api/tasks';

    const colors = useColors()
    const router = useRouter()
    const currentStatOffset = ref(0)

    const tabs = ref([
        {label: 'Сегодня', value: 0, stat: <Statistic>{failed:0, total: 0, success: 0, percent: 0}, topics: <TopicStatistics[]>[] },
        {label: 'Неделя', value: 6, stat: <Statistic>{failed:0, total: 0, success: 0, percent: 0}, topics: <TopicStatistics[]>[] },
        {label: 'Месяц', value: 29, stat: <Statistic>{failed:0, total: 0, success: 0, percent: 0}, topics: <TopicStatistics[]>[] },
        // {label: 'Всего', value: 1000, stat: <Statistic>{failed:0, total: 0, success: 0, percent: 0}, topics: <TopicStatistics[]>[] },
    ])
    const userStore = useUsersStore()
    const taskStore = useTasksStore()

    const dayOffsetFromNow = (offset: number): Date => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const result = new Date()
        result.setTime(now.getTime() + offset * 24*60*60*1000)
        return result
    }

    // aggregate statistics
    watch(() => userStore.statistics, (statistic) => {
        if( statistic == undefined )
            return

        tabs.value.forEach( item => {
            const offsetDate = dayOffsetFromNow(-item.value)
            const values = statistic.filter((value: UserDayStatistics) => value.recorded_at >= offsetDate)
            const total = values.reduce(
                (acc: any, item: any) => {
                    acc.success += item.success;
                    acc.failed += item.failed;
                    acc.total += item.total;
                    return acc
                },
                {success: 0, failed: 0, total: 0}
            );
            item.stat = {...total, percent: total.total != 0 ? total.success/total.total : 0}
        })
    }, {immediate: true});

    // aggregate topic statistics
    watch(() => userStore.topicStatistic, (statistic) => {
        if( statistic == undefined )
            return

        tabs.value.forEach( item => {
            const offsetDate = dayOffsetFromNow(-item.value)

            const values = statistic.filter((value: TopicStatistics) => value.recorded_at >= offsetDate)

            const groupped: Map<string, TopicStatistics> = values.reduce((acc, current) => {
                const group = acc.get(current.name) || { 
                    recorded_at: offsetDate, 
                    name: current.name, 
                    success: 0, failed: 0, total: 0, percent: 0
                };
                group.success += current.success;
                group.failed += current.failed;
                group.total += current.total;

                acc.set(current.name, group)
                return acc;
            }, new Map<string, TopicStatistics>());

            const result = [...groupped.values()].map( (value: TopicStatistics) => ({...value, percent: value.total > 0 ? value.success/value.total : 0 }))
            result.sort((a, b) => a.name.localeCompare(b.name))

            item.topics = result;
        })
    }, {immediate: true});


    const userStatistic = computed( () => {
        const tab = tabs.value.find( (item) => item.value == currentStatOffset.value )
        return tab?.stat || {success: 0, failed: 0, total: 0, percent: 0};
    })
    const userTopicStatistic = computed( () => {
        const tab = tabs.value.find( (item) => item.value == currentStatOffset.value )
        return tab?.topics || [];
    })
    const weeklyStatistic = computed<UserDayStatistics[]>( () => {
        if(userStore.statistics == undefined)
            return []
        const result = []
        for(let offset=6; offset>=0; offset-- ){
            const currentDate = dayOffsetFromNow(-offset)
            const value = userStore.statistics.find(
                item => item.recorded_at.getTime() == currentDate.getTime()
            ) || {recorded_at: currentDate, total: 0, success: 0, failed: 0, percent: 0}
            result.push(value)
        }
        return result
    })

    const topFailed = computed( () => {
        return userStore.troubles
    })

    const startTask = async (task: Task) => {
        await taskStore.loadTask(task);
        router.push({name: 'exercise'});
    }

    const taskIsDone = (task: Task): boolean => {
        return task.executed_at !== undefined && (new Date(task.executed_at)).setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0)
    }

    onMounted(() => {
        userStore.loadUserProgress()
    })

    const percent = (current :any, total :any) => total > 0 ? Math.ceil(current/total * 100) : 0
</script>


<template>
        <va-card class="item">
            <va-card-title><va-icon name="star" class="card-icon"/>Цель на сегодня</va-card-title>
            <va-card-content>
                <va-progress-bar :model-value="percent(userStore.progress?.today?.learned, userStore.progress?.today.total)" showPercent></va-progress-bar>
                <va-list-item>
                    <va-list-item-section></va-list-item-section>
                    <va-list-item-section icon>{{ userStore.progress?.today?.learned }} / {{ userStore.progress?.today.total }}</va-list-item-section>
                </va-list-item>
                <va-list-item v-if="userStore.progress?.series">
                    <va-list-item-section>Серия</va-list-item-section>
                    <va-list-item-section icon><va-chip color="success" size="small">{{ userStore.progress?.series }} дней</va-chip></va-list-item-section>
                </va-list-item>
            </va-card-content>
            <va-card-content>
                <div class="row flex justify-space-between">
                    <va-button 
                        preset="primary"
                        @click="startTask(task)"
                        :color="taskIsDone(task) ? 'success' : 'primary'"
                        v-for="task in userStore.tasks">
                        {{ task.name }}
                    </va-button>
                </div>
            </va-card-content>
            <va-card-content>
                <progress-chart 
                    :data="weeklyStatistic"
                    :fill-color="colors.colors.secondary"
                    :success-color="colors.colors.success"
                    :value-color="colors.colors.textPrimary"
                    :target-value="userStore.user?.dailyGoal"
                />
            </va-card-content>
        </va-card>

        <va-card class="item">
            <va-card-title><va-icon name="bar_chart" class="card-icon"/>Статистика</va-card-title>
            <va-card-content>
                <va-button-toggle v-model="currentStatOffset" grow color="backgroundSecondary" toggle-color="primary" :options="tabs" size="small"></va-button-toggle>

                <task-statistic :success="userStatistic.success" :failed="userStatistic.failed"/>
                <topic-chart
                    :data="userTopicStatistic"
                    :text-color="colors.setHSLAColor(colors.colors.textPrimary, {a: 0.6})"
                    :value-color="colors.colors.textPrimary"
                    :fill-color="colors.setHSLAColor(colors.colors.primary, {a: 0.4})"
                />
            </va-card-content>
        </va-card>

        <va-card class="item">
            <va-card-title><va-icon name="tour" class="card-icon"/>Топ ошибок</va-card-title>
            <va-card-content>
                <div class="va-table-responsive">
                        <table class="va-table va-table--striped" width="100%">
                        <thead>
                            <tr>
                            <th>Слово</th>
                            <th class="va-text-right">Ошибок</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in topFailed" :key="item.word.id">
                            <td><word :value="item.word"/></td>
                            <td class="va-text-right">{{ item.failed }}</td>
                            </tr>
                        </tbody>
                        </table>
                </div>
            </va-card-content>
        </va-card>

</template>
