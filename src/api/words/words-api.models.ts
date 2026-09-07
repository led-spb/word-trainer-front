export type Accent = number

export interface Spelling {
    id: number
    position: number
    length: number
    variants: string[]
    selected: string
}

export interface Word {
    id: number
    fullword: string
    context: string
    description: string
    selected: number
    result: boolean

    rules: number[]
    topics: number[]

    accents: Accent[]
    spellings: Spelling[]
}
