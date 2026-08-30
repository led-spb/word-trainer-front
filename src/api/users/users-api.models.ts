
export interface User {
    id: number
    email: string
    name: string
    dailyGoal: number
    avatar: string
}

export interface UserToken {
    accessToken: string
}

interface CommonProgress {
    learned: number
    total: number
}

export interface UserProgress {
    series: number
    overall: CommonProgress
    today: CommonProgress
}


export interface UserSubscriptionInfo {
    publicKey: string
}