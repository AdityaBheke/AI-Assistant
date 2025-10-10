import express from 'express';

const productRouter = express.Router();
// Get all Products
productRouter.get('/', (req, res) => {
    res.send('List of all products');
}); 
// Create a new Product
productRouter.post('/', (req, res) => {
    // Product creation logic here
    res.send('Product created');
});
// Get a specific Product by ID
productRouter.get('/:id', (req, res) => {
    // Fetch product by ID logic here
    res.send(`Details of product with ID: ${req.params.id}`);
});
export default productRouter;