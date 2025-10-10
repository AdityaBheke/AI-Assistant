import { Router } from "express";

const emailLogRouter = Router();

// Send an email to a lead
emailLogRouter.post('/send', (req, res) => {
    // Email sending logic here
    res.send('Email sent to lead');
});
// Get list of email logs for a specific lead
emailLogRouter.get('/lead/:leadId', (req, res) => {
    res.send(`Email logs for lead with ID: ${req.params.leadId}`);
});
export default emailLogRouter;