import jwt from "jsonwebtoken";
import SECREC_KEY from "../config.js";

export default function AuthMiddleware(req,res,next){
    if (req.method === 'OPTIONS'){
        next()
    }

    try{
        const token = req.headers.authorization.split(' ')[1]
        if (!token){
            return res.status(401).json({
                message: "Пользователь не авторизован"
            })
        }
        req.current_user = jwt.verify(token, SECREC_KEY)
        next()
    }catch (e){
        return res.status(400).json({
            message:"authMiddeware eror",
            error: e
        })
    }
}