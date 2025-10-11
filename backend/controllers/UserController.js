
// Register a user
export const registerUser = (req, res, next) => {
    try {
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};
// Login a user
export const loginUser = (req, res, next) => {
    try {
        res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        next(error);
    }
};
// Get all users
export const getAllUsers = (req, res, next) => {
    try {
        res.status(200).json({ message: 'Fetched all users successfully' });
    } catch (error) {
        next(error);
    }
};
