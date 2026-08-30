import type { User } from "../users";

export interface UserRating{
    user: User
    success: number
    failed: number
    total: number
    progress: number
    progress_pct: number
}
