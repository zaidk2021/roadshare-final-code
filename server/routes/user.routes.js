import express from "express";
import { deleteUser, getAllUsers, getUser, updateUser,rateUser} from "../controllers/user.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router()

router.get("/", verifyAdmin, getAllUsers)
router.post("/rate/:id", verifyUser, rateUser)
router.get("/:id", verifyUser, getUser)
router.patch("/:id", verifyUser, updateUser)
router.delete("/:id", verifyUser, deleteUser)


export default router