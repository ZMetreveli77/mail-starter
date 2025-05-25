import { Router } from "express"
import {
  getStatus,
  login,
  register,
  logout
} from "../controllers/userControllers.js"
import { protectRoute, validateBody } from "../middleware.js"
import { loginSchema, registerSchema } from "../schema.js"

export const userRouter = Router()

userRouter.get("/status", protectRoute, getStatus)
userRouter.post("/register", validateBody(registerSchema), register)
userRouter.post("/login", validateBody(loginSchema), login)
userRouter.delete("/logout", logout)

export default userRouter