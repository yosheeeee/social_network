import {db} from "../db.js";

export default class Post{
    static async addPost(user_id, post_content){
        await db.query('INSERT INTO posts (content, user_id) VALUES ($1,$2)',[post_content, user_id])
    }

    static async getUserPosts(user_id){
        return await db.query(`SELECT content,
                                      post_date,
                                      posts.id,  
                                      (SELECT COUNT(likes_table.likes) as likes
                                       FROM (SELECT COUNT(*) as likes
                                             FROM post_likes
                                                      LEFT JOIN public.posts p on post_likes.post_id = p.id
                                             WHERE p.id = posts.id
                                             GROUP BY p.id) as likes_table),
                                      (SELECT COUNT(comment_table.comment) as comments
                                       FROM (SELECT COUNT(*) as comment
                                             FROM post_comments
                                             WHERE post_comments.post_id = posts.id
                                             GROUP BY post_id) as comment_table) as comments

                               FROM posts
                               WHERE user_id = $1
                               ORDER BY post_date DESC`,[user_id])
    }
}