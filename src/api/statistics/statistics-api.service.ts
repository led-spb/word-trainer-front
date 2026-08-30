import type { UserDayStatistics, UserWordStatistics } from './statistics-api.models'
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

    async getTagsStat(): Promise<any> {
        const response = await this.axiosInstance.get('user/stat/tags')

        return response.data
    }
}
