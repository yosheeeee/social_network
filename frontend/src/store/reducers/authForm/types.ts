export enum AuthFromActionTypes{
    SET_FORM_TYPE = "SET_FORM_TYPE",
    SET_LOADING = "SET_LOADING",
}

export enum AuthFromType{
    REGISTRATION = "registration",
    LOGIN = "login"
}

export interface AuthFormState{
    is_register: boolean;
    form_type: string,
    loading: boolean;
}

interface SetLoading{
    type: AuthFromActionTypes.SET_LOADING,
    payload: boolean
}

interface SetFromTypeAction{
    type: AuthFromActionTypes.SET_FORM_TYPE,
    payload: boolean
}

export type AuthFromActionType = SetFromTypeAction | SetLoading
