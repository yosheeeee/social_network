import {db} from "../db.js";

export default class Post {
    static async addPost(user_id, post_content) {
        await db.query('INSERT INTO posts (content, user_id) VALUES ($1,$2)', [post_content, user_id])
    }

    static async getUserPosts(user_id) {
        return await db.query(`SELECT posts.id,
                                      posts.post_date,
                                      posts.content,
                                      COALESCE(likes_table.likes, 0)       as likes,
                                      COALESCE(comments_table.comments, 0) as comments
                               FROM posts
                                        LEFT JOIN (SELECT COUNT(*) as likes, post_id
                                                   FROM post_likes
                                                   GROUP BY post_id) as likes_table ON likes_table.post_id = posts.id
                                        LEFT JOIN (SELECT COUNT(*) as comments, post_id
                                                   FROM post_comments
                                                   GROUP BY post_comments.post_id) as comments_table
                                                  on posts.id = comments_table.post_id
                               WHERE user_id = $1
                               GROUP BY posts.id, likes_table.likes, comments_table.comments, posts.post_date
                               ORDER BY posts.post_date DESC

        `, [user_id])
    }

    static async getUserToPostLikes(user_id, post_id) {
        return await db.query(`
            SELECT COUNT(isLiked) = 1 as isLiked
            FROM (SELECT COUNT(*) = 1 as isLiked
                  FROM users
                           RIGHT JOIN public.post_likes pl on users.user_id = pl.user_id
                  WHERE users.user_id = $1
                    AND pl.post_id = $2
                  GROUP BY pl.user_id) as likes_table

        `, [user_id, post_id])
    }

    static async postUserLike(user_id, post_id) {
        await db.query(`
            INSERT INTO post_likes (user_id, post_id)
            VALUES ($1, $2)
        `, [user_id, post_id])

        let query_res = await db.query(`SELECT *
                                        FROM posts
                                                 LEFT JOIN users ON posts.user_id = users.user_id
                                        WHERE id = $1`, [post_id])

        if (query_res.rows[0].user_id !== user_id) {
            console.log(query_res.rows[0])
            let notification_content = `<h4>Пользователь <a href="http://localhost:3000/user/${query_res.rows[0].user_id}">${query_res.rows[0].user_name}</a> поставил лайк <a href="http://localhost:3000/user/${user_id}">вашей записи</a></h4>`

            await db.query(`
                INSERT INTO notifications_table (notification_type, user_id, notification_subject,
                                                 notification_content)
                VALUES ($1, $2, $3, $4)
            `, ['like', query_res.rows[0].user_id, 'Лайк', notification_content])
        }
    }

    static async deleteUserLike(user_id, post_id) {
        return await db.query(
            `
                DELETE
                FROM post_likes
                WHERE user_id = $1
                  AND post_id = $2
            `, [user_id, post_id]
        )
    }

    static
    async getPostComments(post_id) {
        return await db.query(`SELECT users.user_name,
                                      post_comments.user_id,
                                      COALESCE(files.file_src, '/user_default_image.png') as user_image,
                                      comment_date,
                                      comment_content
                               FROM post_comments
                                        LEFT JOIN public.users ON post_comments.user_id = users.user_id
                                        LEFT JOIN public.files
                                                  ON CAST(files.meta_value as DECIMAL) = post_comments.user_id AND
                                                     files.meta_key = 'user_image'
                               WHERE post_id = $1
                               ORDER BY comment_date DESC
        `, [post_id])
    }

    static
    async postComment(user_id, post_id, comment_content) {
        await db.query(
            "INSERT INTO post_comments (post_id, user_id, comment_content) VALUES ($1,$2,$3)",
            [post_id, user_id, comment_content]
        )

        let query_result = await db.query(`
            SELECT * FROM posts
                LEFT JOIN users ON posts.user_id = users.user_id
                WHERE posts.id = $1
        `,[post_id])

        query_result = query_result.rows[0]

        if (query_result.user_id !== user_id){
            let notification_content = `<h4>Пользователь <a href="http://localhost:3000/user/${query_res.user_id}">${query_res.user_name}</a> оставил комментарий <a href="http://localhost:3000/user/${user_id}/post/${post_id}/comments">вашей записи</a></h4>`
            await db.query(`
                INSERT INTO notifications_table (notification_type, user_id, notification_subject, notification_content) 
                VALUES ($1, $2,$3,$4) 
            `,['comment', query_result.user_id, 'Лайк' , notification_content])
        }
    }
}