import type { Word } from "../words"

export interface Statistic {
    failed: number
    success: number
    total: number
    percent: number
}

export interface UserDayStatistics extends Statistic{
    recorded_at: Date
}

export interface UserWordStatistics extends Statistic {
    word: Word
}

export interface TopicStatistics extends Statistic {
    id?: number
    description: string
}
