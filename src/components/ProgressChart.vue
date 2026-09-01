<script setup lang="ts">
    import { computed } from 'vue';

    import {Radar} from 'vue-chartjs';
    import {Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale, Filler} from 'chart.js'
    import ChartDataLabels from 'chartjs-plugin-datalabels';

    ChartJS.register(Title, Tooltip, Legend, Filler, ChartDataLabels, LineElement, RadialLinearScale, PointElement )

    interface TopicData {
        description: string
        percent: number
    }

    const props = defineProps({
        data: {type: Array<TopicData>, default: [], },
        fillColor: {type: String, default: 'rgba(255, 99, 132, 0.2)' },
        textColor: {type: String, default: '#333' },
        valueColor: {type: String, default: '#666' },
        textSize: {type: Number, default: 12},
    })

    const chartData = computed(() => {
        return {
            labels: props.data.map( (topic) => topic.description),
            datasets: [{
                data: props.data.map( (topic) => Math.ceil(topic.percent * 1000)/10),
                fill: true,
                backgroundColor: props.fillColor,
            }]
        }
    })

    const chartOptions = computed(() => {
        return {
            clip: 0,
            responsive: true,
            aspectRatio: 1.2,
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
                r: {
                    grid: {
                        color: '#666'
                    },
                    pointLabels: {
                        color: props.textColor,
                        font: {
                            size: props.textSize,
                            weight: 'bold' as const,
                        },
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        display: false
                    }
                },
            }
        }
    })
</script>

<template>
    <Radar :data="chartData" :options="chartOptions" v-if="props.data.length > 0"></Radar>
</template>
