import userService from "../services/UserService.js";

// Register a user
export const registerUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const result = await userService.registerUser(userData);
        return res.status(201).json({ success: true, message: 'User registered successfully', user: result.user });
    } catch (error) {
        return next(error);
    }
};
// Login a user
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser({email, password});
        return res.status(200).json({ success: true, message: 'User logged in successfully', user: result.user, token: result.token });
    } catch (error) {
        return next(error);
    }
};
// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers();
        return res.status(200).json({ success: true, message: 'Fetched all users successfully!', users: result });
    } catch (error) {
        return next(error);
    }
};
