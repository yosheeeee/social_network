import React, {ChangeEvent, useRef, useState} from "react";
import FeedPost from "../../components/feed-post/feedPost";
import {IFeedPost, IUserPost} from "../../hooks/useUserPage";
import "./feed.scss"
import NewPostForm, {PostImages} from "../../modules/new-post-form/newPost";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import {useTypeSelector} from "../../hooks/useTypeSelector";

export function Feed() {
    const [posts, setPosts] = useState<IFeedPost[]>([
        {
            user_name: "Антипин Егор",
            user_login: "admin",
            comments: 0,
            likes: 0,
            subscribings: 5,
            user_mail: "test@email.com",
            id: 20,
            post_date: 0,
            user_image_src: '/20/user_image.gif',
            content: "<p>Hello world</p>",
            subscribers: 0,
            user_id: 20
        },
        {
            user_name: "Антипин Егор",
            user_login: "admin",
            comments: 0,
            likes: 0,
            subscribings: 5,
            user_mail: "test@email.com",
            id: 20,
            post_date: 0,
            user_image_src: '/20/user_image.gif',
            content: "<p>Hello world</p>",
            subscribers: 0,
            user_id: 20
        }
    ])
    const user = useTypeSelector(state => state.user)

    return (
        <div id={'feed-page'}>
            <h1>Главная страница</h1>
            <PostForm/>
            <h2>Новые записи:</h2>
            <div className="posts">
                {posts.map(post => <FeedPost {...post}/>)}
            </div>
        </div>
    )

    //получение данных о пользователе с бека
    function getUserPosts() {
        axios.get(BACKEND_PATH + '/user/feed/' + user.id)
            .then(res => res.data.posts as IFeedPost[])
            .then(data => {
                setPosts(data)
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
                {user.isLoggedIn && (
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
}

