import {Router} from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import User_controller from "../controllers/user_controller.js";
import checkDialogMiddleware from "../middleware/checkDialogMiddleware.js";


const user_router = new Router()
user_router.post('/subscribe',AuthMiddleware,User_controller.subscribeUser)
user_router.get('/dialog/:id',AuthMiddleware,checkDialogMiddleware,User_controller.getDialog)
user_router.get('/dialogs',AuthMiddleware,User_controller.getUserDialogs)
user_router.post('/message',AuthMiddleware,User_controller.sendMessage)

export default user_router