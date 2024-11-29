import express from "express";
import { createUser, deleteUser, getOneUser, getUser, updateUser, addToCart, checkout } from "../controllers/UserController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get('/', getUser);
router.get('/:id', getOneUser);
router.post('/', upload.array('images', 10), createUser);
router.put('/:id', upload.array('images', 10), updateUser)
router.delete("/:id", deleteUser)

router.post('/add-to-cart', addToCart);
router.post('/checkout', checkout);


export default router;