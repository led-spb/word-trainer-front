import { axiosInstance } from './config'

export interface Topic {
    id: number
    description: string
    parent_id?: number
    type: "accent"|"spelling"
}


const topicsApi = {
    async getTopicsDictioary(): Promise<Topic[]>{
        const response = await axiosInstance({method: 'get', url: 'tags', })
        return response.data
    },
}

export { topicsApi }
