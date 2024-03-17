import {statSync} from "node:fs";
import {useEffect, useState} from "react";
import {useTypeSelector} from "../../hooks/useTypeSelector";

export interface IPostStats {
    likes: number,
    comments: number,
    id: number
}

export default function PostStats({likes, comments , id}: IPostStats) {

    const current_user = useTypeSelector(state => state.user)
    const [isLiked ,setIsLiked] = useState(false)

    // useEffect(() => {
    //     if (current_user.token != null){
    //
    //     }
    // }, [id]);

    return (
        <div className="post-stats">
            <span>
                <i className="fa-solid fa-heart"></i> <span>{likes}</span>
            </span>

            <span>
                <i className="fa-solid fa-comments"></i> <span>{comments}</span>
            </span>
        </div>
    )
}