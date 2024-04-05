import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)

export default router