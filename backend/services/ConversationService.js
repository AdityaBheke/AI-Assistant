import ConversationRepository from "../repositories/ConversationRepository.js";
import { ApplicationError } from "../config/ApplicationError.js";

// conversationService: operations around conversations and summaries
const conversationService = {
    // Create a new conversation
    createConversation: async (conversationData) => {
        try {
            const conversation = await ConversationRepository.createConversation(conversationData);
            return {conversation};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while creating conversation', error.statusCode || 500);
        }
    },

    // Fetch conversations for a lead
    getConversationsByLeadId: async (leadId) => {
        try {
            const conversations = await ConversationRepository.getConversationsByLeadId(leadId);
            return {conversations};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while fetching conversations by Lead ID', error.statusCode || 500);
        }
    },
    // Update conversation summary
    updateConversationSummary: async (conversationId, summary) => {
        try {
            const updatedConversation = await ConversationRepository.updateConversationSummaryById(conversationId, summary);
            if (!updatedConversation) {
                throw new ApplicationError('Conversation not found', 404);
            }
            return {conversation: updatedConversation};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while updating conversation summary', error.statusCode || 500);
        }
    },
    // Delete a conversation
    deleteConversation: async (conversationId) => {
        try {
            const deletedConversation = await ConversationRepository.deleteConversationById(conversationId);
            if (!deletedConversation) {
                throw new ApplicationError('Conversation not found', 404);
            }
            return {conversation: deletedConversation};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while deleting conversation', error.statusCode || 500);
        }
    },
    // Get latest conversation summary for a lead
    getLatestConversationSummaryByLeadId: async (leadId) => {
        try {
            const summary = await ConversationRepository.getLatestConversationSummaryByLeadId(leadId);
            return {summary};
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while fetching latest conversation summary by Lead ID', error.statusCode || 500);
        }
    }
}

export default conversationService;