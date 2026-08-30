+<script setup lang="ts">
    import { computed } from 'vue';
    import type { Word } from '@/api/words';

    interface IWordProps {
        value: Word
    }
    const props = defineProps<IWordProps>()

    const letters = computed(() => {
        return props.value?.fullword.split('')
    })

    const letterClass = (index :number): String => {
        if( props.value?.accents.includes(index) )
            return "accent"

        for( var spelling of props.value?.spellings )
            if( index >= spelling.position && index < spelling.position+spelling.length )
                return "spelling"
        return ""
    }
</script>

<template>
    <span :class='letterClass(Number(index))'  v-for="(letter, index) in letters">{{ letter }}</span>
</template>

<style scoped>
    .accent {
        text-decoration: underline #14a76c 3px;
    }
    .accent::after{
        content: "\301";
        color: #14a76c;
    }

    .spelling {
        text-decoration: underline #14a76c 3px;
    }

</style>