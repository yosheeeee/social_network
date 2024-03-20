import {Editor} from "react-draft-wysiwyg";
import React, {SetStateAction} from "react";
import {EditorState} from "draft-js";


export default function TextEditor({editorValue , setEditorValue}: {editorValue: EditorState , setEditorValue: React.Dispatch<SetStateAction<EditorState>>}){
    return (
            <Editor editorState={editorValue}
                    onEditorStateChange={e => setEditorValue(e)}
                    editorClassName="post-form-editor"
                    toolbarClassName="post-form-toolbar"
                    toolbar={{
                        options: ['inline', 'link', 'emoji'],
                        inline: {
                            options: ['bold', 'italic', 'underline']
                        },
                    }}
            />
    )
}