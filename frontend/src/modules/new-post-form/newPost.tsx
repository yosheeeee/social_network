import React, {FC, MouseEventHandler, useState} from "react";
import {EditorState} from 'draft-js'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./postform.scss"
import TextEditor from "../../components/TextEditor";

export default function NewPostForm({editorValue , setEditorValue , submitFromHandler}: {editorValue: EditorState , setEditorValue : React.Dispatch<React.SetStateAction<EditorState>>, submitFromHandler: MouseEventHandler}){
    return(
        <div id="post-form-container">
            <h3>Добавить новую запись</h3>
            <TextEditor editorValue={editorValue} setEditorValue={setEditorValue}/>
            <button className={'button rounded'} onClick={submitFromHandler}>Написать</button>
        </div>
    )
}