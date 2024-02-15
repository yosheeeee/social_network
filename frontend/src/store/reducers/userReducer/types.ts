export enum UserActionTypes{
    AUTH_USER = "AUTH_USER",
    LOGOUT_USER = "LOGOUT_USER"
}
interface AuthAction{
    type: UserActionTypes.AUTH_USER,
    payload: {
        token: string,
        id: number
    }
}

interface LogoutUser{
    type: UserActionTypes.LOGOUT_USER
}

export interface UserState{
    isLoggedIn: boolean
    token: string | null
    id: number
}

export type UserAction = AuthAction | LogoutUser
