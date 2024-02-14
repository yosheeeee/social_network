import {combineReducers} from "redux";
import {userReducer} from "./userReducer/userReducer";


export const reducer = combineReducers({
    user: userReducer
})

export type RootState = ReturnType<typeof reducer>