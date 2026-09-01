<script setup lang="ts">
    import { computed, watch } from 'vue';
    import type { Word, Spelling } from '@/api/words';

    class Letter {
        constructor (
            public letter: string,
            public isMinor: boolean
        ){}
    }

    const model = defineModel<Word>();
    const emit = defineEmits(['complete']);

    function* partsGeneratior(data :Word): Generator<Letter|Spelling> {
        const word = data.fullword
        let position = 0, currentPartStart = 0;
        let minorFlag = true

        const spellings = [...(data.spellings || [])].sort(
            (a: Spelling, b: Spelling) => a.position-b.position == 0 ? (a.length-b.length) : (a.position - b.position)
        )

        for( const spelling of spellings){
            while(position <= word.length){
                if(position == spelling.position){
                    yield new Letter(word.substring(currentPartStart, position), false)
                    yield spelling
                    currentPartStart = spelling.position+spelling.length
                    position = currentPartStart
                    minorFlag = false
                    break

                }else if( word.charAt(position) == ' ' ){
                    yield new Letter(word.substring(currentPartStart, position+1), minorFlag)
                    minorFlag = true
                    position++
                    currentPartStart = position
                }else {
                    position++
                }
            }
        }
        while(position < word.length){
            if( word.charAt(position) == ' ' ){
                yield new Letter(word.substring(currentPartStart, position+1), minorFlag)
                minorFlag = true
                position++
                currentPartStart = position
            }else {
                position++
            }
        }
        yield new Letter(word.substring(currentPartStart), minorFlag)
    }

    const letters = computed(() => {
        if( !model.value ) return
        return [...partsGeneratior(model.value)]
    });

    const isDone = computed(() =>{
        for(const part of model.value?.spellings || [])
            if( part.selected === undefined )
                return false
        return true
    })

    const isComplete = computed(() => {
        return isDone.value && typeof model.value?.result !== "undefined"
    })

    var timeoutId = -1;
    watch(isDone, (value, oldValue) => {
        if( value ){
            timeoutId = setTimeout(() => { emitCompleteEvent() }, 1000)
        }else{
            clearTimeout(timeoutId)
        }
    })

    const emitCompleteEvent = () => {
        if( model.value && isDone.value ){
            model.value.result = resultWord.value == model.value.fullword
        }
    }

    const resultWord = computed(() => {
        if( !model.value ) return
        const result = [];
        for (const letter of letters.value || []) {
            if( letter instanceof Letter ){
                result.push(letter.letter)
            }else{
                result.push(letter.selected)
            }
        }
        return result.join('')
    })

    const displayVariants = (variants: string[]): string[] => {
        const filtered = variants.filter( (item) => item != "_" && item != "" )
        if( filtered.length != variants.length ){
            return filtered.map( (item) => item+"?" )
        }
        return filtered
    }

    const sortVariants = (variants: string[]): string[] => {
        if( variants.includes("") || variants.includes("_"))
            return [...variants.filter( (item) => item != "_" && item != "" ),"_"]
        return variants
    }

    const getSpellingRight = (spelling: any) => {
        if( !model.value ) return
        return model.value.fullword.slice( spelling.position, spelling.position+spelling.length )
    }
    const isSpellingOk = (spelling: any): Boolean => {
        return spelling.selected == getSpellingRight(spelling)
    }

    const mapVariant = (variant: string): string => variant.replace('_','')

    const encodeSpaces = (value: any): any => {
        return value && value.replace(' ',' ')
    }

    const currentSpelling = computed( () => {
        if( !model.value ) return

        return [...(model.value.spellings || [])].sort(
            (a: any, b: any) => {return a.position-b.position == 0 ? (a.length-b.length) : (a.position - b.position)}
        ).find(
            (item: any) => item.selected === undefined
        )
    })
</script>


<template>
    <div>
        <div class="row justify-center">
        <div class="word-block">
            <template v-if="isComplete">
                <template v-for="item, index in letters">
                    <template v-if="item instanceof Letter">
                        <h2 class="letter" :class="item.isMinor && char != ' '? 'minor':''" v-for="char in item.letter">{{ encodeSpaces(char) }}</h2>
                    </template>
                    <template v-else>
                        <div class="spelling spelling-ok" v-if="isSpellingOk(item)">
                            <h2 class="letter letter-right">{{ encodeSpaces(item.selected) }}</h2>
                        </div>
                        <div class="spelling spelling-wrong" v-else>
                            <h2 class="letter letter-wrong" v-if="item.selected">{{ encodeSpaces(item.selected) }}</h2>
                            <h2 class="letter letter-wrong" v-else>{{ encodeSpaces(' ') }}</h2>
                            <h2 class="letter letter-correct">{{ getSpellingRight(item) }}</h2>
                        </div>
                    </template>
                </template>
            </template>

            <template v-else>
                <template v-for="item, index in letters">
                    <template v-if="item instanceof Letter">
                        <h2 class="letter" :class="item.isMinor && char != ' ' ? 'minor':''" v-for="char in item.letter">{{ encodeSpaces(char) }}</h2>
                    </template>
                    <template v-else>
                        <div v-if='typeof item.selected !== "undefined"'>
                            <h2 class="letter">{{ encodeSpaces(item.selected) }}</h2>
                        </div>
                        <div v-else class="spelling spelling-variant" :class="item.id == currentSpelling?.id ? 'spelling-active' : ''">
                            <h2 class="variant" v-for="(variant, index) in displayVariants(item.variants)"><span v-if="index">|</span>{{ variant }}</h2>
                        </div>
                    </template>
                </template>
            </template>
        </div>
        </div>
        <div style="min-height: 1vh;"></div>
        <div class="row justify-space-evenly" v-if="currentSpelling && currentSpelling.variants">
            <va-button v-for="variant in sortVariants(currentSpelling.variants)" @click="currentSpelling.selected = mapVariant(variant)">{{ variant }}</va-button>
        </div>
    </div>
</template>


<style scoped>
    .word-block {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        user-select: none;
        letter-spacing: 4px;
    }
    .letter {
        font-size: 30px;
        transform: padding .25s;
        line-height: 70px;
    }
    .spelling {
        display: flex;
        font-size: 20px;
    }
    .spelling-variant {
        border-bottom: 2px dashed;
        border-color: var(--va-secondary);
    }
    .spelling-active {
        border-color: var(--va-danger);
    }
    .variant {
        padding: 0px 2px;
        color: var(--va-secondary);
        transform: translateY(25px);
    }
    .even .variant {
        background-color: var(--va-background-border);
    }
    .letter-right {
        color: #14a76c;
    }
    .letter-wrong {
        display: flex;
        position: relative;
    }
    .spelling-wrong {
        background: linear-gradient(to top left, transparent 0%, transparent 45%, red 50%, transparent 55%, transparent 100%);
    }
    .letter-correct {
        color: tomato;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transform: translateY(-60%);
    }

    .minor {
        font-size: 16px;
        letter-spacing: normal;
    }
</style>