<script setup lang="ts">
    import { computed } from 'vue';

    import {Bar} from 'vue-chartjs';
    import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, CategoryScale, LinearScale, Filler} from 'chart.js'
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    import type { UserDayStatistics } from '@/api/statistics';

    ChartJS.register(Title, Tooltip, Legend, Filler, ChartDataLabels, BarElement, CategoryScale, LinearScale )

 
    const props = defineProps({
        data: {type: Array<UserDayStatistics>, default: []},
        fillColor: {type: String, default: 'rgba(255, 99, 132, 0.2)' },
        textColor: {type: String, default: '#333' },
        valueColor: {type: String, default: '#666' },
        textSize: {type: Number, default: 12},
    })

    const dateLabel = (date: Date): string => {
        return String(date.getDate()).padStart(2, '0')+'.'+String(date.getMonth()+1).padStart(2, '0')
    }

    const chartData = computed(() => {
        return {
            labels: props.data.map( item => dateLabel(item.recorded_at) ),
            datasets: [{
                data: props.data.map( item => item.total ),
                fill: true,
                backgroundColor: props.fillColor,                
            }]
        }
    })

    const chartOptions = computed(() => {
        return {
            clip: 0,
            responsive: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {display: false},
                tooltip: {enabled: false},

                datalabels: {
                    color: props.valueColor,
                    font: {
                        weight: 'bold' as const,
                        size: props.textSize,
                    },
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false,
                    },
                },
                x: {
                    ticks: {
                        color: props.valueColor
                    },
                },
            }
        }
    })
</script>

<template>
    <Bar :data="chartData" :options="chartOptions" v-if="props.data.length > 0"></Bar>
</template>
