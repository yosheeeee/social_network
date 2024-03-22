import Popup from "../popup/Popup";
import React, {SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import Loader from "../Loader/Loader";
import "./post-comments.scss"
import {Link} from "react-router-dom";
import TextEditor from "../TextEditor";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {futimes} from "node:fs";
import {Simulate} from "react-dom/test-utils";
import loadedData = Simulate.loadedData;

interface CommentState {
    user_name: string,
    user_id: number,
    user_image: string,
    comment_content: string,
    comment_date: string,
}

export default function PostComments({showPopup, setShowPopup, post_id}: {
    showPopup: boolean,
    setShowPopup: React.Dispatch<SetStateAction<boolean>>,
    post_id: number
}) {
    const [commentsData, setCommentsData] = useState<CommentState[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (showPopup) {
            loadComments()
        }
    }, [showPopup]);


    function loadComments() {
        setLoading(true)
        axios.get(BACKEND_PATH + '/comments/' + post_id)
            .then(res => res.data.comments as CommentState[])
            .then(data => setCommentsData(data))
            .catch(e => console.log(e))
        setLoading(false)
    }


    return (
        <Popup showPopup={showPopup}
               setShowPopup={setShowPopup}>
            {loading ? <Loader/> : (
                <>
                    <AddComentForm post_id={post_id}
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