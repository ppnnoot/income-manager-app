
export type User = {
    email: string
    password: string
    id?: number
    token?: string
}

export type Message = {
    message: string
}

export interface Token {
    userId: string;       
    token: string;        
    createdAt: Date;      
    expiresAt: Date;      
}