import React, {ChangeEvent, FC, MouseEventHandler, SetStateAction, useMemo, useRef, useState} from "react";
import {EditorState} from 'draft-js'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./postform.scss"
import TextEditor from "../../components/TextEditor";
import {Dispatch} from "redux";

interface NewPostFormProps {
    editorValue: EditorState,
    setEditorValue: React.Dispatch<React.SetStateAction<EditorState>>,
    submitFromHandler: MouseEventHandler,
    postImages: FileList | null,
    setPostImages: React.Dispatch<React.SetStateAction<FileList | null>>
}

export default function NewPostForm({editorValue, setEditorValue, submitFromHandler , postImages, setPostImages}: NewPostFormProps) {
    const inputFileRef = useRef<HTMLInputElement>(null)
    let memoImages =useMemo(() => postImages, [])


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
        setPostImages(e.target.files)
    }


    function clearImages(){
        setPostImages(null)
    }

    const MemoIzedPostImages = React.memo(PostImages)

    // @ts-ignore
    return (
        <div id="post-form-container">
            <h3>Добавить новую запись</h3>
            <TextEditor editorValue={editorValue}
                        setEditorValue={setEditorValue}/>
            <input type="file"
                   name="post-files"
                   id="post-files"
                   accept=".png,.jpg,.jpeg,.gif"
                   multiple={true}
                   onChange={changeInputFiles}
                   ref={inputFileRef}/>
            <MemoIzedPostImages images={memoImages}/>
            <div className="btns">
                <button className="button rounded post-files"
                        onClick={openFilesInput}><i className="fa-solid fa-images"></i></button>
                {postImages !== null && <button className="rounded button" onClick={clearImages}><i className='fa-solid fa-xmark'></i></button>}
                <button className={'button rounded'}
                        onClick={submitFromHandler}>Написать
                </button>
            </div>
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
