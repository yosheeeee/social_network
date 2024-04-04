import jwt from "jsonwebtoken";
import SECREC_KEY from "../config.js";

export default function AllowAnonymusMiddleware(req,res,next){
    if (req.method === 'OPTIONS'){
        next()
    }

    try{
        const token = req.headers.authorization?.split(' ')[1]
        if (!token){
            req.current_user = undefined
        }else{
            req.current_user = jwt.verify(token, SECREC_KEY)
        }
        next()
    }catch (e){
        return res.status(400).json({
            message:"AllowAnonymusMiddlewareError eror",
            error: e.message
        })
    }
}