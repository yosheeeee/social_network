import User from "../models/user.js";

export default async function checkDialogMiddleware(req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const current_user = req.current_user
        const checkResult = await User.checkUserDialogAccess(current_user.id, req.params.id)
        if (!checkResult.access) {
            return res.status(400).json(checkResult.reason)
        }
        next()
    } catch (e) {
        res.status(400).json({
            message: "checkDialogMiddleware error",
            error: e
        })
    }
}