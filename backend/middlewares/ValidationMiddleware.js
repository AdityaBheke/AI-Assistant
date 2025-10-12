import { body, param, validationResult } from 'express-validator';

// Reusable validators
const userValidators = {
    register: [
        body('name').exists().isString().withMessage('Name is required and must be a string'),
        body('email').exists().isEmail().withMessage('Valid email is required'),
        body('password').exists().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    login: [
        body('email').exists().isEmail().withMessage('Valid email is required'),
        body('password').exists().withMessage('Password is required'),
    ],
};

const productValidators = {
    create: [
        body('name').exists().isString().withMessage('Product name is required'),
        body('price').exists().isNumeric().withMessage('Product price is required and must be a number'),
        body('description').exists().isString().withMessage('Description is required and must be a string'),
    ],
};

const leadValidators = {
    create: [
        body('name').optional().isString().withMessage('Lead name must be a string'),
        body('email').optional().isEmail().withMessage('Email must be valid'),
        body('phone').optional().isString().withMessage('Phone must be a string'),
    ],
    update: [
        param('id').exists().isString().withMessage('Lead id is required'),
        body('name').optional().isString().withMessage('Lead name must be a string'),
        body('email').optional().isEmail().withMessage('Email must be valid'),
    ],
    byId: [param('id').exists().isString().withMessage('Lead id is required')],
};

const emailValidators = {
    send: [
        body('leadId').exists().isMongoId().withMessage('leadId is required and must be a valid ObjectId'),
        body('subject').exists().isString().withMessage('subject is required'),
        body('body').exists().isString().withMessage('body is required'),
    ],
    byLead: [param('leadId').exists().isString().withMessage('leadId is required')],
};

const conversationValidators = {
    create: [
        body('leadId').exists().isMongoId().withMessage('leadId is required and must be a valid ObjectId'),
        body('messages').optional().isArray().withMessage('messages must be an array'),
    ],
    byLead: [param('leadId').exists().isString().withMessage('leadId is required')],
    updateSummary: [param('id').exists().isMongoId().withMessage('conversation id is required and must be a valid ObjectId'), body('summary').exists().isString().withMessage('summary is required')],
    byId: [param('id').exists().isMongoId().withMessage('id is required and must be a valid ObjectId')],
};

// middleware to check validation result and send standardized response
const validate = (checks) => async (req, res, next) => {
    await Promise.all(checks.map((c) => c.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array() });
    }
    return next();
};

export default {
    userValidators,
    productValidators,
    leadValidators,
    emailValidators,
    conversationValidators,
    validate,
};
