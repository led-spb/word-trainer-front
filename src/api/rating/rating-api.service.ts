import type { AxiosInstance } from "axios";
import type { UserRating } from "./rating-api.models";


export class RatingApiService{
    constructor (private axiosInstance: AxiosInstance){}

    async getUserRating(): Promise<UserRating[]> {
        const response = await this.axiosInstance.get('user/rating')
        return response.data
    }

}