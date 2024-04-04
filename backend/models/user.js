import {db} from "../db.js";


export default class User {

    static async changePassword(new_password,user_id){
        await db.query('UPDATE users SET user_password = $1 WHERE user_id=$2',[new_password,user_id])
    }

    static async ChangeUserData(user_id, userdata){
        await db.query('UPDATE users SET user_login = $2,user_name = $3, user_mail = $4 WHERE user_id=$1',[user_id,userdata.login,userdata.username,userdata.usermail])
    }

    static async GetUserSubscribers(user_id){
        return await db.query('SELECT * FROM user_subscribings WHERE user_id_to = $1',[user_id])
    }

    static async getUserSubscribings(user_id){
        return await db.query('SELECT * FROM user_subscribings WHERE user_id_from = $1',[user_id])
    }

    static async findUser(user_mail, user_login) {
        return db.query('SELECT * FROM users WHERE user_login = $1 OR user_mail = $2',
            [user_login, user_mail])
    }

    static async getUserById(user_id){
        return db.query('SELECT * FROM users WHERE user_id = $1',[user_id])
    }

    static async addUser(user_mail, user_login, password,user_name) {
        const user = await db.query('INSERT INTO users (user_mail,user_login,user_password,user_name) values ($1,$2,$3,$4) RETURNING *',
            [user_mail, user_login, password,user_name])
        return user.rows[0]
    }

    static async checkSubscribe(user_from_id, user_to_id){
        let user_subscribtion = await db.query('SELECT * FROM user_subscribings WHERE user_id_from = $1 AND user_id_to = $2', [user_from_id, user_to_id])
        return user_subscribtion.rows.length != 0
    }

    static async unsubscribeUser(user_from_id, user_to_id){
        return await db.query('DELETE FROM user_subscribings WHERE user_id_from = $1 AND user_id_to = $2',[user_from_id,user_to_id])
    }

    static async subscribeUser(user_from_id, user_to_id) {
        let checkRes = await User.checkSubscribe(user_from_id, user_to_id)
        if (checkRes) {
            return {
                message: "User already subscribed",
                code: 400
            }
        } else {
            db.query('INSERT INTO user_subscribings (user_id_from,user_id_to) VALUES ($1,$2)', [user_from_id, user_to_id])
            return {
                message: "User subscribed",
                code: 200
            }
        }
    }

    static async getUserFeed(user_id){
        if (user_id){
            return await db.query(`
                SELECT posts.id                                           as id,
                       posts.post_date                                    as post_date,
                       posts.content                                      as content,
                       COALESCE(likes_table.likes, 0)                     as likes,
                       COALESCE(comments_table.comments, 0)               as comments,
                       users.user_id                                      as user_id,
                       users.user_name                                    as user_name,
                       users.user_mail                                    as user_mail,
                       users.user_login                                   as user_login,
                       COALESCE(file_src, '/user_default_image.png')      as user_image_src,
                       COALESCE(subscribers_table.subscribers_count, 0)   as subscribers,
                       COALESCE(subscribings_table.subscribings_count, 0) as subscribings
                FROM posts
                         LEFT JOIN (SELECT COUNT(*) as likes, post_id
                                    FROM post_likes
                                    GROUP BY post_id) as likes_table ON likes_table.post_id = posts.id
                         LEFT JOIN (SELECT COUNT(*) as comments, post_id
                                    FROM post_comments
                                    GROUP BY post_comments.post_id) as comments_table
                                   on posts.id = comments_table.post_id
                         LEFT JOIN users ON posts.user_id = users.user_id
                         LEFT JOIN files ON files.meta_value = posts.user_id AND files.meta_key = 'user_image'
                         LEFT JOIN (SELECT COUNT(*) as subscribers_count, user_id_to as user_id
                                    FROM user_subscribings
                                    GROUP BY user_id_to) as subscribers_table
                                   ON posts.user_id = subscribers_table.user_id
                         LEFT JOIN (SELECT COUNT(*) as subscribings_count, user_id_from as user_id
                                    FROM user_subscribings
                                    GROUP BY user_id_from) as subscribings_table
                                   ON posts.user_id = subscribings_table.user_id
                GROUP BY id, post_date, content, likes, comments, users.user_id, user_name, user_mail, user_image_src,
                         subscribers, subscribings
                ORDER BY posts.post_date DESC
            `)
        }else{
            return await db.query(`
                SELECT posts.id                                           as id,
                       posts.post_date                                    as post_date,
                       posts.content                                      as content,
                       COALESCE(likes_table.likes, 0)                     as likes,
                       COALESCE(comments_table.comments, 0)               as comments,
                       users.user_id                                      as user_id,
                       users.user_name                                    as user_name,
                       users.user_mail                                    as user_mail,
                       users.user_login                                   as user_login,
                       COALESCE(file_src, '/user_default_image.png')      as user_image_src,
                       COALESCE(subscribers_table.subscribers_count, 0)   as subscribers,
                       COALESCE(subscribings_table.subscribings_count, 0) as subscribings
                FROM posts
                         LEFT JOIN (SELECT COUNT(*) as likes, post_id
                                    FROM post_likes
                                    GROUP BY post_id) as likes_table ON likes_table.post_id = posts.id
                         LEFT JOIN (SELECT COUNT(*) as comments, post_id
                                    FROM post_comments
                                    GROUP BY post_comments.post_id) as comments_table
                                   on posts.id = comments_table.post_id
                         LEFT JOIN users ON posts.user_id = users.user_id
                         LEFT JOIN files ON files.meta_value = posts.user_id AND files.meta_key = 'user_image'
                         LEFT JOIN (SELECT COUNT(*) as subscribers_count, user_id_to as user_id
                                    FROM user_subscribings
                                    GROUP BY user_id_to) as subscribers_table
                                   ON posts.user_id = subscribers_table.user_id
                         LEFT JOIN (SELECT COUNT(*) as subscribings_count, user_id_from as user_id
                                    FROM user_subscribings
                                    GROUP BY user_id_from) as subscribings_table
                                   ON posts.user_id = subscribings_table.user_id
                GROUP BY id, post_date, content, likes, comments, users.user_id, user_name, user_mail, user_image_src,
                         subscribers, subscribings
                ORDER BY posts.post_date DESC
            `)
        }
    }


    static async GetNotifications(user_id){
        let query_result = await db.query(`
            SELECT *
            FROM notifications_table
            WHERE user_id = $1
            ORDER BY notification_read DESC, notification_date DESC
        `, [user_id])

        query_result = query_result?.rows?.length ? query_result.rows : []

        await db.query(`UPDATE notifications_table
            SET notification_read = 1
            WHERE user_id = $1
        `,[user_id])

        return query_result
    }

}
