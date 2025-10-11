import { Router } from 'express';
import { sendEmailToLead, getEmailLogsByLeadId } from '../controllers/EmailLogController.js';

const emailLogRouter = Router();

// Send an email to a lead
emailLogRouter.post('/send', sendEmailToLead);
// Get list of email logs for a specific lead
emailLogRouter.get('/lead/:leadId', getEmailLogsByLeadId);
export default emailLogRouter;