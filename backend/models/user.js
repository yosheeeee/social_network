import {db} from "../db.js";

export default class User{
    static async findUser(user_mail,user_login){
        return db.query('SELECT * FROM users WHERE user_login = $1 OR user_mail = $2',
            [user_login, user_mail])
    }

    static async addUser(user_mail,user_login,password){
        db.query('INSERT INTO users (user_mail,user_login,user_password) values ($1,$2,$3)',
            [user_mail,user_login,password])
    }
}
