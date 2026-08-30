<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import TaskStatistic from './TaskStatistic.vue';
    import Rule from './Rule.vue';
    import type { Word } from '@/api/words';
    import type { TreeNode } from 'vuestic-ui';

    const word = defineModel<Word>('word', {})
    const statistics = defineModel( 'statistics',
        {type: Object, default: {success: 0, failed: 0}}
    );
    const task = defineModel('task',
        {
            type: Object,
            default: {
                count: 20,
                errors: 30,
                level: 10,
                tags: Array<any>
            }
        }
    );
    const showRules = ref(false);

    const props = defineProps({
        title: { type: String, default: "" },
        tags: { type: Array<any>, default: [] },
        rules: { type: Array<any>, default: [] },
        current: { type: Number, default: 0 },
        total: {type: Number, default: 0 },
    })

    const taskTopicNodes = ref<TreeNode[]>([])

    watch( () => props.tags, (tags) => {
            //
            const tagsObject :any = {};
            tags.forEach(element => {
                tagsObject[element.id] = { id: element.id, parent_id: element.parent_id, label: element.description, children: [], expanded: false }
            });

            Object.values(tagsObject).forEach((item :any) => {
                if( item.parent_id != undefined && tagsObject[item.parent_id] != undefined ){
                    tagsObject[item.parent_id].children.push(item)
                }
            });
            taskTopicNodes.value = Object.values(tagsObject).filter( (item: any) => item.parent_id == undefined) as TreeNode[]            
        }, 
        {
            immediate: true
        }
    );

    const emit = defineEmits(['complete', 'next', 'start', 'report']);

    const inProcess = computed(() => typeof word.value?.result == 'undefined');
    const isSuccess = computed(() => word.value && word.value.result);

    watch( isSuccess, (newValue, oldValue) => {
        if( typeof newValue == 'undefined')
            showRules.value = false;

        if( typeof oldValue == "undefined" && (typeof newValue !== 'undefined') ){
            if( newValue && !showRules.value ) statistics.value.success++;
            else statistics.value.failed++;

            emit('complete', newValue && !showRules.value);
        }
    })

</script>

<template>
    <va-card stripe :stripe-color=' inProcess ? "secondary" : isSuccess ? "success":"danger"'>
        <va-card-title><va-icon name="spellcheck" class="card-icon"/>{{ props.title }}</va-card-title>
        <va-card-content>

            <template v-if="!word && (statistics.success+statistics.failed)" >
                <task-statistic v-model="statistics"/>
                <va-divider/>
            </template>
            <div class="row" style="min-height: 1vh;"></div>

            <template v-if="!!word">
                <div class="row justify-center">
                    <slot></slot>
                </div>

                <div class="row" style="min-height: 1vh;"></div>
                <div class="va-text-block" v-if="!!word?.context">
                    <span>{{ word?.context }}</span>
                </div>
                <div class="va-text-block" v-for="rule, index in props.rules" v-if="(!inProcess && !isSuccess) || showRules">
                    <va-divider v-if="index > 0"/>
                    <rule :value="rule"/>
                </div>
                <va-divider/>
                <template v-if="props.total > 0">
                    <va-progress-bar size="small" class="progress" :model-value="props.current / props.total * 100"></va-progress-bar>
                    <div class="row" style="min-height: 1vh;"></div>
                </template>
                <div class="row">
                    
                    <va-button preset="secondary" @click="showRules = true" :disabled="!props.rules || props.rules.length == 0 || showRules">Правило</va-button>
                    <va-spacer/>
                    <va-button :disabled="inProcess" class="primary" icon-right="arrow_forward" v-on:click="emit('next')">Дальше</va-button>
                    <va-spacer/>
                    <va-button-dropdown preset="secondary">
                        <va-menu-list>
                            <va-menu-item @selected="emit('report')">Сообщить об ошибке</va-menu-item>
                        </va-menu-list>
                    </va-button-dropdown>
                </div>
            </template>
            <template v-else>
                <va-form>
                    <label class="va-input-label" style="color: var(--va-primary)">Список тем</label>
                    <va-tree-view selectable expand-all :nodes="taskTopicNodes" v-model:checked="task.tags"></va-tree-view>

                    <div class="row" style="min-height: 2vh;"></div>
                    <va-slider label="Количество слов" pins track-label-visible :min="20" :max="50" :step="10" v-model="task.count"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                    <va-slider label="РНО %" pins track-label-visible :min="0" :max="100" :step="10" v-model="task.errors"></va-slider>
                    <div class="row" style="min-height: 2vh;"></div>
                </va-form>
                <va-divider/>
                <div class="row">
                    <va-spacer/>
                    <va-button class="primary" icon-right="arrow_forward" v-on:click="emit('start')">Начать</va-button>
                    <va-spacer/>
                </div>
            </template>

        </va-card-content>
    </va-card>
</template>

<style>
.progress {
    --va-progress-bar-transition: 0.5s;
}
</style>