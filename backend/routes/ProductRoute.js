import express from 'express';
import { createProduct, getAllProducts, getProductById } from '../controllers/ProductController.js';
import ValidationMiddleware from '../middlewares/ValidationMiddleware.js';

const productRouter = express.Router();
// Get all Products
productRouter.get('/', getAllProducts);
// Create a new Product
productRouter.post('/', ValidationMiddleware.validate(ValidationMiddleware.productValidators.create), createProduct);
// Get a specific Product by ID
productRouter.get('/:id', getProductById);
export default productRouter;