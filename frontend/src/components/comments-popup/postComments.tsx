import Popup from "../popup/Popup";
import React, {SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import Loader from "../Loader/Loader";
import "./post-comments.scss"
import {Link, useHref, useNavigate, useParams} from "react-router-dom";
import TextEditor from "../TextEditor";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";

interface CommentState {
    comment_id: number
    user_name: string,
    user_id: number,
    user_image: string,
    comment_content: string,
    comment_date: string,
}

export default function PostComments() {
    const [commentsData, setCommentsData] = useState<CommentState[]>([])
    const [loading, setLoading] = useState(false)
    let {postId} = useParams()
    const user = useTypeSelector(state => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        loadComments()
    }, []);


    function loadComments() {
        setLoading(true)
        axios.get(BACKEND_PATH + '/comments/' + postId)
            .then(res => res.data.comments as CommentState[])
            .then(data => setCommentsData(data))
            .catch(e => console.log(e))
        setLoading(false)
    }


    function closePopup(elem: boolean) {
        navigate('..')
    }


    function DeleteCommentButton({comment_id, user_id}: { comment_id: number, user_id: number }) {
        function clickHandler() {
            if (window.confirm("Вы действительно хотите удалить данный комментарий?")){
                axios.delete(BACKEND_PATH + '/comments/' + comment_id,
                    {
                        headers: {
                            Authorization: 'Bearer ' + user.token
                        }
                    })
                    .then(res => loadComments())
                    .catch(e => console.log(e))
            }
        }

        if (user.isLoggedIn && user_id == user.id) {
            return (
                <button id="delete-comment"
                        onClick={clickHandler}>
                    <i className="fa-solid fa-trash-can"></i>
                </button>
            )
        } else {
            return (<></>)
        }
    }

    return (
        <Popup showPopup={true}
               setShowPopup={closePopup}>
            {loading ? <Loader/> : (
                <>
                    <AddComentForm post_id={parseInt(postId as string)}
                                   loadComments={loadComments}/>
                    <div id="comments">
                        <h2>{commentsData.length == 0 ? "Комментарии отсутствуют" : "Комментарии"}</h2>
                        {commentsData.map(commentData => <div className="comment">
                            <Link className="comment-header"
                                  to={'/user/' + commentData.user_id}>
                                <img src={BACKEND_PATH + '/static' + commentData.user_image}
                                     alt="user_image"/>
                                <p> {commentData.user_name}  </p>
                            </Link>
                            <div className="comment-content"
                                 dangerouslySetInnerHTML={{__html: commentData.comment_content}}>
                            </div>
                            <DeleteCommentButton comment_id={commentData.comment_id}
                                                 user_id={commentData.user_id}/>
                        </div>)}
                    </div>
                </>
            )}
        </Popup>
    )
}


function AddComentForm({post_id, loadComments}: { post_id: number, loadComments: Function }) {
    const user = useTypeSelector(state => state.user)
    const [editorValue, setEditorValue] = useState(EditorState.createEmpty())

    function submitHandler() {
        if (editorValue.getCurrentContent().hasText()) {
            axios.post(BACKEND_PATH + '/comments/', {
                    post_id: post_id,
                    comment_content: draftToHtml(convertToRaw(editorValue.getCurrentContent()))
                },
                {
                    headers: {
                        Authorization: "Bearer " + user.token
                    }
                })
                .then(data => loadComments())
                .catch(e => console.log(e))
        }
    }

    return (
        <>
            {user.isLoggedIn && (

                <div id="comment-form">
                    <h3>Добавить комментарий</h3>
                    <TextEditor editorValue={editorValue}
                                setEditorValue={setEditorValue}/>
                    <button className={'button rounded'}
                            onClick={submitHandler}>Написать
                    </button>
                </div>
            )}
        </>
    )
}