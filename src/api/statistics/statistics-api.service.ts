import type { TopicStatistics, UserDayStatistics, UserWordStatistics } from './statistics-api.models'
import type { AxiosInstance } from "axios"


interface UpdateUserStat {
    success? :number[]
    failed? :number[]
}

export class StatisticsApiService {
    constructor (private axiosInstance: AxiosInstance){}

    async getUserStat(): Promise<UserDayStatistics[]> {
        const response = await this.axiosInstance.get<UserDayStatistics[]>('user/stat')

        return response.data.map( (value: any) => {
            value.recorded_at = new Date(value.recorded_at)
            value.recorded_at.setHours(0, 0, 0, 0)
            return value
        } )
    }
    
    async getUserTrobles(): Promise<UserWordStatistics[]>{
        const response = await this.axiosInstance.get<UserWordStatistics[]>('user/stat/words')
        return response.data
    }

    async updateUserStat(data :UpdateUserStat): Promise<null>{
        await this.axiosInstance.put('user/stat', data )
        return null
    }

    async getTopicStatistics(): Promise<TopicStatistics[]>{
        const response = await this.axiosInstance.get<TopicStatistics[]>('user/stat/topics')
        return response.data
    }
}
