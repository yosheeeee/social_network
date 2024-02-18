import User from "../models/user.js";


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
                console.log(dialog_id)
            }
            await User.sendMessage(dialog_id, current_user_id, message)
            return res.status(200).json("message sent")
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: e})
        }
    }

    static async getUser(req, res) {
        try {
            const user_id = req.params.id
            console.log(user_id)
            let query_result = await User.getUserById(user_id)
            if (!query_result.rows.length) {
                return res.status(400).json({
                    message: "пользователь не найден"
                })
            } else {
                let user = query_result.rows[0]
                return res.json({
                    user_name:user.user_name,
                    user_login:user.user_login,
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
}
