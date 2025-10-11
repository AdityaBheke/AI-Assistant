
// Create a lead
export const createLead = (req, res, next) => {
    try {
        res.status(201).json({ message: 'Lead created successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all leads
export const getAllLeads = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched all leads successfully' });
    } catch (error) {
        next(error);
    }
};

// Get a lead by ID
export const getLeadById = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched lead by ID successfully' });
    } catch (error) {
        next(error);
    }
};  
// Update a lead
export const updateLead = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Lead updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete a lead
export const deleteLead = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Lead deleted successfully' }); 
    } catch (error) {
        next(error);
    }
};