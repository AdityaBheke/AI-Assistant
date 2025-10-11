
// Create a product
export const createProduct = (req, res, next) => {
    try {
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all products
export const getAllProducts = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched all products successfully' });
    } catch (error) {
        next(error);
    }
};

// Get a product by ID
export const getProductById = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched product by ID successfully' });
    } catch (error) {
        next(error);
    }
};

// Update a product
export const updateProduct = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete a product
export const deleteProduct = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};