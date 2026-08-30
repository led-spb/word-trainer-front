import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { rulesApi } from '@/api/rules'


export const useRuleStore = defineStore('rules', () => {
    const rules = ref<any[]>([])

    const ruleById = computed(() => {
        return (ruleId :number) => {
            const rule = rules.value.find( (item: any) => item.id == ruleId )
            if( rule ){
                return rule;
            }

            rulesApi.getRuleById(ruleId).then( (data: any) => {
                rules.value.push(data);
            })
        }
    })

    function setRules(data: any[]){
        rules.value = data
    }

    return { ruleById, rules, setRules }
})
