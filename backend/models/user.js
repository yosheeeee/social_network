import {db} from "../db.js";

export default class User {
    static async findUser(user_mail, user_login) {
        return db.query('SELECT * FROM users WHERE user_login = $1 OR user_mail = $2',
            [user_login, user_mail])
    }

    static async addUser(user_mail, user_login, password) {
        const user = await db.query('INSERT INTO users (user_mail,user_login,user_password) values ($1,$2,$3) RETURNING *',
            [user_mail, user_login, password])
        return user.rows[0]
    }

    static async subscribeUser(user_from_id, user_to_id) {
        let user_subscribtion = await db.query('SELECT * FROM user_subscribings WHERE user_id_from = $1 AND user_id_to = $2', [user_from_id, user_to_id])
        if (user_subscribtion.rows.length != 0) {
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

    static async getUserDialog(dialog_id) {
        const query_result = await db.query(
            "SELECT * FROM messages WHERE dialog_id = $1 ORDER BY DESC", [dialog_id]
        )
        return query_result.rows
    }

    static async getUserDialogs(user_id) {
    }

    static async checkUserDialogAccess(user_id, dialog_id) {
        const query_result = await db.query(
            "SELECT * FROM dialogs WHERE dialog_id = $1", [dialog_id]
        )
        if (query_result.rows.length == 0) return {
            access: false,
            reason: "dialog not exist"
        }
        let dialog = query_result.rows[0]
        if (dialog.first_user != user_id && dialog.second_user != user_id) return {
            access: false,
            reason: "access denied"
        }
        return {
            access: true
        }
    }

    static async createDialog(first_user_id, second_user_id) {
        let query_result = await db.query(
            `SELECT * FROM dialogs WHERE first_user = $1 AND second_user = $2 OR first_user = $2 or second_user = $1`,
            [first_user_id,second_user_id]
        )
        if (!query_result.rows.length){
            query_result = await db.query(
                `INSERT INTO dialogs (first_user, second_user) 
                VALUES ($1,$2)
                RETURNING *`,
                [first_user_id,second_user_id]
            )
        }
        return query_result.rows[0].dialog_id
    }

    static async sendMessage(dialog_id,user_from_id,message){
         await db.query(
            "INSERT INTO messages  (dialog_id,user_from,message_content) VALUES ($1,$2,$3)",
            [dialog_id,user_from_id,message]
        )
    }
}

//TODO: getUserDialogs