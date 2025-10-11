import { ApplicationError } from "../config/ApplicationError";
import ProductRepository from "../repositories/ProductRepository.js";

// ProductService: business logic for product operations
const ProductService = {
    createProduct: async (productData) => {
        // Create and return a new product
        try {
            const product = await ProductRepository.createProduct(productData);
            return {product};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while creating product', error.statusCode || 500);
        }
    },

    getProducts: async () => {
        // Retrieve list of products
        try {
            const products = await ProductRepository.getAllProducts();
            return {products};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while fetching products', error.statusCode || 500);
        }
    },

    getProductById: async (productId) => {
        // Get single product by ID
        try {
            const product = await ProductRepository.getProductById(productId);
            if (!product) {
                throw new ApplicationError('Product not found', 404);
            }
            return {product};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while fetching product by ID', error.statusCode || 500);
        }
    },

    updateProduct: async (productId, productData) => {
        // Update product and return updated record
        try {
            const updatedProduct = await ProductRepository.updateProduct(productId, productData);
            if (!updatedProduct) {
                throw new ApplicationError('Product not found', 404);
            }
            return {product: updatedProduct};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while updating product', error.statusCode || 500);
        }
    },

    deleteProduct: async (productId) => {
        // Delete product by ID
        try {
            const deletedProduct = await ProductRepository.deleteProduct(productId);
            if (!deletedProduct) {
                throw new ApplicationError('Product not found', 404);
            }
            return {product: deletedProduct};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while deleting product', error.statusCode || 500);
        }
    }
}

export default ProductService;
