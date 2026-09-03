import { axiosInstance } from './config'


export interface Rule {
    id: number
    title: string
    description: string
    type: "accent"|"spelling"
}

const rulesApi = {
    async getRuleById(ruleId :number): Promise<Rule>{
        const response = await axiosInstance({
            method: 'get',
            url: `rules/${ruleId}`,
        })
        return response.data
    },

    async getRules(title :string|null = null, page :number = 1, limit :number = 10) {
        const response = await axiosInstance({
            method: 'get',
            url: 'rules',
            params: { title: title, page: page, limit: limit }
        })
        return response.data
    },
}

export { rulesApi }
