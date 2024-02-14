export enum UserActionTypes{
    AUTH_USER = "AUTH_USER"
}
interface AuthAction{
    type: UserActionTypes.AUTH_USER,
    payload: {
        token: string
    }
}

export interface UserState{
    isLoggedIn: boolean
    token: string | null
}

export type UserAction = AuthAction
