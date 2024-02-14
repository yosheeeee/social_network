import {UserAction, UserActionTypes, UserState} from "./types";

const initialState: UserState = {
    token: null,
    isLoggedIn: false
}
export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.AUTH_USER:
            return {...state, isLoggedIn: true, token: action.payload.token}
        default:
            return state
    }
}