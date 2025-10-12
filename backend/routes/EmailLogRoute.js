import { Router } from 'express';
import { sendEmailToLead, getEmailLogsByLeadId } from '../controllers/EmailLogController.js';
import ValidationMiddleware from '../middlewares/ValidationMiddleware.js';

const emailLogRouter = Router();

// Send an email to a lead
emailLogRouter.post('/send', ValidationMiddleware.validate(ValidationMiddleware.emailValidators.send), sendEmailToLead);
// Get list of email logs for a specific lead
emailLogRouter.get('/lead/:leadId', ValidationMiddleware.validate(ValidationMiddleware.emailValidators.byLead), getEmailLogsByLeadId);
export default emailLogRouter;