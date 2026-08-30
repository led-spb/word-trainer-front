import { axiosInstance } from './config'

const tagsApi = {

    async getTagsDictionary(){
        const response = await axiosInstance({
            method: 'get',
            url: 'tags',
        })
        return response.data
    },
}

export { tagsApi }

