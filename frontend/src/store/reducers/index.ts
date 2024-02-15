import {combineReducers} from "redux";
import {userReducer} from "./userReducer/userReducer";
import {authFormReducer} from "./authForm/authFormReducer";


export const reducer = combineReducers({
    user: userReducer,
    authForm: authFormReducer
})

export type RootState = ReturnType<typeof reducer>