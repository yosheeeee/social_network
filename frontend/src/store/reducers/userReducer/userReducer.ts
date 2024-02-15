import {UserAction, UserActionTypes, UserState} from "./types";
import {useLocalStorage} from "../../../hooks/useLocalStorage";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";


const initialState: UserState = {
    token: null,
    isLoggedIn:  false,
    id: -1
}
export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.AUTH_USER:
            return {...state, isLoggedIn: true, token: action.payload.token, id: action.payload.id}
        case UserActionTypes.LOGOUT_USER:
            return initialState
        default:
            return state
    }
}

