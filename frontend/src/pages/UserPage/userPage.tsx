import React, {useEffect, useState} from "react";
import {Link, Params, useParams} from "react-router-dom";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {UserAction, UserActionTypes} from "../../store/reducers/userReducer/types";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../components/Loader/Loader";
import "./user_page.scss"
import UserBackground from "../../images/user_header_bg.png"
import UserDefaultImage from "../../images/user_default_image.png"
import UserImage from "../../components/UserImage";

type UserPageParams = {
    id: string | undefined
}

export interface UserData {
    user_name: string | null,
    user_login: string | null,
}

export default function UserPage() {
    function logout() {
        userDispatch({type: UserActionTypes.LOGOUT_USER})
    }

    let user = useTypeSelector(state => state.user)
    let userDispatch: Dispatch<UserAction> = useDispatch()
    const userPageParams = useParams<UserPageParams>()
    let [loading, setLoading] = useState(false)
    let [userData, setUserData] = useState<UserData>({user_name: null, user_login: null})

    useEffect(() => {
        setLoading(true)
        axios.get(BACKEND_PATH + '/user/' + userPageParams.id)
            .then(res => res.data as UserData)
            .then(data => {
                setUserData(data)
                setLoading(false)
            })
            .catch(e => {
                console.log(e)
                setLoading(false)
            })
    }, [userPageParams]);

    return (
        <div id="userpage">
            {loading && <Loader/>}
            {!loading && <>
                <div className="user-header">
                    <img src={UserBackground} className="header-background"/>
                    <div className="header-data">
                        <div className="user-data">
                            <UserImage file_src={UserDefaultImage as string}/>
                            <p>{userData.user_name}</p>
                            <p className="color-blue">@{userData.user_login}</p>
                        </div>
                        {parseInt(userPageParams.id as string) == user.id && <EditProfileButton/>}
                        {parseInt(userPageParams.id as string) != user.id &&
                           <SubscribeToUser subscribe_to_id={parseInt(userPageParams.id as string)} current_user_id={user.id}>Подписаться</SubscribeToUser>
                        }
                    </div>
                </div>
            </>}
        </div>
    )
}

function SubscribeToUser({subscribe_to_id,current_user_id,children}: {children: any,subscribe_to_id : number , current_user_id: number}){
    function onClick(){

    }

    return (
        <>
            <button className="button rounded accent-color edit-profile-link" onClick={onClick}>{children}</button>
        </>
    )
}

function EditProfileButton() {
    return (
        <Link to={'/settings'}
              className="edit-profile-link button rounded accent-color">Редактировать профиль</Link>
    )
}