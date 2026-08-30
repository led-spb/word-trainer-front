import type { AxiosInstance } from "axios";
import type { User } from '../users'
import type { UserRegister } from './invite-api.models'


export class InviteApiService{
    constructor (private axiosInstance: AxiosInstance){}

    async checkInvite(invite :String): Promise<boolean> {
        const response = await this.axiosInstance({
            method: 'get',
            url: 'invites/'+String(invite)
        })
        return response.data.status
    }

    async registerUser(data :UserRegister): Promise<boolean>{
        const response = await this.axiosInstance.post(
            'user', data, {
                validateStatus: (status) => status == 204 || status == 400
            }
        )
        return response.status == 204
    }
}