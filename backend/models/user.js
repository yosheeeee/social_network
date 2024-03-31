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

    // static async getUserDialog(dialog_id) {
    //     const query_result = await db.query(
    //         "SELECT * FROM messages WHERE dialog_id = $1 ORDER BY message_date DESC", [dialog_id]
    //     )
    //     return query_result.rows
    // }
    //
    // static async getUserDialogs(user_id) {
    //     const query_result = await db.query(
    //         `
    //             SELECT dialogs.dialog_id as dialog_id,first_user,second_user, message.user_from, message.message_content, message.message_date FROM dialogs
    //                                                                                                                                                     JOIN (
    //                 SELECT messages.dialog_id , messages.user_from,messages.message_content,message_date
    //                 FROM messages
    //                 WHERE dialog_id = 1
    //                 ORDER BY message_date DESC
    //                 LIMIT 1
    //             ) as message
    //                                                                                                                                                          ON dialogs.dialog_id = message.dialog_id
    //             WHERE first_user = $1 OR second_user = $1
    //             ORDER BY message_date DESC
    //         `
    //         , [user_id]
    //     )
    //
    //     let rows = query_result.rows
    //     rows.forEach(row => {
    //         if (row.first_user === user_id){
    //             row.user_id = row.second_user
    //         }else{
    //             row.user_id = row.first_user
    //         }
    //         delete row.first_user
    //         delete row.second_user
    //     })
    //     console.log(rows)
    //     return rows
    // }
    //
    // static async checkUserDialogAccess(user_id, dialog_id) {
    //     const query_result = await db.query(
    //         "SELECT * FROM dialogs WHERE dialog_id = $1", [dialog_id]
    //     )
    //     if (query_result.rows.length == 0) return {
    //         access: false,
    //         reason: "dialog not exist"
    //     }
    //     let dialog = query_result.rows[0]
    //     if (dialog.first_user != user_id && dialog.second_user != user_id) return {
    //         access: false,
    //         reason: "access denied"
    //     }
    //     return {
    //         access: true
    //     }
    // }
    //
    // static async createDialog(first_user_id, second_user_id) {
    //     let query_result = await db.query(
    //         `SELECT *
    //          FROM dialogs
    //          WHERE first_user = $1 AND second_user = $2
    //             OR first_user = $2
    //             or second_user = $1`,
    //         [first_user_id, second_user_id]
    //     )
    //     if (!query_result.rows.length) {
    //         query_result = await db.query(
    //             `INSERT INTO dialogs (first_user, second_user)
    //              VALUES ($1, $2)
    //              RETURNING *`,
    //             [first_user_id, second_user_id]
    //         )
    //     }
    //     return query_result.rows[0].dialog_id
    // }
    //
    // static async sendMessage(dialog_id, user_from_id, message) {
    //     await db.query(
    //         "INSERT INTO messages  (dialog_id,user_from,message_content,message_date) VALUES ($1,$2,$3,current_timestamp)",
    //         [dialog_id, user_from_id, message]
    //     )
    // }


    static async GetNotifications(user_id){
        let query_result = await db.query(`
              SELECT * FROM notifications_table WHERE user_id = $1
              ORDER BY notification_read DESC , notification_date DESC
        `,[user_id])

        query_result = query_result?.rows?.length ? query_result.rows : []

        await db.query(`UPDATE notifications_table
            SET notification_read = 1
            WHERE user_id = $1
        `,[user_id])

        return query_result
    }

}
