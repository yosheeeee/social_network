import {Router} from "express";
import Post_controller from "../controllers/post_controller.js";


export const comments_router = new Router()
comments_router.get('/:post_id',Post_controller.getPostComments)