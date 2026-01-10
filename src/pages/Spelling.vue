<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import SpellingExam from '@/components/SpellingExam.vue';

    import { useWordsStore, useStatsStore} from '@/stores';

    import { usersApi } from '@/api/users';

    const inProcess = ref(true);
    const isSuccess = ref();

    const words = useWordsStore();
    const stats = useStatsStore();

    var timeoutId = -1;

    function processAnswer(success: boolean){
        isSuccess.value = success
        if( success ){
            stats.incRight()
            usersApi.sendUserStat([words.currentWord['id']], [])

            timeoutId = setTimeout(() => nextWord(), 3000)
        }else{
            stats.incWrong()
            usersApi.sendUserStat([], [words.currentWord['id']])
        }
        inProcess.value = false
    }

    function nextWord(){
        clearTimeout(timeoutId)
        inProcess.value = true;
        words.nextWord();
    }

    onMounted(() => { nextWord() });
</script>

<template>
    <div class="row" style="min-height: 20vh"></div>
    <div class="row justify-center">
        <va-card stripe :stripe-color='inProcess?"secondary":isSuccess?"success":"danger"' class="flex flex-col">
            <va-card-title>Орфограммы/Словарные слова</va-card-title>
            <va-card-content>
                <div class="row" style="min-height: 1vh;"></div>
                <spelling-exam class="row justify-center"
                    v-model="words.currentWord" v-if="words.currentWord"
                    v-on:on-right="processAnswer(true)" v-on:on-wrong="processAnswer(false)">
                </spelling-exam>
                <div class="row" style="min-height: 1vh;"></div>
                <div class="va-text-block" v-if="!!words.currentWord?.context">
                    <span>{{ words.currentWord?.context }}</span>
                </div>
                <va-divider/>
                <div class="row justify-center">
                    <va-button :disabled="inProcess" class="primary" icon-right="arrow_forward" v-on:click="nextWord()">Дальше</va-button>
                </div>
            </va-card-content>
        </va-card>
    </div>
</template>

<style scoped>
    .h-screen {
        display: flex;
    }
</style>