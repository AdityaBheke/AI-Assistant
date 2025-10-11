import leadService from '../services/LeadService.js';

// Create a lead
export const createLead = async (req, res, next) => {
    try {
        const leadData = req.body;
        const result = await leadService.createLead(leadData);
        res.status(201).json({ message: 'Lead created successfully', lead: result.lead });
    } catch (error) {
        next(error);
    }
};

// Get all leads
export const getAllLeads = async (req, res, next) => {
    try {
        const result = await leadService.getAllLeads();
        res.status(200).json({ message: 'Fetched all leads successfully', leads: result.leads });
    } catch (error) {
        next(error);
    }
};

// Get a lead by ID
export const getLeadById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await leadService.getLeadById(id);
        res.status(200).json({ message: 'Fetched lead by ID successfully', lead: result.lead });
    } catch (error) {
        next(error);
    }
};  
// Update a lead
export const updateLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const leadData = req.body;
        const result = await leadService.updateLead(id, leadData);
        res.status(200).json({ message: 'Lead updated successfully', lead: result.lead });
    } catch (error) {
        next(error);
    }
};

// Delete a lead
export const deleteLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        await leadService.deleteLead(id);
        res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
        next(error);
    }
};