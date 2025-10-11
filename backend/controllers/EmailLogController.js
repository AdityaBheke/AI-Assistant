
// Send an email to a lead
export const sendEmailToLead = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Email sent to lead successfully' });
    } catch (error) {
        next(error);
    }
};

// Get email logs by lead ID
export const getEmailLogsByLeadId = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched email logs by Lead ID successfully' });
    } catch (error) {
        next(error);
    }
};