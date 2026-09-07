export interface Task {
    id: number
    name: string
    executed_at?: Date
    topics?: number[]
    word_count: number
    repeat_count: number
}