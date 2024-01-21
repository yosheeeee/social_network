import {Router} from "express";
import AuthController from "../controllers/auth_controller.js";
import {check} from "express-validator";
import AuthMiddleware from "../middleware/authMiddleware.js";

const auth_controller = new Router()
auth_controller.post('/registration',AuthController.registration)
auth_controller.post('/login',AuthController.login)

export default auth_controller
