// TODO: дописать эту хуету
import React, {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_PATH} from "../../constants";
import {IFeedPost, IUserPost} from "../../hooks/useUserPage";
import PostStats from "../post-stats/postStats";
import {PostImages} from "../../modules/new-post-form/newPost";
import Slider from "../Slider/slider";
import {Link} from "react-router-dom";


export default function FeedPost({post_date, id , content , likes , comments , user_image_src , user_login, user_mail , user_name,user_id } : IFeedPost){
    let date = new Date(post_date)
    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
    };
    const [postImagesSrc, setPostImagesSrc] = useState<{ file_src: string }[]>([
    ])

    useEffect(() => {
        axios.get(BACKEND_PATH + '/post/images/' + id)
            .then(res => {
                console.log(res.data)
                return res.data.images
            })
            .then(images => setPostImagesSrc(images))
    }, [id]);

    return(
        <div className="post">
            <div className="user-image">
                <img src={BACKEND_PATH + '/static/'+user_image_src}
                     alt="user-image"/>
            </div>
            <div className="post-header">
                <span className="name"><Link to={'./user/'+user_id}>{user_name}</Link></span>
                <span className="login">@{user_login}</span>
                <span className="post-date">{`${date.getHours()}:${date.getMinutes()}`}, {date.toLocaleDateString("ru", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                })}</span>
            </div>
            <div className="post-content" dangerouslySetInnerHTML={{__html: content}}></div>
            {
                postImagesSrc.length != 0 &&

                <div className="post-images">
                    <Slider elementsOnPage={3}>
                        {postImagesSrc.map(imageSrc => <div><img src={BACKEND_PATH + '/static/' + imageSrc.file_src}
                                                                 alt="post-image"/></div>)}
                    </Slider>
                </div>
            }
            <PostStats likes={likes}
                       comments={comments}
                       id={id}/>
        </div>
    )
}