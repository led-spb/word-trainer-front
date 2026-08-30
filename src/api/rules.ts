import { axiosInstance } from './config'

const rulesApi = {
    async getRuleById(ruleId :number){
        const response = await axiosInstance({
            method: 'get',
            url: `rules/${ruleId}`,
        })
        return response.data
    },

    async getRules(title :string|null = null, page :number = 1, limit :number = 10){
        const response = await axiosInstance({
            method: 'get',
            url: 'rules',
            params: { title: title, page: page, limit: limit }
        })
        return response.data
    },

}

export { rulesApi }
