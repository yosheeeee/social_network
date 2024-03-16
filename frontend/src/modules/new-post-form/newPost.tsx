import React, {FC, useState} from "react";
import {Editor} from "react-draft-wysiwyg";
import {EditorState} from 'draft-js'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./postform.scss"
import {convertFromRaw, convertToRaw} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {BlockPicker, ColorResult} from "react-color"

export default function NewPostForm(){
    const [editorValue  , setEditorvalue] = useState(EditorState.createEmpty());
    // @ts-ignore
    return(
        <div id="post-form-container">
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
            <button className={'button rounded'} onClick={()=> console.log(draftToHtml(convertToRaw((editorValue as EditorState).getCurrentContent())))}>Написать</button>
        </div>
    )
}