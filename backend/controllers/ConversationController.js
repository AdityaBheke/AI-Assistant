import conversationService from "../services/ConversationService.js";
// Create a conversation
export const createConversation = async (req, res, next) => {
    try {
        const conversationData = req.body;
        const result = await conversationService.createConversation(conversationData);
        res.status(201).json({ message: 'Conversation created successfully', conversation: result.conversation });
    } catch (error) {
        next(error);
    }
};

// Get conversations by lead ID
export const getConversationsByLeadId = async(req, res, next) => {
    try {
        const { leadId } = req.params;
        const result = await conversationService.getConversationsByLeadId(leadId);
        res.status(200).json({ message: 'Fetched conversations by Lead ID successfully', conversations: result.conversations });
    } catch (error) {
        next(error);
    }
};

// Update the conversation summary
export const updateConversationSummary = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { summary } = req.body;
        const result = await conversationService.updateConversationSummary(id, summary);
        res.status(200).json({ message: 'Conversation summary updated successfully', conversation: result.conversation });
    } catch (error) {
        next(error);
    }
};
// Delete a conversation
export const deleteConversation = async (req, res, next) => {
    try {
        const { id } = req.params;
        await conversationService.deleteConversation(id);
        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        next(error);
    }
};