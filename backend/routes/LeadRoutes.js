import express from 'express';
import {
    createLead,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead,
} from '../controllers/LeadController.js';
import ValidationMiddleware from '../middlewares/ValidationMiddleware.js';

const leadRouter = express.Router();

// Get all Leads
leadRouter.get('/', getAllLeads);
// Create a new Lead
leadRouter.post('/', ValidationMiddleware.validate(ValidationMiddleware.leadValidators.create), createLead);
// Get a specific Lead by ID
leadRouter.get('/:id', ValidationMiddleware.validate(ValidationMiddleware.leadValidators.byId), getLeadById);
// Update a specific Lead by ID
leadRouter.put('/:id', ValidationMiddleware.validate(ValidationMiddleware.leadValidators.update), updateLead);
// Delete a specific Lead by ID
leadRouter.delete('/:id', ValidationMiddleware.validate(ValidationMiddleware.leadValidators.byId), deleteLead);

export default leadRouter;