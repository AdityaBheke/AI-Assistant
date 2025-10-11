import Product from '../models/ProductModel.js';
const ProductRepository = {
    // Create a new product
    async createProduct(productData) {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    },
    // Get all products
    async getAllProducts() {
        try {
            return await Product.find();
        } catch (error) {
            throw new Error('Error fetching all products: ' + error.message);
        }
    },
    // Get a product by ID
    async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            throw new Error('Error fetching product by ID: ' + error.message);
        }
    },
    // Update a product
    async updateProduct(productId, productData) {
        try {
            return await Product.findByIdAndUpdate(productId, productData, { new: true });
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    },
    // Delete a product
    async deleteProduct(productId) {
        try {
            return await Product.findByIdAndDelete(productId);
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
};

export default ProductRepository;
