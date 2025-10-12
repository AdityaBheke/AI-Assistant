import productService from "../services/ProductService.js";

// Create a product
export const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const result = await productService.createProduct(productData);
        return res.status(201).json({ success: true, message: 'Product created successfully', product: result.product });
    } catch (error) {
        return next(error);
    }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getProducts();
        return res.status(200).json({ success: true, message: 'Fetched all products successfully', products: result.products });
    } catch (error) {
        return next(error);
    }
};

// Get a product by ID
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.getProductById(id);
        return res.status(200).json({ success: true, message: 'Fetched product by ID successfully', product: result.product });
    } catch (error) {
        return next(error);
    }
};

// Update a product
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const result = await productService.updateProduct(id, productData);
        return res.status(200).json({ success: true, message: 'Product updated successfully', product: result.product });
    } catch (error) {
        return next(error);
    }
};

// Delete a product
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        return res.status(200).json({ success: true, message: 'Product deleted successfully', product: null });
    } catch (error) {
        return next(error);
    }
};