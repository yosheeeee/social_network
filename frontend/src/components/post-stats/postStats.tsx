import {statSync} from "node:fs";
import {useEffect, useState} from "react";
import {useTypeSelector} from "../../hooks/useTypeSelector";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import Loader from "../Loader/Loader";

export interface IPostStats {
    likes: number,
    comments: number,
    id: number
}

export default function PostStats({likes, comments, id}: IPostStats) {

    const current_user = useTypeSelector(state => state.user)
    const [isLiked, setIsLiked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [likesCounter , setLikesCounter] = useState(likes)

    useEffect(() => {
        if (current_user.isLoggedIn) {
            setIsLoading(true)
            axios.get(BACKEND_PATH + '/user/check-like/' + id,
                {
                    headers: {
                        Authorization: 'Bearer ' + current_user.token
                    }
                })
                .then(res => res.data as { isliked: boolean })
                .then(data => {
                    console.log(data)
                    setIsLiked(data.isliked)
                })
            setIsLoading(false)
        }
    }, []);

    function likeClickHandler() {
        if (current_user.isLoggedIn) {
            if (!isLiked){
                axios.post(BACKEND_PATH + '/post/like/' + id, {}, {
                    headers: {
                        Authorization: "Bearer " + current_user.token
                    }
                })
                    .then(res => {
                        setIsLiked(true)
                        setLikesCounter(prevState => +prevState + 1)
                    })
                    .catch(e => console.log(e.response))
            }else{
                axios.delete(BACKEND_PATH+ '/post/like/' + id ,{
                    headers: {
                        Authorization: "Bearer " + current_user.token
                    }
                })
                    .then(res => {
                        setIsLiked(false)
                        setLikesCounter(prevState => +prevState - 1)
                    })
                    .catch(e => console.log(e.response))
            }
        }
    }

    return (
        <div className="post-stats">
            {isLoading ? <Loader/> :
                <>
            <span>
                <i className={isLiked ? "fa-solid fa-heart active" : "fa-solid fa-heart"}
                   onClick={likeClickHandler}></i> <span>{likesCounter}</span>
            </span>

                    <span>
                <i className="fa-solid fa-comments"></i> <span>{comments}</span>
            </span>
                </>
            }
        </div>
    )
}