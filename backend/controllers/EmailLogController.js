import emailLogService from "../services/EmailLogService.js";

// Send an email to a lead
export const sendEmailToLead = async (req, res, next) => {
    try {
        const emailData = req.body;
        const result = await emailLogService.sendEmailToLead(emailData);
        return res.status(200).json({ success: true, message: 'Email sent to lead successfully', email: result.email });
    } catch (error) {
        return next(error);
    }
};

// Get email logs by lead ID
export const getEmailLogsByLeadId = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const result = await emailLogService.getEmailLogsByLeadId(leadId);
        return res.status(200).json({ success: true, message: 'Fetched email logs by Lead ID successfully', emailLogs: result.emailLogs });
    } catch (error) {
        return next(error);
    }
};