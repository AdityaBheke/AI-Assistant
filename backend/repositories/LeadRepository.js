import Lead from '../models/LeadModel.js';
const LeadRepository = {
    // Create a new lead
    async createLead(leadData) {
        try {
            const lead = new Lead(leadData);
            return await lead.save();
        } catch (error) {
            throw new Error('Error creating lead: ' + error.message);
        }
    },
    // Get all leads
    async getAllLeads() {
        try {
            return await Lead.find();
        } catch (error) {
            throw new Error('Error fetching all leads: ' + error.message);
        }
    },
    // Get a lead by ID
    async getLeadById(leadId) {
        try {
            return await Lead.findById(leadId);
        } catch (error) {
            throw new Error('Error fetching lead by ID: ' + error.message);
        }
    },
    // Update a lead by ID
    async updateLeadById(leadId, updateData) {
        try {
            return await Lead.findByIdAndUpdate(leadId, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating lead: ' + error.message);
        }
    },
    // Delete a lead by ID
    async deleteLeadById(leadId) {
        try {
            return await Lead.findByIdAndDelete(leadId);
        } catch (error) {
            throw new Error('Error deleting lead: ' + error.message);
        }
    },
    // Get pending leads
    async getPendingLeads(){
        try {
            return await Lead.find({status: "new"}) 
        } catch (error) {
            throw new Error('Error fetching pending lead: ' + error.message);
        }
    },
    // Update lead status by ID
    async updateLeadStatusById(leadId, status) {
        try {
            return await Lead.findByIdAndUpdate(leadId, { status }, { new: true });
        } catch (error) {
            throw new Error('Error updating lead status: ' + error.message);
        }
    },
    // Find leads by email
    async findLeadsByEmail(email) {
        try {
            const lead = await Lead.findOne({ email });
            console.log('Lead found:', lead);
            return lead;
        } catch (error) {
            throw new Error('Error finding leads by email: ' + error.message);
        }
    }
};

export default LeadRepository;
