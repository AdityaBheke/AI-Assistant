import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/ProductController.js';

const productRouter = express.Router();
// Get all Products
productRouter.get('/', getAllProducts);
// Create a new Product
productRouter.post('/', createProduct);
// Get a specific Product by ID
productRouter.get('/:id', getProductById);
export default productRouter;