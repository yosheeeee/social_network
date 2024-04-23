import {UserAction, UserActionTypes, UserState} from "../store/reducers/userReducer/types";
import {useTypeSelector} from "./useTypeSelector";
import {Dispatch} from "redux";
import {useDispatch} from "react-redux";
import {Link, useParams} from "react-router-dom";
import React, {ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import {convertToRaw, EditorState} from "draft-js";
import axios from "axios";
import {BACKEND_PATH} from "../constants";
import draftToHtml from "draftjs-to-html";
import PostStats, {IPostStats} from "../components/post-stats/postStats";
import NewPostForm, {PostImages} from "../modules/new-post-form/newPost";
import Loader from "../components/Loader/Loader";
import FeedPost from "../components/feed-post/feedPost";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;
import Slider from "../components/Slider/slider";

export type UserPageParams = {
    id: string | undefined
}

export interface IUserData {
    user_name: string | null,
    user_login: string | null,
    user_mail?: string | null,
    subscribings: number,
    subscribers: number,
}

export interface IUserPost extends IPostStats {
    content: string,
    post_date: number,
}

export interface IFeedPost extends IUserPost, IUserData{
    user_image_src: string,
    user_id: number
}

export default function useUserPage() {

    // фнукция выхода из аккаунта
    function logout() {
        userDispatch({type: UserActionTypes.LOGOUT_USER})
    }

    let user = useTypeSelector(state => state.user)
    let userDispatch: Dispatch<UserAction> = useDispatch()
    const userPageParams = useParams<UserPageParams>()
    let [loading, setLoading] = useState(false)
    let [userData, setUserData] = useState<IUserData>({
        user_name: null,
        user_login: null,
        subscribers: 0,
        subscribings: 0
    })
    let [userImageSrc, setUserImageSrc] = useState("")
    let [userPosts, setUserPosts] = useState<IUserPost[] | IFeedPost[]>([])
    let [currentTab, setCurrentTab] = useState('userPosts')

    //подгрузка данных о пользователе
    useEffect(() => {
        setLoading(true)
        axios.get(BACKEND_PATH + '/user/' + userPageParams.id)
            .then(res => res.data as IUserData)
            .then(data => {
                setUserData(data)
            })
            .catch(e => {
                console.log(e)
            })
        axios.get(BACKEND_PATH + '/user/image/' + userPageParams.id)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setUserImageSrc(data.file_src)
            })
        getUserPosts()
        setCurrentTab('userPosts')
        setLoading(false)
    }, [userPageParams]);

    // получение комментируемых постов
    function getCommentedPosts(){
        setLoading(true)
        axios.get(BACKEND_PATH + `/user/${userPageParams.id}/commented-posts`)
            .then(res => res.data.posts as IFeedPost[])
            .then(data => setUserPosts(data))
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    // получение лайкнутых постов
    function getLikedPosts(){
        setLoading(true)
        axios.get(BACKEND_PATH + `/user/${userPageParams.id}/liked-posts`)
            .then(res => res.data.posts as IFeedPost[])
            .then(data => setUserPosts(data))
            .catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    //получение данных о пользователе с бека (постов пользователя)
    function getUserPosts() {
        axios.get(BACKEND_PATH + '/user/posts/' + userPageParams.id)
            .then(res => res.data.posts as IUserPost[])
            .then(data => {
                setUserPosts(data)
            })
    }


    useEffect(() => {
        switch (currentTab){
            case "userPosts":
                getUserPosts()
                break
            case "userLikedPosts":
                getLikedPosts()
                break
            case "userCommentedPosts":
                getCommentedPosts()
                break
        }
    }, [currentTab]);

    function CurrentTab(){
        switch (currentTab){
            case "userPosts":
                return (
                    <div id="user-posts">
                        <h2>Записи пользователя:</h2>
                        {userPosts.length == 0 ? <h3>Записи отсутстуют</h3> :
                            userPosts.map(post => <PostTemplate {...post}/>)
                        }
                    </div>
                )
            case "userLikedPosts":
                return (
                    <div id="user-likes-posts">
                        <h2>Понравившиеся записи:</h2>
                        {userPosts.length == 0 ? <h3>Записи отсутстуют</h3> :
                            userPosts.map(post => <FeedPost {...post as IFeedPost} updatePosts={getLikedPosts}/>)
                        }
                    </div>
                )
            case "userCommentedPosts":
                return (
                    <div id="user-commented-posts">
                        <h2>Прокомментированные записи:</h2>
                        {userPosts.length == 0 ? <h3>Записи отсутстуют</h3> :
                            userPosts.map(post => <FeedPost {...post as IFeedPost} updatePosts={getCommentedPosts}/>)
                        }
                    </div>
                )
            default:
                return (<></>)
        }
    }

    function TabSwitcher(){
        return (
            <div className="tab-switcher">
                <button className={'button rounded' + (currentTab == 'userPosts' ? ' active' : '')}
                        onClick={() => {
                            if (currentTab != 'userPosts') {
                                setCurrentTab('userPosts')
                            }
                        }}>Посты
                </button>
                <button
                    onClick={() => {
                        if (currentTab != 'userLikedPosts') {
                            setCurrentTab('userLikedPosts')
                        }
                    }}
                    className={'button rounded' + (currentTab == 'userLikedPosts' ? ' active' : '')}>Лайки
                </button>
                <button className={'button rounded' + (currentTab == 'userCommentedPosts' ? ' active' : '')}
                        onClick={() => {
                            if (currentTab != 'userCommentedPosts') {
                                setCurrentTab('userCommentedPosts')
                            }
                        }}
                >Комментарии
                </button>
            </div>
        )
    }

    // Вывод кнопки подписаться/редактировать профиль в хедере страницы пользователя
    function HeaderButton() {
        return (
            <>
                {parseInt(userPageParams.id as string) == user.id && <EditProfileButton/>}
                {parseInt(userPageParams.id as string) != user.id &&
                    <SubscribeToUser user_id={parseInt(userPageParams.id as string)}
                                     current_user={user}/>
                }
            </>
        )
    }

     function PostTemplate(post: IUserPost) {
        const userPageParams = useParams<UserPageParams>()
        const user = useTypeSelector(state => state.user)
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

        const [postImagesSrc, setPostImagesSrc] = useState<{ file_src: string }[]>([])

        useEffect(() => {
            axios.get(BACKEND_PATH + '/post/images/' + post.id)
                .then(res => {
                    console.log(res.data)
                    return res.data.images
                })
                .then(images => setPostImagesSrc(images))
        }, [post]);

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
                {
                    postImagesSrc.length ?

                        <div className="post-images">
                            <Slider elementsOnPage={3}>
                                {postImagesSrc.map(image => <div><img src={BACKEND_PATH + '/static/' + image.file_src}
                                                                      alt="post-image"/></div>)}
                            </Slider>
                        </div>
                        :
                        <>
                        </>

                }
                <PostStats {...post}/>
                {user.isLoggedIn && user.id.toString() == userPageParams.id && <RemovePost post_id={post.id} updatePosts={getUserPosts} user_token={user.token as string}/>}
            </div>
        )
    }

    return {userImageSrc, userData, HeaderButton, loading, userPosts, CurrentTab ,TabSwitcher , PostTemplate, getUserPosts}
}

// кнопка подписки на пользователя
function SubscribeToUser({user_id, current_user}: { user_id: number, current_user: UserState }) {
    let [button_text, set_button_text] = useState<any>("")
    let [isSubscribe, set_is_subscribe] = useState(false)

    function onClick() {
        set_button_text(<Loader/>)
        if (!isSubscribe) {
            axios.post(BACKEND_PATH + '/user/subscribe', {
                    user_id: user_id
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + current_user.token
                    }
                }
            )
                .then(res => res.data)
                .then(data => {
                    set_button_text("Отписаться")
                    set_is_subscribe(true)
                })
                .catch(e => {
                    console.log(e)
                    set_button_text("Ошибка подписки")
                })
        } else {
            axios.delete(BACKEND_PATH + '/user/subscribe/' + current_user.id + '/' + user_id, {
                headers: {
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
        axios.get(BACKEND_PATH + '/user/checksubscribe/' + current_user.id + '/' + user_id)
            .then(res => res.data)
            .then(data => {
                set_is_subscribe(data.result)
                console.log(data)
                if (data.result) {
                    set_button_text("Отписаться")
                } else {
                    set_button_text("Подписаться")
                }
            })
            .catch(e => console.log(e))
    }, [user_id, current_user]);

    return (
        <>
            <button className="button rounded accent-color edit-profile-link"
                    onClick={onClick}>{button_text}</button>
        </>
    )
}

// кнопка редактирования профиля
function EditProfileButton() {
    return (
        <Link to={'/settings'}
              className="edit-profile-link button rounded accent-color">Редактировать профиль</Link>
    )
}

export function RemovePost({user_token, post_id  , updatePosts} : {user_token: string, post_id : number, updatePosts : Function}){

    function clickHandler(){
        if (window.confirm("Вы действительно хотите удалить данный пост?")){
            axios.delete(BACKEND_PATH + '/post/' + post_id,{
                    headers: {
                        Authorization: 'Bearer ' + user_token
                    }
                }
            ).then(res => updatePosts())
                .catch(e => console.log(e))
        }
    }

    return (
        <button id="delete-post" onClick={clickHandler}>
            <i className="fa-solid fa-trash-can"></i>
        </button>
    )
}
