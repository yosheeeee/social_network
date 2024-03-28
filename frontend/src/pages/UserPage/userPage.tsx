import React, {useEffect, useState} from "react";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../components/Loader/Loader";
import "./user_page.scss"
import UserBackground from "../../images/user_header_bg.png"
import UserImage from "../../components/UserImage";
import useUserPage, {UserData, UserPageParams, UserPost} from "../../hooks/useUserPage";
import PostStats from "../../components/post-stats/postStats";
import {Outlet} from "react-router-dom";



export default function UserPage() {
    let {loading , userData  , userImageSrc , PostForm , HeaderButton , userPosts} = useUserPage()


    return (
        <div id="userpage">
            {loading && <Loader/>}
            {!loading && <>
                <div className="user-header">
                    <img src={UserBackground} className="header-background"/>
                    <div className="header-data">
                        <div className="user-data">
                            <UserImage file_src={BACKEND_PATH + '/static'+userImageSrc}/>
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

                <div id="user-posts">
                    <h2>Записи пользователя:</h2>


                    {userPosts.length == 0 ? <h3>Записи отсутстуют</h3> :

                        userPosts.map(post => {
                                let date = new Date(post.post_date)
                                let options = {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'long',
                                    timezone: 'UTC',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                };

                                return (
                                    <div className='user-post'>
                                        <div className="post-date">{`${date.getHours()}:${date.getMinutes()}`}, {date.toLocaleDateString("ru", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            weekday: 'long',
                                        })}</div>
                                        <div className='post-content'
                                             dangerouslySetInnerHTML={{__html: post.content}}></div>
                                        <PostStats {...post}/>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </>}
        </div>
    )
}
