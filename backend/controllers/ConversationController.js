import conversationService from "../services/ConversationService.js";

// Create a conversation
export const createConversation = async (req, res, next) => {
    try {
        const conversationData = req.body;
        const result = await conversationService.createConversation(conversationData);
        return res.status(201).json({ success: true, message: 'Conversation created successfully', conversation: result.conversation });
    } catch (error) {
        return next(error);
    }
};

// Get conversations by lead ID
export const getConversationsByLeadId = async(req, res, next) => {
    try {
        const { leadId } = req.params;
        const result = await conversationService.getConversationsByLeadId(leadId);
        return res.status(200).json({ success: true, message: 'Fetched conversations by Lead ID successfully', conversations: result.conversations });
    } catch (error) {
        return next(error);
    }
};

// Update the conversation summary
export const updateConversationSummary = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { summary } = req.body;
        const result = await conversationService.updateConversationSummary(id, summary);
        return res.status(200).json({ success: true, message: 'Conversation summary updated successfully', conversation: result.conversation });
    } catch (error) {
        return next(error);
    }
};

// Delete a conversation
export const deleteConversation = async (req, res, next) => {
    try {
        const { id } = req.params;
        await conversationService.deleteConversation(id);
        return res.status(200).json({ success: true, message: 'Conversation deleted successfully', conversation: null });
    } catch (error) {
        return next(error);
    }
};