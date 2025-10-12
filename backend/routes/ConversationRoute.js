import express from 'express';
import {
    createConversation,
    getConversationsByLeadId,
    updateConversationSummary,
    deleteConversation,
} from '../controllers/ConversationController.js';
import ValidationMiddleware from '../middlewares/ValidationMiddleware.js';

const conversationRouter = express.Router();

// Create a new Conversation
conversationRouter.post('/', ValidationMiddleware.validate(ValidationMiddleware.conversationValidators.create), createConversation);
// Get a specific Conversation by Lead ID
conversationRouter.get('/:leadId', ValidationMiddleware.validate(ValidationMiddleware.conversationValidators.byLead), getConversationsByLeadId);
// Update a summary of Conversation by conversation ID
conversationRouter.put('/:id/summary', ValidationMiddleware.validate(ValidationMiddleware.conversationValidators.updateSummary), updateConversationSummary);
// Delete a conversation
conversationRouter.delete('/:id', ValidationMiddleware.validate(ValidationMiddleware.conversationValidators.byId), deleteConversation);

export default conversationRouter;