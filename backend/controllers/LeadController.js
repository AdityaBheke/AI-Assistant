import leadService from '../services/LeadService.js';

// Create a lead
export const createLead = async (req, res, next) => {
    try {
        const leadData = req.body;
        const result = await leadService.createLead(leadData);
        return res.status(201).json({ success: true, message: 'Lead created successfully', lead: result.lead });
    } catch (error) {
        return next(error);
    }
};

// Get all leads
export const getAllLeads = async (req, res, next) => {
    try {
        const result = await leadService.getAllLeads();
        return res.status(200).json({ success: true, message: 'Fetched all leads successfully', leads: result.leads });
    } catch (error) {
        return next(error);
    }
};

// Get a lead by ID
export const getLeadById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await leadService.getLeadById(id);
        return res.status(200).json({ success: true, message: 'Fetched lead by ID successfully', lead: result.lead });
    } catch (error) {
        return next(error);
    }
};
  // Update a lead
export const updateLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const leadData = req.body;
        const result = await leadService.updateLead(id, leadData);
        return res.status(200).json({ success: true, message: 'Lead updated successfully', lead: result.lead });
    } catch (error) {
        return next(error);
    }
};

// Delete a lead
export const deleteLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        await leadService.deleteLead(id);
        return res.status(200).json({ success: true, message: 'Lead deleted successfully', lead: null });
    } catch (error) {
        return next(error);
    }
};