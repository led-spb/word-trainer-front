<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import WordExam from '@/components/WordExam.vue';

    import { useWordsStore, useStatsStore} from '@/stores';

    import { usersApi } from '@/api/users';

    const words = useWordsStore();
    const stats = useStatsStore();

    function onRightAnswer(){
        stats.incRight()
        usersApi.sendUserStat([words.currentWord['id']], [])
    }

    function onWrongAnswer(){
        stats.incWrong()
        usersApi.sendUserStat([], [words.currentWord['id']])
    }

    onMounted(() => { words.nextWord() });
</script>

<template>
        <VaCard class="align-center">
            <VaCardTitle>Орфограммы/Словарные слова</VaCardTitle>
            <VaCardContent>
                <WordExam
                    v-model="words.currentWord" v-if="words.currentWord"
                    v-on:on-right="onRightAnswer()" v-on:on-wrong="onWrongAnswer()">
                </WordExam>
                <VaButton preset="primary" icon-right="arrow_forward" v-on:click="words.nextWord()">Дальше</VaButton>
            </VaCardContent>
        </VaCard>
</template>

<style scoped>
    .h-screen {
        display: flex;
    }
</style>