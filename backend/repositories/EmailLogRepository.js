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

    async updateEmailLogByMessageId(messageId){
        try {
            const emailLog = await EmailLog.findOneAndUpdate({messageId: messageId, status:'sent'}, {status:"replied"}, {new:true})
            return emailLog;
        } catch (error) {
            throw new Error('Error updating email log: ' + error.message);
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
};

export default EmailLogRepository;
