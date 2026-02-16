import type { User, UserToken, UserProgress, UserSubscriptionInfo } from "./users-api.models"
import { type AxiosInstance, AxiosError } from "axios"


export class UsersApiService {
    constructor (private axiosInstance: AxiosInstance){}

    async getCurrentUser(): Promise<User> {
        const response = await this.axiosInstance.get<User>('user')
        return response.data
    }

    async getToken(email :string, password: string ): Promise<UserToken> {
        const response = await this.axiosInstance<UserToken>({
            method: 'post',
            url: 'auth/token',
            data: { email, password },

            validateStatus: (status: number) => {
                return status == 200 || status == 401
            }
        })
        if( response.status == 401 ){
            const err = new AxiosError("User unauthorized", "401")
            err.status = 401
            throw err
        }
        return response.data
    }

    async updateUserAvatar(image :Blob): Promise<User>{
        const formData = new FormData();
        formData.append('file', image, 'avatar.jpg')

        const response = await this.axiosInstance.post<User>('user/avatar', formData)
        return response.data
    }

    async getUserProgress(): Promise<UserProgress>{
        const response = await this.axiosInstance.get<UserProgress>('user/progress')
        return response.data
    }

    async updateUserInfo(user :User): Promise<User> {
        const response = await this.axiosInstance.put<User>(
            'user',
            {name: user.name, dailyGoal: user.dailyGoal}
        )
        return response.data
    }

    async registerWebPush(data :any): Promise<null> {
        await this.axiosInstance.post('user/push/register', data)
        return null
    }

    async unregisterWebPush(data :any): Promise<null> {
        await this.axiosInstance.post('user/push/unregister', data)
        return null
    }

    async getSubscriptionKey(): Promise<UserSubscriptionInfo> {
        const response = await this.axiosInstance.get<UserSubscriptionInfo>('user/push/key')
        return response.data
    }
}