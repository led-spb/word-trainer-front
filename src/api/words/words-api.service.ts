import type { AxiosInstance } from "axios";
import type { Word } from "./words-api.models";

export class WordsApiService {
    constructor (private axiosInstance: AxiosInstance){}

    public async sendWordReport(word: Word): Promise<null>{
        await this.axiosInstance.put(
            'user/report', {word: word.id}
        )
        return null
    }

    public async getSpellingTask(tags: number[], count :number, errors :number): Promise<Word[]> {
        const response = await this.axiosInstance.get<Word[]>(
            'spellings/task', {
                params: {
                    tags: tags,
                    count: count,
                    errors: Math.trunc(count*errors/100),
                }
            }
        )
        return response.data
    }

    public async getAccentTask(tags: number[], count :number, errors :number): Promise<Word[]>{
        const response = await this.axiosInstance.get<Word[]>(
            'accents/task', {
                params: {
                    tags: tags,
                    count: count,
                    errors: Math.trunc(count*errors/100),
                }
            }
        )
        return response.data
    }

    async getWordByName(name: string): Promise<Word>{
        const response = await this.axiosInstance.get<Word>(
            'words', {
                params: { name }
            }
        )
        return response.data
    }

    async getWordById(id: number): Promise<Word>{
        const response = await this.axiosInstance.get<Word>(`words/${id}`)
        return response.data
    }

}
