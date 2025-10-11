import EmailLog from '../models/EmailLogModel.js';
const EmailLogRepository = {
    // Save sent email log
    async saveEmailLog(emailLogData) {
        try {
            const emailLog = new EmailLog(emailLogData);
            return await emailLog.save();
        } catch (error) {
            throw new Error('Error saving email log: ' + error.message);
        }
    },
    // Get email logs by Lead ID
    async getEmailLogsByLeadId(leadId) {
        try {
            return await EmailLog.find({ leadId });
        } catch (error) {
            throw new Error('Error fetching email logs by Lead ID: ' + error.message);
        }
    },
    // Get last email log by Lead ID
    async getLastEmailLogByLeadId(leadId) {
        try {
            return await EmailLog.find({ leadId }).sort({ sentAt: -1 }).limit(1);
        } catch (error) {
            throw new Error('Error fetching last email log by Lead ID: ' + error.message);
        }   
    },
     // Update email log status by ID
    async updateEmailLogStatusById(emailLogId, status) {
        try {
            return await EmailLog.findByIdAndUpdate(emailLogId, { status }, { new: true });
        } catch (error) {
            throw new Error('Error updating email log status: ' + error.message);
        }   
    },
    // Find leads for next follow-up
    async getPendingFollowUpEmails(daysInterval) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysInterval);
            return await EmailLog.find({ sentAt: { $lt: cutoffDate }, status: 'sent' });
        } catch (error) {
            throw new Error('Error fetching pending follow-up emails: ' + error.message);
        }
    }
};

export default EmailLogRepository;
