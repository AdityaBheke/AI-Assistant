import express from 'express';

const conversationRouter = express.Router();

// Create a new Conversation
conversationRouter.post('/', (req, res) => {
    // Conversation creation logic here
    res.send('Conversation created');
});
// Get a specific Conversation by Lead ID
conversationRouter.get('/:leadId', (req, res) => {
    res.send(`Details of conversation with Lead ID: ${req.params.leadId}`);
});
// Update a summary of Conversation by conversation ID
conversationRouter.put('/:id', (req, res) => {
    // Update conversation summary logic here
    res.send(`Summary of Conversation with ID: ${req.params.id} updated`);
});

export default conversationRouter;