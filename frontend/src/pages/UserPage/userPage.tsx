import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {BACKEND_PATH} from "../../constants";
import Loader from "../../components/Loader/Loader";
import "./user_page.scss"
import UserBackground from "../../images/user_header_bg.png"
import UserImage from "../../components/UserImage";
import useUserPage from "../../hooks/useUserPage";
import {Outlet, useParams} from "react-router-dom";
import axios from "axios";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import NewPostForm, {PostImages} from "../../modules/new-post-form/newPost";

export default function UserPage() {
    let {
        CurrentTab,
        TabSwitcher,
        loading,
        userData,
        userImageSrc,
        HeaderButton,
        getUserPosts
        } = useUserPage()

    const pageParams = useParams()

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
                <PostForm getUserPosts={getUserPosts} userPageParams={pageParams}/>
                <TabSwitcher/>
                <CurrentTab/>
            </>}
        </div>
    )
}


interface PostFromProps{
    getUserPosts : () => void
    userPageParams: {
        id?: string
    }
}

// форма добавления записи пользователя
function PostForm({getUserPosts, userPageParams} : PostFromProps) {
    const inputFileRef = useRef<HTMLInputElement>(null)
    let [newPostState, setNewPostState] = useState(EditorState.createEmpty())
    let newPostImagesState = useState<FileList | null>(null)
    const user = useTypeSelector(state => state.user)


    // функция отправки нового поста на бэк
    function sendNewPostHandler() {
        if (!newPostState.getCurrentContent().hasText() && newPostImagesState[0] == null) return
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
                newPostImagesState[1](null)
            })
            .catch(e => console.log(e.response))
    }

    function hello({num}:{num: number}) {
        return (
        <>
        
        </>
        )
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
