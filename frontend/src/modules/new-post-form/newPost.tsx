import React, {ChangeEvent, FC, MouseEventHandler, SetStateAction, useMemo, useRef, useState} from "react";
import {EditorState} from 'draft-js'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./postform.scss"
import TextEditor from "../../components/TextEditor";
import {Dispatch} from "redux";

interface NewPostFormProps {
    editorValue: EditorState,
    setEditorValue: React.Dispatch<React.SetStateAction<EditorState>>,
}

export default function NewPostForm({editorValue, setEditorValue}: NewPostFormProps) {


    // @ts-ignore
    return (
        <div id="post-form-container">
            <h3>Добавить новую запись</h3>
            <TextEditor editorValue={editorValue}
                        setEditorValue={setEditorValue}/>
        </div>
    )
}

export function PostImages({images} : {images: FileList | null}){
    const PrintFiles  = () => {
        let res = <></>
        let files: File[] = []
        // @ts-ignore
        for (let i = 0; i < images?.length; i++) {
            // @ts-ignore
            files.push(images[i])
        }
        return (
            <>
                {files.map(file => <img src={URL.createObjectURL(file)}/>)}
            </>
        )
    }
    return (
        <div className="files">
            <PrintFiles></PrintFiles>
        </div>
    )
}
