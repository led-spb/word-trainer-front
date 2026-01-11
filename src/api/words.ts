import { axiosInstance } from './config'

const wordsApi = {
    async getSpellingTask(count :Number, minLevel :Number, maxLevel :Number, callback: ((data: any) => void) | undefined){
        const response = await axiosInstance({
            method: 'get',
            url: 'spellings/task',
            params: {
                count: count,
                min: minLevel,
                max: maxLevel,
            }
        })
        if (callback)
            callback(response.data)
    }
}

export { wordsApi }

