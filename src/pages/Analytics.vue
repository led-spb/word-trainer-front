<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useUsersStore } from '@/stores';
    import { StatisticsApiService, type TopicStatistics } from '@/api/statistics';
    import { axiosInstance } from '@/api/config';

    const statisticsApiService = new StatisticsApiService(axiosInstance);
    const userStore = useUsersStore()
    const tagsStatistcs = ref<TopicStatistics[]>()

    onMounted(() => {
        statisticsApiService.getTopicStatistics().then( data => {
            tagsStatistcs.value = data
        })
    })

    const percent = (current :any, total :any) => total > 0 ? Math.ceil(current/total * 100 * 10 )/10 : 0

    const delta = (current :number, prev :number) => {
        if (current >= prev ){
            return `+${ Math.ceil((current-prev)*10)/10 }`
        }else{
            return `-${ Math.ceil((prev-current)*10)/10 }`
        }
    }
</script>

<template>
    <!-- <template v-for="info in tagsStatistcs">
    <va-card class="item" v-if="info.prev && info.prev.total != info.total">
        <va-card-title>{{ info.tag.title }}</va-card-title>
        <va-card-content>
            <va-list class="stat">
                <va-list-item>
                    <va-list-item-section>Попыток</va-list-item-section>
                    <va-list-item-section icon>{{ info.total }}</va-list-item-section>
                    <va-list-item-section icon>{{ delta(info.total,info.prev.total) }}</va-list-item-section>
                </va-list-item>
                <va-list-item>
                    <va-list-item-section>Правильно</va-list-item-section>
                    <va-list-item-section icon>{{ info.total-info.failed }}</va-list-item-section>
                    <va-list-item-section icon>{{ delta(info.total-info.failed, info.prev.total-info.prev.failed) }}</va-list-item-section>
                </va-list-item>
                <va-list-item>
                    <va-list-item-section>Ошибок</va-list-item-section>
                    <va-list-item-section icon>{{ info.failed }}</va-list-item-section>
                    <va-list-item-section icon>{{ delta(info.failed,info.prev.failed) }}</va-list-item-section>
                </va-list-item>
                <va-list-item>
                    <va-list-item-section>Процент</va-list-item-section>
                    <va-list-item-section icon>{{ percent(info.total-info.failed, info.total) }}%</va-list-item-section>
                    <va-list-item-section icon>{{ delta(percent(info.total-info.failed, info.total), percent(info.prev.total-info.prev.failed, info.prev.total)) }}%</va-list-item-section>
                </va-list-item>
            </va-list>
        </va-card-content>
    </va-card>
    </template> -->
</template>
