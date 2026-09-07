import type { AxiosInstance } from "axios"
import type { Task } from "./tasks-api.models"
import type { Word } from "../words"

export class TasksApiService {
    constructor (private axiosInstance: AxiosInstance){}

    async getUserTasks(): Promise<Task[]>{
        const response = await this.axiosInstance.get<Task[]>('tasks')
        return response.data.map( (value: any) => {
            if(value.executed_at){
                value.executed_at = new Date(value.executed_at)
            }
            return value
        } )
    }

    async getTaskContent(taskId: number): Promise<Word[]>{
        const response = await this.axiosInstance.get<Word[]>(`tasks/${taskId}`)
        return response.data
    }

    async makeTaskContent(word_count: number, repeat_count: number, topics: number[]): Promise<Word[]>{
        const response = await this.axiosInstance.get<Word[]>('tasks/prepare', {
            params: {
                word_count, repeat_count, topics
            }
        })
        return response.data
    }

    async completeTask(taskId: number): Promise<undefined>{
        await this.axiosInstance.put(`tasks/${taskId}/complete`)
    }
}
