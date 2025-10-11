import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from './../repositories/UserRepository.js';
import {ApplicationError} from './../config/ApplicationError.js';

// userService: authentication and user-related business logic
const userService = {
    // Register a new user
    registerUser: async (userData) => {
        const {name, email, password, role} = userData;
        try {
            const existingUser = await UserRepository.findUserByEmail(email);
            if (existingUser) {
                throw new ApplicationError('user already exists', 409);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { name, email, password: hashedPassword, role: role || 'user' };
            const createdUser = await UserRepository.createUser(user);
            const { password: _, ...userWithoutPassword } = createdUser.toObject();
            return { user: userWithoutPassword };
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while registering user', error.statusCode || 500);
        }
    },

    // Authenticate user and return token
    loginUser: async (credentials) => {
        const { email, password } = credentials;
        try {
            const user = await UserRepository.findUserByEmail(email);
            if (!user) throw new ApplicationError('Invalid email or password', 401);

            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) throw new ApplicationError('Invalid email or password', 401);

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            const { password: _, ...userWithoutPassword } = user.toObject();
            return { user: userWithoutPassword, token };
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while logging in', error.statusCode || 500);
        }
    },

    // Fetch all users (without passwords)
    getAllUsers: async () => {
        try {
            const users = await UserRepository.getAllUsers();
            return users.map((user) => {
                const { password: _, ...userWithoutPassword } = user.toObject();
                return userWithoutPassword;
            });
        } catch (error) {
            throw new ApplicationError(error.message || 'Error while fetching all users', error.statusCode || 500);
        }
    },
};

export default userService;