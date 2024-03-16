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
user_router.get('/:id',User_controller.getUser)
user_router.get('/',AuthMiddleware,User_controller.getCurrentUser)
user_router.post('/changedata',AuthMiddleware,User_controller.ChangeUserData)
user_router.get('/checksubscribe/:from_id/:to_id',User_controller.checkSubscribe)
user_router.delete('/subscribe/:from_id/:to_id',AuthMiddleware,User_controller.unsubscribeUser)
user_router.post('/image',AuthMiddleware,User_controller.AddUserImage)
user_router.get('/image/:id',User_controller.GetUserImage)
user_router.get('/subscribers/:user_id',User_controller.getUserSubscribers)
user_router.get('/subscribings/:user_id',User_controller.getUserSubscribings)

export default user_router