import express from 'express';
import {
    createLead,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead,
} from '../controllers/LeadController.js';

const leadRouter = express.Router();

// Get all Leads
leadRouter.get('/', getAllLeads);
// Create a new Lead
leadRouter.post('/', createLead);
// Get a specific Lead by ID
leadRouter.get('/:id', getLeadById);
// Update a specific Lead by ID
leadRouter.put('/:id', updateLead);
// Delete a specific Lead by ID
leadRouter.delete('/:id', deleteLead);

export default leadRouter;