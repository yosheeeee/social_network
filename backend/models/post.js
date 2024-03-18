import {db} from "../db.js";

export default class Post{
    static async addPost(user_id, post_content){
        await db.query('INSERT INTO posts (content, user_id) VALUES ($1,$2)',[post_content, user_id])
    }

    static async getUserPosts(user_id){
        return await db.query(`SELECT posts.id, posts.post_date, posts.content, COALESCE(likes_table.likes,0) as likes, COALESCE(comments_table.comments,0) as comments
                               FROM posts
                                        LEFT JOIN (SELECT COUNT(*) as likes, post_id
                                                   FROM post_likes
                                                   GROUP BY post_id) as likes_table ON likes_table.post_id = posts.id
                                        LEFT JOIN (SELECT COUNT(*) as comments, post_id
                                                   FROM post_comments
                                                   GROUP BY post_comments.post_id) as comments_table on posts.id = comments_table.post_id
                               WHERE user_id = $1
                               GROUP BY posts.id, likes_table.likes, comments_table.comments,posts.post_date
                               ORDER BY posts.post_date DESC

        `,[user_id])
    }

    static async getUserToPostLikes(user_id, post_id){
        return await db.query(`
            SELECT COUNT(isLiked) = 1 as isLiked
            FROM (SELECT COUNT(*) = 1 as isLiked
                  FROM users
                           RIGHT JOIN public.post_likes pl on users.user_id = pl.user_id
                  WHERE users.user_id = $1
                    AND pl.post_id = $2
                  GROUP BY pl.user_id) as likes_table

        `,[user_id, post_id])
    }

    static async postUserLike(user_id, post_id){
        return await db.query(`
            INSERT INTO post_likes (user_id, post_id)  VALUES ($1,$2)
        `,[user_id , post_id])
    }

    static async deleteUserLike(user_id, post_id){
        return await db.query(
            `
            DELETE FROM post_likes WHERE user_id = $1 AND  post_id = $2
            `,[user_id,post_id]
        )
    }

    static async getPostComments(post_id){
        return await db.query('SELECT * FROM post_comments WHERE post_id = $1 ORDER BY comment_date DESC',[post_id])
    }
}