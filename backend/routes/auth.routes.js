import {Router} from "express";
import AuthController from "../controllers/auth_controller.js";
import {check} from "express-validator";
import AuthMiddleware from "../middleware/authMiddleware.js";

const auth_router = new Router()
auth_router.post('/registration',AuthController.registration)
auth_router.post('/login',AuthController.login)

export default auth_router
