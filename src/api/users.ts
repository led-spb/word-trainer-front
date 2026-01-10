import { axiosInstance } from './config'

const usersApi = {

    async getCurrentUser(callback: ((data: any) => void) | undefined){
        const response = await axiosInstance({
            method: 'get',
            url: 'user',
        })
        if (callback)
            callback(response.data)
    },

    async getToken(login :string, password: string, callback: ((data: any) => void) | undefined) {
        const response = await axiosInstance({
            method: 'post',
            url: 'auth/token',
            data: {
                login: login,
                password: password,
            }
        })
        if (callback)
            callback(response.data)
    },

    async getUserStat(callback: ((data: any) => void) | undefined) {
        const response = await axiosInstance({
            method: 'get',
            url: 'user/stat',
        })
        if (callback)
            callback(response.data)
    },

    async sendUserStat(success: Array<Number>, failed: Array<Number> ){
        await axiosInstance({
            method: 'put',
            url: 'user/stat',
            data: {success: success, failed: failed}
        })
    }
}

export { usersApi }