import {Router} from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import Post_controller from "../controllers/post_controller.js";


export const post_router = new Router()
post_router.post('/like/:post_id', AuthMiddleware, Post_controller.postUserLike)
post_router.delete('/like/:post_id',AuthMiddleware,Post_controller.deleteUserLike)
post_router.get('/images/:post_id',Post_controller.getPostImages)
post_router.delete('/:post_id',AuthMiddleware, Post_controller.deletePost)