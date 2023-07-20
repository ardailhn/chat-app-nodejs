import express from "express";
import { getAllUsers, createNewUser, updateUser } from "../controllers/usersController.js";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT.js";

router.route('/').post(createNewUser);

router.use(verifyJWT);

router.route('/').get(getAllUsers);
router.route('/').patch(updateUser);

export default router;