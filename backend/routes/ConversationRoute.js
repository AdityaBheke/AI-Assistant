import express from 'express';
import {
    createConversation,
    getConversationsByLeadId,
    updateConversationSummary,
    deleteConversation,
} from '../controllers/ConversationController.js';

const conversationRouter = express.Router();

// Create a new Conversation
conversationRouter.post('/', createConversation);
// Get a specific Conversation by Lead ID
conversationRouter.get('/:leadId', getConversationsByLeadId);
// Update a summary of Conversation by conversation ID
conversationRouter.put('/:id/summary', updateConversationSummary);
// Delete a conversation
conversationRouter.delete('/:id', deleteConversation);

export default conversationRouter;