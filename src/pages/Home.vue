<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';

    import TaskStatistic from '@/components/TaskStatistic.vue';
    import Word from '@/components/Word.vue';
    import ProgressChart from '@/components/ProgressChart.vue';
    import { useColors } from 'vuestic-ui';


    const colors = useColors()

    const tabs = ref([
        {label: 'Сегодня', value: 0},
        {label: 'Неделя', value: 7},
        {label: 'Месяц', value: 30},
        {label: 'Всего', value: 1000},
    ])
    const userStore = useUsersStore()
    const stat = computed(() => {
        return userStore.aggregateStat(currentStatOffset.value || 0)
    })
    const topFailed = computed( () => {
        return userStore.troubles
    })
    const currentStatOffset = ref(0)

    onMounted(() => {
        userStore.loadUserProgress()
        userStore.loadUserStat()
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
            <va-card-title><va-icon name="hotel_class" class="card-icon"/>Всего изучено</va-card-title>
            <va-card-content>
                <va-progress-bar :model-value="percent(userStore.progress?.overall?.learned, userStore.progress?.overall?.total)" showPercent></va-progress-bar>
                <va-list-item>
                    <va-list-item-section></va-list-item-section>
                    <va-list-item-section icon>{{ userStore.progress?.overall?.learned }} / {{ userStore.progress?.overall?.total }}</va-list-item-section>
                </va-list-item>
            </va-card-content>
        </va-card>

        <va-card class="item">
            <va-card-title><va-icon name="bar_chart" class="card-icon"/>Статистика</va-card-title>
            <va-card-content>
                <va-button-toggle v-model="currentStatOffset" grow color="backgroundSecondary" toggle-color="primary" :options="tabs" size="small"></va-button-toggle>
                <task-statistic v-model="stat"/>
                <progress-chart 
                    :data="userStore.topicsProgress"
                    :text-color="colors.setHSLAColor(colors.colors.textPrimary, {a: 0.6})"
                    :value-color="colors.colors.textPrimary"
                    :fill-color="colors.setHSLAColor(colors.colors.primary, {a: 0.4})"
                ></progress-chart>
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
