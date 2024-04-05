import React, {useEffect, useState} from "react";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../components/Loader/Loader";
import "./user_page.scss"
import UserBackground from "../../images/user_header_bg.png"
import UserImage from "../../components/UserImage";
import useUserPage, {IUserData, UserPageParams, IUserPost, RemovePost} from "../../hooks/useUserPage";
import PostStats from "../../components/post-stats/postStats";
import {Outlet, useParams} from "react-router-dom";
import axios from "axios";
import Slider from "../../components/Slider/slider";
import {useTypeSelector} from "../../hooks/useTypeSelector";

export default function UserPage() {
    let {
        CurrentTab,
        TabSwitcher,
        loading,
        userData,
        userImageSrc,
        PostForm,
        HeaderButton,
        } = useUserPage()




    return (
        <div id="userpage">
            {loading && <Loader/>}
            {!loading && <>
                <div className="user-header">
                    <img src={UserBackground}
                         className="header-background"/>
                    <div className="header-data">
                        <div className="user-data">
                            <UserImage file_src={BACKEND_PATH + '/static' + userImageSrc}/>
                            <p>{userData.user_name}</p>
                            <p className="color-blue">@{userData.user_login}</p>
                            <p className='user-sub'>
                                <span>Подписчики: <span className="color-blue bold">{userData.subscribers}</span></span>
                                <span>Подписки: <span className="color-blue bold">{userData.subscribings}</span></span>
                            </p>
                        </div>
                        <HeaderButton/>
                    </div>
                </div>
                <Outlet/>
                <PostForm/>
                <TabSwitcher/>
                <CurrentTab/>
            </>}
        </div>
    )
}

