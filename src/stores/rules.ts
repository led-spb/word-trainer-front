import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { rulesApi, type Rule } from '@/api/rules'


export const useRuleStore = defineStore('rules', () => {
    const rules = ref<Rule[]>([])

    const loadRule = async (ruleId: number) => {
        const rule = rules.value.find( item => item.id == ruleId)
        if( rule == undefined ){
            rules.value.push( await rulesApi.getRuleById(ruleId) )
        }
    }

    return { rules, loadRule }
})
