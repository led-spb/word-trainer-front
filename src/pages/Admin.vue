<script setup lang="ts">
    import { ref } from 'vue';
  
    import { axiosInstance } from '@/api/config';
    import { WordsApiService } from '@/api/words';
    import AccentExam from '@/components/AccentExam.vue';
    import SpellingExam from '@/components/SpellingExam.vue';
    import Word from '@/components/Word.vue';


    const word = ref()
    const searchValue = ref()

    const wordsApiService = new WordsApiService(axiosInstance)

    const findWord = () => {
        if( searchValue.value ){
            const wordId = parseInt(searchValue.value);
            if( !Number.isNaN(wordId)) {
                wordsApiService.getWordById(wordId).then( (data) => {
                    word.value = data
                } )
            }else{
                wordsApiService.getWordByName(searchValue.value).then( (data) => {
                    word.value = data
                })
            }
        }
    }

</script>

<template>
    <va-card class="item">
        <va-form>
        <va-card-title>admin</va-card-title>
        <va-card-content>
            <va-input label="слово/id" class="row" v-model="searchValue"></va-input>
        </va-card-content>

        <va-card-content>
            <div class="row justify-center"><va-button @click="findWord" type="submit">Найти</va-button></div>
        </va-card-content>

        <va-divider />

        <va-card-content><div class="row justify-center"><p><word :value="word"/></p></div></va-card-content>
        <va-card-content><div class="row justify-center"><spelling-exam v-model="word" v-if="word?.spellings?.length"/></div></va-card-content>
        <va-card-content><div class="row justify-center"><accent-exam  v-model="word" v-if="word?.accents?.length"/></div></va-card-content>
        </va-form>
    </va-card>
</template>
