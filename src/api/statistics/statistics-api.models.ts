import type { Word } from "../words"

interface CommonStat {
    failed: number
    success: number
    total: number
    percent: number
}

export interface UserDayStatistics extends CommonStat{
    recorded_at: Date
}

export interface UserWordStatistics extends CommonStat {
    word: Word
}

export interface TopicStatistics extends CommonStat {
    id: number
    description: string
}
