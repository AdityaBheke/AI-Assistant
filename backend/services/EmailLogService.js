// EmailLogService: operations related to sending emails and email logs
import { ApplicationError } from '../config/ApplicationError.js';
import EmailLogRepository from '../repositories/EmailLogRepository.js';
import { sendEmail } from './../config/email.config.js'

const emailLogService = {
    // Send email to a lead and save the log
    async sendEmailToLead(leadId, to, subject, body) {
        try {
            const messageId = await sendEmail(to, subject, body);
            // After sending email, save log
            const savedLog = await EmailLogRepository.saveEmailLog({
                leadId: leadId,
                subject: subject,
                body: body,
                messageId: messageId,
                sentAt: new Date(),
                status: 'sent'
            });

            return {emailLog: savedLog};
        } catch (error) {
            throw new ApplicationError('Failed to send email to lead: ' + error.message, 500);
        }
    },

    async updateEmailLogByMessageId(messageId){
        try {
            const emailLog = await EmailLogRepository.updateEmailLogByMessageId(messageId);
            return emailLog
        } catch (error) {
            throw new ApplicationError('Failed to update emaillog by messageId: ' + error.message, 500);
        }
    },
    // Update email log status (e.g., sent, failed, pending)
    async updateEmailLogStatus(emailLogId, status) {
        try {
            const updatedLog = await EmailLogRepository.updateEmailLogStatusById(emailLogId, status);
            return {emailLog: updatedLog};
        } catch (error) {
            throw new ApplicationError('Failed to update email log status: ' + error.message, 500);
        }
    },

};

export default emailLogService;
