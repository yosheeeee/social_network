import User from "../models/user.js";
import {generateAccessToken} from "./auth_controller.js";
import bcrypt from "bcrypt";
import fs from "fs"
import {FILE_DIR_PATH} from "../config.js";
import DbFile from "../models/File.js";



export default class User_controller {
    // подписка на пользователя
    static async subscribeUser(req, res) {
        try {
            const current_user = req.current_user
            const user_to_subscribe_id = parseInt(req.body.user_id)
            const result = await User.subscribeUser(current_user.id, user_to_subscribe_id)
            return res.status(result.code).json(result.message)
        } catch (e) {
            return res.status(400)
        }
    }

    // отписка от пользователя
    static async unsubscribeUser(req,res){
        try{
            const user_from_id = req.current_user.id
            const user_to_id = req.params.to_id
            await User.unsubscribeUser(user_from_id,user_to_id)
            return res.json({message:"success"})
        }catch (e){
            console.log(e.message)
            return res.status(400).json({
                message: e.message
            })
        }
    }

    // проверка подписан ли один пользователь на другого
    static async checkSubscribe(req, res) {
        try {
            const user_from_id = req.params.from_id
            const user_to_id = req.params.to_id
            let result = await User.checkSubscribe(user_from_id, user_to_id)
            return res.json({
                result:result
            })
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                    message: e.message,
                    func: "checkSubscribe",
                }
            )
        }
    }

    // получение диалога пользователя
    static async getDialog(req, res) {
        try {
            const dialog_id = req.params.id
            const current_user = req.current_user
            const dialog = await User.getUserDialog(dialog_id)
            return res.json(dialog)
        } catch (e) {
            return res.status(400)
        }
    }

    // получения всех диалогов пользователя
    static async getUserDialogs(req, res) {
        try {
            const current_user = req.current_user
            let dialogs = await User.getUserDialogs(current_user.id)
            return res.status(200).json(dialogs)
        } catch (e) {
            return res.status(400)
        }
    }

    // отправка сообщений
    static async sendMessage(req, res) {
        try {
            const current_user_id = req.current_user.id
            let {dialog_id, message} = req.body
            if (!dialog_id) {
                dialog_id = await User.createDialog(current_user_id, req.body.user_id)
            }
            await User.sendMessage(dialog_id, current_user_id, message)
            return res.status(200).json("message sent")
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
    }

    // получение данных для текущего пользователя
    static async getCurrentUser(req,res){
        try{
            const user_id = req.current_user.id
            let query_result = await User.getUserById(user_id)
            if (!query_result.rows.length) {
                return res.status(400).json({
                    message: "пользователь не найден"
                })
            } else {
                let user = query_result.rows[0]
                return res.json({
                    user_name: user.user_name,
                    user_login: user.user_login,
                    user_mail: user.user_mail
                })
            }
        }catch (e) {
            console.log(e)
            return res.status(400).json(
                {
                    func: "getCurrentUser",
                    message: e.message
                }
            )
        }
    }

    // получение данных пользователя
    static async getUser(req, res) {
        try {
            const user_id = req.params.id
            let query_result = await User.getUserById(user_id)
            if (!query_result.rows.length) {
                return res.status(400).json({
                    message: "пользователь не найден"
                })
            } else {
                let user = query_result.rows[0]
                return res.json({
                    user_name: user.user_name,
                    user_login: user.user_login,
                })
            }
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                message: "get user error",
                error: e
            })
        }
    }

    // изменение данных текущего пользователя
    static async ChangeUserData(req, res) {
        try {
            const current_user = req.current_user
            if (req.body.user_login && req.body.user_name && req.body.user_mail){
                let user_data = {
                    login: req.body.user_login,
                    username: req.body.user_name,
                    usermail: req.body.user_mail
                }
                try{
                    await User.ChangeUserData(current_user.id, user_data)
                }catch (e) {
                    console.log(e)
                    return res.status(400).text(e.message)
                }
                if (req.body.new_password){
                    let new_password = req.body.new_password
                    const hashpassword = bcrypt.hashSync(new_password, 7)
                    try{
                        await User.changePassword(hashpassword,current_user.id)
                    }catch (e) {
                        console.log(e)
                        return res.status(400).text(e.message)
                    }
                }
                const token = generateAccessToken(current_user.id, user_data.login)
                return res.status(200).json({
                    message: "success",
                    token: token,
                    id: current_user.id
                })
            }
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                func: "ChangeUserData",
                error: e
            })
        }
    }

    static async AddUserImage(req,res){
        try{
            const file = req.files.user_image
            let user_folder = FILE_DIR_PATH + '/' + req.current_user.id
            if (!fs.existsSync(user_folder)){
                fs.mkdirSync(user_folder)
            }
            let file_path = user_folder + '/user_image.'+file.name.split('.').pop()
            file.mv(file_path)
            await DbFile.DeleteFiles('user_image',req.current_user.id)
            await DbFile.AddFile(file_path.replace(FILE_DIR_PATH,''),'user_image',req.current_user.id)
            return res.status(200).json({message: 'file has uploaded'})

        }catch (e){
            console.log(e)
            return res.status(400).json({message : "Error AddUserImage function", e: e})
        }

    }

    static async GetUserImage(req,res){
        try{
            let user_id = req.params.id
            let files = await DbFile.GetFiles('user_image',user_id)
            let data = {
                message: "ok",
                file_src: '/user_default_image.png'
            }
            if (files.length != 0){
                data.file_src = files[0].file_src
            }
            return res.status(200).json(data)
        }catch (e) {
            console.log(e)
            return res.status(400).json({message: "error GetUserProfileImage", e: e.message})
        }
    }


}
