import {db} from "../db.js"
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SECREC_KEY from "../config.js";

export const generateAccessToken = (id, login) => {
    const payload = {
        id,
        login
    }
    return jwt.sign(payload, SECREC_KEY)
}

export default class AuthController {
    static async registration(req, res) {
        try {
            const {login, mail, password,name} = req.body
            const candidate = await User.findUser(mail, login)
            if (candidate.rows.length != 0) {
                return res.status(400).json({
                    message: 'Пользователь с таким именем или почтой уже существует'
                })
            }
            const hashpassword = bcrypt.hashSync(password, 7)
            const user = await User.addUser(mail, login, hashpassword,name)
            const token = generateAccessToken(user.user_id,user.user_login)
            return res.status(200).json(
                {
                    message: 'Пользователь зарегистрирован',
                    token: token,
                    id: user.user_id
                }
            )

        } catch (e) {
            console.log(e)
            res.status(400).json({
                message: 'registration error'
            })
        }
    }

    static async login(req, res) {
        try {
            const {login, password} = req.body
            const user = await User.findUser('', login)
            if (!user.rows.length) {
                return res.status(400).json({
                    message: "такой пользователь не найден"
                })
            }
            const validPassword = bcrypt.compareSync(password, user.rows[0].user_password)
            if (!validPassword) {
                return res.status(400).json({
                    message: "Введен неверный пароль"
                })
            }
            const token = generateAccessToken(user.rows[0].user_id, user.rows[0].user_login)
            return res.json({token: token, id: user.rows[0].user_id})
        } catch (e) {

            console.log(e)
            res.status(400).json({
                message: 'login error'
            })
        }
    }
}