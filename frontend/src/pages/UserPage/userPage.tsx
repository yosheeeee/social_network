import React, {useEffect, useState} from "react";
import {Link, Params, useParams} from "react-router-dom";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {UserAction, UserActionTypes, UserState} from "../../store/reducers/userReducer/types";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../components/Loader/Loader";
import "./user_page.scss"
import UserBackground from "../../images/user_header_bg.png"
import UserDefaultImage from "../../images/user_default_image.png"
import UserImage from "../../components/UserImage";
import NewPostForm from "../../modules/new-post-form/newPost";
import PostStats, {IPostStats} from "../../components/post-stats/postStats";

type UserPageParams = {
    id: string | undefined
}

export interface UserData{
    user_name: string | null,
    user_login: string | null,
    user_mail?: string | null,
    subscribings:number,
    subscribers:number,
}

export interface UserPost extends IPostStats{
    content: string,
    post_date: number,
}

export default function UserPage() {
    function logout() {
        userDispatch({type: UserActionTypes.LOGOUT_USER})
    }

    let user = useTypeSelector(state => state.user)
    let userDispatch: Dispatch<UserAction> = useDispatch()
    const userPageParams = useParams<UserPageParams>()
    let [loading, setLoading] = useState(false)
    let [userData, setUserData] = useState<UserData>({user_name: null, user_login: null , subscribers: 0, subscribings: 0})
    let [userImageSrc , setUserImageSrc] = useState("")
    let [userPosts, setUserPosts] = useState<UserPost[]>([])


    useEffect(() => {
        setLoading(true)
        axios.get(BACKEND_PATH + '/user/' + userPageParams.id)
            .then(res => res.data as UserData)
            .then(data => {
                setUserData(data)
            })
            .catch(e => {
                console.log(e)
            })
        axios.get(BACKEND_PATH + '/user/image/'+userPageParams.id)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setUserImageSrc(data.file_src)
            })
        axios.get(BACKEND_PATH+'/user/posts/'+userPageParams.id)
            .then(res => res.data.posts as UserPost[])
            .then(data => {setUserPosts(data)
                console.log(data)
            })
        setLoading(false)
    }, [userPageParams]);

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
                        {parseInt(userPageParams.id as string) == user.id && <EditProfileButton/>}
                        {parseInt(userPageParams.id as string) != user.id &&
                           <SubscribeToUser user_id={parseInt(userPageParams.id as string)} current_user={user}/>
                        }
                    </div>
                </div>

                {parseInt(userPageParams.id as string) == user.id && (
                    <>
                        <NewPostForm/>
                    </>
                )}

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

                                // @ts-ignore
                                return (
                                    <div className='user-post' >
                                        <div className="post-date">{date.toLocaleDateString("ru" , {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            weekday: 'long',
                                        })}</div>
                                        <div className='post-content' dangerouslySetInnerHTML={{__html: post.content}}></div>
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

function SubscribeToUser({user_id, current_user}: {user_id: number, current_user:UserState}){
    let [button_text,set_button_text] = useState<any>("")
    let [isSubscribe, set_is_subscribe] = useState(false)
    function onClick(){
        set_button_text(<Loader/>)
        if (!isSubscribe){
            axios.post(BACKEND_PATH+'/user/subscribe',{
                        user_id:user_id
                },
                {
                    headers:{
                        'Authorization': 'Bearer ' + current_user.token
                    }
                }
            )
                .then(res =>res.data)
                .then(data => {
                    set_button_text("Отписаться")
                    set_is_subscribe(true)
                })
                .catch(e => {
                    console.log(e)
                    set_button_text("Ошибка подписки")
                })
        }
        else{
            axios.delete(BACKEND_PATH+'/user/subscribe/'+current_user.id+'/'+user_id,{
                headers:{
                    'Authorization': 'Bearer ' + current_user.token
                }
            }).then(data => {
                set_is_subscribe(false)
                set_button_text("Подписаться")
            }).catch(e => {
                console.log(e)
                set_button_text("Ошибка отписки")
            })
        }
    }

    useEffect(() => {
        set_button_text(<Loader/>)
        axios.get(BACKEND_PATH+'/user/checksubscribe/'+current_user.id+'/'+user_id)
            .then(res => res.data)
            .then(data=> {
                set_is_subscribe(data.result)
                console.log(data)
                if (data.result){
                    set_button_text("Отписаться")
                }else{
                    set_button_text("Подписаться")
                }
            })
            .catch(e => console.log(e))
    }, [user_id, current_user]);

    return (
        <>
            <button className="button rounded accent-color edit-profile-link" onClick={onClick}>{button_text}</button>
        </>
    )
}

function EditProfileButton() {
    return (
        <Link to={'/settings'}
              className="edit-profile-link button rounded accent-color">Редактировать профиль</Link>
    )
}