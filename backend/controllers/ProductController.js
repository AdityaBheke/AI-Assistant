import productService from "../services/ProductService.js";

// Create a product
export const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const result = await productService.createProduct(productData);
        res.status(201).json({ message: 'Product created successfully', product: result.product });
    } catch (error) {
        next(error);
    }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getProducts();
        res.status(200).json({ message: 'Fetched all products successfully', products: result.products });
    } catch (error) {
        next(error);
    }
};

// Get a product by ID
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.getProductById(id);
        res.status(200).json({ message: 'Fetched product by ID successfully', product: result.product });
    } catch (error) {
        next(error);
    }
};

// Update a product
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const result = await productService.updateProduct(id, productData);
        res.status(200).json({ message: 'Product updated successfully', product: result.product });
    } catch (error) {
        next(error);
    }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};