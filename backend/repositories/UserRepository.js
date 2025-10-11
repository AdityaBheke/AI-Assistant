import User from '../models/UserModel.js';

const UserRepository = {
    // Create a new user
    async createUser(userData) {
        try {
            const user = new User(userData);
            return await user.save();
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    },
    // Find a user by email
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error('Error finding user by email: ' + error.message);
        }
    },
    // Get all users
    async getAllUsers() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            throw new Error('Error fetching all users: ' + error.message);
        }
    },
    // Update a user by ID
    async updateUserById(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }   
    },
    // Delete a user by ID
    async deleteUserById(userId) {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
};

export default UserRepository;