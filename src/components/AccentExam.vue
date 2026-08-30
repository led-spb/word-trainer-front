<script setup lang="ts">
    import { computed } from 'vue';
    import type { Word } from '@/api/words';

    const model = defineModel<Word>()

    const letters = computed( () => {
        return model.value?.fullword.split('')
    })
    const vowels = computed( () => 'аеёиоуыэюя'.split(''))
    const isDone = computed( () => typeof model.value?.selected !== 'undefined' )

    function selectVariant(index :number){
        if( model.value ){
            model.value.selected = index
            model.value.result = model.value.accents.includes(index)
        }
    }
    function letterClass(index: number): String|null {
        if( model.value ){
            if( model.value.accents.includes(index) )
                return "corrent"
            if( index == model.value.selected ){
                return model.value.accents.includes(index) ? "corrent" : "wrong"
            }
        }
        return null
    }
</script>


<template>
    <div class="word-block">
        <template v-for="(item, index) in letters" :key="index">
            <template v-if="vowels.includes(item)">
                <template v-if="!isDone">
                    <h2 class="letter variant" @click="selectVariant(Number(index))">{{ item }}</h2>
                </template>
                <template v-else>
                    <h2 class="letter" :class="letterClass(Number(index))">{{ item }}</h2>
                </template>
            </template>
            <h2 class="letter" v-else>{{ item }}</h2>
        </template>
    </div>
</template>

<style scoped>
    .word-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .letter {
        padding: 0 2px;
        font-size: 30px;
        transform: padding .25s;
    }
    .variant {
        border: 1px solid;
        border-radius: 5px;
        cursor: pointer;
    }
    .corrent {
        color: #14a76c;
    }
    .corrent::after{
        content: "\301";
    }    
    .wrong {
        color: tomato;
    }
</style>