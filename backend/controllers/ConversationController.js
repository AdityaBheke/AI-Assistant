
// Create a conversation
export const createConversation = (req, res, next) => {
    try {
        res.status(201).json({ message: 'Conversation created successfully' });
    } catch (error) {
        next(error);
    }
};

// Get conversations by lead ID
export const getConversationsByLeadId = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched conversations by Lead ID successfully' });
    } catch (error) {
        next(error);
    }
};

// Update the conversation summary
export const updateConversationSummary = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Conversation summary updated successfully' });
    } catch (error) {
        next(error);
    }
};
// Delete a conversation
export const deleteConversation = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        next(error);
    }
};