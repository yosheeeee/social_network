import {Router} from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import User_controller from "../controllers/user_controller.js";
import checkDialogMiddleware from "../middleware/checkDialogMiddleware.js";
import AllowAnonymusMiddleware from "../middleware/allowAnonymusMiddleware.js";


const user_router = new Router()
user_router.post('/subscribe',AuthMiddleware,User_controller.subscribeUser)
user_router.get('/:id',User_controller.getUser)
user_router.get('/',AuthMiddleware,User_controller.getCurrentUser)
user_router.post('/changedata',AuthMiddleware,User_controller.ChangeUserData)
user_router.get('/checksubscribe/:from_id/:to_id',User_controller.checkSubscribe)
user_router.delete('/subscribe/:from_id/:to_id',AuthMiddleware,User_controller.unsubscribeUser)
user_router.post('/image',AuthMiddleware,User_controller.AddUserImage)
user_router.get('/image/:id',User_controller.GetUserImage)
user_router.get('/subscribers/:user_id',User_controller.getUserSubscribers)
user_router.get('/subscribings/:user_id',User_controller.getUserSubscribings)
user_router.post('/post',AuthMiddleware, User_controller.AddUserPost)
user_router.get('/posts/:user_id',User_controller.GetUserPosts)
user_router.get('/check-like/:post_id',AuthMiddleware, User_controller.CheckUserToPostLike)
user_router.get('/notifications/get', AuthMiddleware, User_controller.GetUserNotifications)
user_router.get('/feed/get',AllowAnonymusMiddleware, User_controller.getUserFeed)
user_router.get('/:user_id/commented-posts',User_controller.getUserCommentedPosts)
user_router.get('/:user_id/liked-posts',User_controller.getUserLikedPosts)

export default user_router