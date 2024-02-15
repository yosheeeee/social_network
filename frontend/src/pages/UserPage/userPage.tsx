import React from "react";
import {useParams} from "react-router-dom";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {UserAction, UserActionTypes} from "../../store/reducers/userReducer/types";

export default function UserPage(){
    function logout(){
        userDispatch({type: UserActionTypes.LOGOUT_USER})
    }
    let user = useTypeSelector(state => state.user)
    let userDispatch : Dispatch<UserAction> = useDispatch()
    const data = useParams()
    console.log(data.id)
    return(
        <h1>Страница пользователя (<button onClick={logout}>Выйти</button>)</h1>

    )
}