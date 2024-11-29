import express from "express";
import { createProduct, deleteProduct, getOneProduct, getProduct, updateProduct,
        getAllProduct, seedProducts
        } from "../controllers/ProductController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// router.get('/seeder', async (req, res) => {
//         try {
//             await seedProducts();
//             res.status(201).json({ message: 'Products have been seeded successfully!' });
//         } catch (error) {
//             res.status(500).json({ message: 'Error seeding products', error: error.message });
//         }
//     });

router.get('/all', getAllProduct);
router.get('/', getProduct);
router.get('/:id', getOneProduct);
router.post('/', upload.array('images', 10), createProduct);
router.put('/:id', upload.array('images', 10), updateProduct)
router.delete("/:id", deleteProduct)



export default router;