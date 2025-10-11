import Conversation from '../models/ConversationModel.js';
const ConversationRepository = {
    // Create a new conversation
    async createConversation(conversationData) {
        try {
            const conversation = new Conversation(conversationData);
            return await conversation.save();
        } catch (error) {
            throw new Error('Error creating conversation: ' + error.message);
        }
    },
    
    // Get a conversation by Lead ID
    async getConversationsByLeadId(leadId) {
        try {
            return await Conversation.find({ leadId });
        } catch (error) {
            throw new Error('Error fetching conversations by Lead ID: ' + error.message);
        }
    },
    
    // Update conversation summary by conversation ID
    async updateConversationSummaryById(conversationId, summary) {
        try {
            return await Conversation.findByIdAndUpdate(conversationId, { summary }, { new: true });
        } catch (error) {
            throw new Error('Error updating conversation summary: ' + error.message);
        }
    },
    // Get latest conversation summary by Lead ID
    async getLatestConversationSummaryByLeadId(leadId) {
        try {
            const conversations = await Conversation.find({ leadId }).sort({ createdAt: -1 }).limit(1);
            return conversations.length > 0 ? conversations[0].summary : null;
        } catch (error) {
            throw new Error('Error fetching latest conversation summary by Lead ID: ' + error.message);
        }
    },
    // Delete a conversation by ID
    async deleteConversationById(conversationId) {
        try {
            return await Conversation.findByIdAndDelete(conversationId);
        } catch (error) {
            throw new Error('Error deleting conversation: ' + error.message);
        }
    }
};

export default ConversationRepository;
