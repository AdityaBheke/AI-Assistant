import { ApplicationError } from "../config/ApplicationError.js";
import LeadRepository from "../repositories/LeadRepository.js"

// leadService: business logic for lead management
const leadService = {
    // Create a new lead
    createLead: async (leadData)=>{
        try {
            const lead = await LeadRepository.createLead(leadData);
            return {lead};
        } catch (error) {
            throw new ApplicationError(err.message || "Error creating lead", err.statusCode || 500);
        }
    },
    // Retrieve all leads
    getAllLeads: async ()=>{
        try {
            const leads = await LeadRepository.getAllLeads();
            return {leads};
        } catch (error) {
            throw new ApplicationError(err.message || "Error fetching leads", err.statusCode || 500);
        }
    },
    // Get a lead by ID
    getLeadById: async (leadId)=>{
        try {
            const lead = await LeadRepository.getLeadById(leadId);
            if (!lead) throw new ApplicationError("Lead not found", 404)
            return {lead}
        } catch (error) {
            throw new ApplicationError(err.message || "Error fetching lead", err.statusCode || 500);
        }
    },
    // Update a lead by ID
    updateLead: async (leadId, updateData)=>{
        try {
            const lead = await LeadRepository.updateLeadById(leadId, updateData);
            if (!lead) throw new ApplicationError("Lead not found", 404)
            return {lead}
        } catch (error) {
            throw new ApplicationError(err.message || "Error fetching lead", err.statusCode || 500);
        }
    },
    // Delete a lead by ID
    deleteLead: async (leadId)=>{
        try {
            const lead = await LeadRepository.deleteLeadById(leadId);
            if (!lead) throw new ApplicationError("Lead not found", 404);
            return {lead}
        } catch (error) {
            throw new ApplicationError(err.message || "Error fetching lead", err.statusCode || 500);
        }
    },
    // Update lead status
    updateLeadStatus: async (leadId, status)=>{
        try {
            const lead = await LeadRepository.updateLeadStatusById(leadId, status);
            if (!lead) throw new ApplicationError("Lead not found", 404);
            return { lead }
        } catch (error) {
            throw new ApplicationError(err.message || "Error fetching lead", err.statusCode || 500);
        }
    },
    // Find leads by email
    findLeadsByEmail: async (email)=>{
        try {
            const lead = await LeadRepository.findLeadsByEmail(email);
            if (!lead) throw new ApplicationError("Lead not found", 404)
        } catch (error) {
            throw new ApplicationError(err.message || "Error fetching lead", err.statusCode || 500);
        }
    }
}

export default leadService;