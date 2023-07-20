import express from "express";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT.js";
import { getMessages, postMessages } from "../controllers/messageController.js";

router.use(verifyJWT);

router.route('/')
    .get(getMessages)
    .post(postMessages)

export default router;