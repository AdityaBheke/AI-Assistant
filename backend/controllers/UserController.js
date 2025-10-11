import userService from "../services/UserService.js";

// Register a user
export const registerUser = async (req, res, next) => {
    try {
        const userData = req.body;
        const result = await userService.registerUser(userData);
        res.status(201).json({ message: 'User registered successfully', user: result.user });
    } catch (error) {
        next(error);
    }
};
// Login a user
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser({email, password});
        res.status(200).json({ message: 'User logged in successfully', user: result.user, token: result.token });
    } catch (error) {
        next(error);
    }
};
// Get all users
export const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({ message: 'Fetched all users successfully!', users: result });
    } catch (error) {
        next(error);
    }
};
