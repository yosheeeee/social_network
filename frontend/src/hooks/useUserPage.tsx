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

export type UserPageParams = {
    id: string | undefined
}

export interface UserData {
    user_name: string | null,
    user_login: string | null,
    user_mail?: string | null,
    subscribings: number,
    subscribers: number,
}

export interface UserPost extends IPostStats {
    content: string,
    post_date: number,
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
    let [userData, setUserData] = useState<UserData>({
        user_name: null,
        user_login: null,
        subscribers: 0,
        subscribings: 0
    })
    let [userImageSrc, setUserImageSrc] = useState("")
    let [userPosts, setUserPosts] = useState<UserPost[]>([])

    //подгрузка данных о пользователе
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
        axios.get(BACKEND_PATH + '/user/image/' + userPageParams.id)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setUserImageSrc(data.file_src)
            })
        getUserPosts()
        setLoading(false)
    }, [userPageParams]);



    //получение данных о пользователе с бека
    function getUserPosts() {
        axios.get(BACKEND_PATH + '/user/posts/' + userPageParams.id)
            .then(res => res.data.posts as UserPost[])
            .then(data => {
                setUserPosts(data)
            })
    }

    // форма добавления записи пользователя
    function PostForm() {
        const inputFileRef = useRef<HTMLInputElement>(null)
        let [newPostState, setNewPostState] = useState(EditorState.createEmpty())
        let newPostImagesState = useState<FileList | null>(null)

        // функция отправки нового поста на бэк
        function sendNewPostHandler() {
            if (!newPostState.getCurrentContent().hasText()) return
            let filesFormData = new FormData()
            if (newPostImagesState[0] != null) {

                for (let i = 0; i < newPostImagesState[0]?.length; i++) {
                    filesFormData.append('post_file_' + i, newPostImagesState[0][i])
                }
            }
            filesFormData.append('post_content', draftToHtml(convertToRaw(newPostState.getCurrentContent())))
            axios.post(BACKEND_PATH + '/user/post',
                filesFormData,
                {
                    headers: {
                        Authorization: "Bearer " + user.token
                    }
                })
                .then(res => res.data)
                .then(data => {
                    console.log(data)
                    getUserPosts()
                    setNewPostState(EditorState.createEmpty())
                })
                .catch(e => console.log(e.response))
        }

        function openFilesInput() {
            // @ts-ignore
            inputFileRef.current.click()
        }

        function changeInputFiles(e: ChangeEvent<HTMLInputElement>) {
            if (e.target.files !== null && e.target.files.length > 10) {
                alert('Максимальное количество файлов 10')
                return
            }
            if (e.target.files !== null) {
                for (let i = 0; i < e.target.files.length; i++) {
                    if (!e.target.files[i].type.includes('image')) {
                        alert(`Файл №${i + 1} не является изображениeм`)
                        return
                    }
                }
            }
            newPostImagesState[1](e.target.files)
        }

        function clearImages() {
            newPostImagesState[1](null)
        }


        return (
            <>
                {parseInt(userPageParams.id as string) == user.id && (
                    <>
                        <NewPostForm
                            editorValue={newPostState}
                            setEditorValue={setNewPostState}
                        />
                        <input type="file"
                               name="post-files"
                               id="post-files"
                               accept=".png,.jpg,.jpeg,.gif"
                               multiple={true}
                               onChange={changeInputFiles}
                               ref={inputFileRef}/>

                        <PostImages images={newPostImagesState[0]}/>
                        <div className="btns">
                            <button className="button rounded post-files"
                                    onClick={openFilesInput}><i className="fa-solid fa-images"></i></button>
                            {newPostImagesState[0] !== null && <button className="rounded button"
                                                                       onClick={clearImages}>
                                <i className='fa-solid fa-xmark'></i>
                            </button>}
                            <button className={'button rounded'}
                                    onClick={sendNewPostHandler}>Написать
                            </button>
                        </div>
                    </>
                )}
            </>

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


    return {userImageSrc, userData, PostForm, HeaderButton, loading, userPosts}
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
