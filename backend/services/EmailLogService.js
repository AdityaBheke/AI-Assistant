// EmailLogService: operations related to sending emails and email logs
import { ApplicationError } from '../config/ApplicationError.js';
import EmailLogRepository from '../repositories/EmailLogRepository.js';

const emailLogService = {
    // Send email to a lead and save the log
    async sendEmailToLead(emailData) {
        try {
            // await EmailService.send(emailData);

            // After sending email, save log
            const savedLog = await EmailLogRepository.saveEmailLog({
                leadId: emailData.leadId,
                subject: emailData.subject,
                body: emailData.body,
                sentAt: new Date(),
                status: 'sent'
            });

            return {emailLog: savedLog};
        } catch (error) {
            throw new ApplicationError('Failed to send email to lead: ' + error.message, 500);
        }
    },

    // Get all email logs for a specific lead
    async getEmailLogsByLeadId(leadId) {
        try {
            const logs = await EmailLogRepository.getEmailLogsByLeadId(leadId);
            return {emailLogs: logs};
        } catch (error) {
            throw new ApplicationError('Failed to fetch email logs by Lead ID: ' + error.message, 500);
        }
    },

    // Get last email log for a specific lead
    async getLastEmailLogByLeadId(leadId) {
        try {
            const [lastLog] = await EmailLogRepository.getLastEmailLogByLeadId(leadId);
            return {emailLog: lastLog || null};
        } catch (error) {
            throw new ApplicationError('Failed to fetch last email log by Lead ID: ' + error.message, 500);
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

    // Get emails pending follow-up after X days
    async getPendingFollowUpEmails(daysInterval) {
        try {
            const pendingEmails = await EmailLogRepository.getPendingFollowUpEmails(daysInterval);
            return {emailLogs: pendingEmails};
        } catch (error) {
            throw new ApplicationError('Failed to fetch pending follow-up emails: ' + error.message, 500);
        }
    }
};

export default emailLogService;
