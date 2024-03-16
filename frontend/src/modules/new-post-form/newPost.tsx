import React, {FC, useState} from "react";
import {Editor} from "react-draft-wysiwyg";
import {EditorState} from 'draft-js'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./postform.scss"
import {convertFromRaw, convertToRaw} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {BlockPicker, ColorResult} from "react-color"
import {useTypeSelector} from "../../hooks/useTypeSelector";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";

export default function NewPostForm(){
    const [editorValue  , setEditorvalue] = useState(EditorState.createEmpty());
    const user = useTypeSelector(state => state.user)

    function submitFormHandle(){
        axios.post(BACKEND_PATH+'/user/post',{
            post_content: draftToHtml(convertToRaw(editorValue.getCurrentContent()))
        },{
            headers:{
                Authorization: "Bearer "+user.token
            }
        })
            .then(res => res.data)
            .then(data => console.log(data))
            .catch(e => console.log(e.response))
    }
    // @ts-ignore
    return(
        <div id="post-form-container">
            <h3>Добавить новую запись</h3>
            <Editor editorState={editorValue}
                    onEditorStateChange={e => setEditorvalue(e)}
                    editorClassName="post-form-editor"
                    toolbarClassName="post-form-toolbar"
                    toolbar={{
                        options: ['inline','link','emoji'],
                        inline: {
                            options: ['bold','italic','underline']
                        },
                    }}
                    />
            <button className={'button rounded'} onClick={submitFormHandle}>Написать</button>
        </div>
    )
}