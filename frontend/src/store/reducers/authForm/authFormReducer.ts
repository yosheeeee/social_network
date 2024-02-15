import {AuthFormState, AuthFromActionType, AuthFromActionTypes, AuthFromType} from "./types";

const defaultState: AuthFormState = {
    is_register: false,
    form_type: AuthFromType.LOGIN,
    loading: false
}

export const authFormReducer = (state = defaultState, action: AuthFromActionType): AuthFormState => {
    switch (action.type) {
        case AuthFromActionTypes.SET_FORM_TYPE:
            if (!action.payload) {
                return {...state, form_type: "login", is_register: action.payload}
            } else {
                return {...state, form_type: "registration", is_register: action.payload}
            }
            break
        case AuthFromActionTypes.SET_LOADING:
            return {...state, loading: action.payload}
        default:
            return state
    }
}