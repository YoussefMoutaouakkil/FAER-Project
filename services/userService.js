const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserService {
    // Create a new user
    async createUser(userData) {
        try {
            const { firstName, lastName, email, phone, password } = userData;
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert user into database
            const [result] = await pool.execute(
                'INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)',
                [firstName, lastName, email, phone, hashedPassword]
            );
            
            // Get the created user (without password)
            const [users] = await pool.execute(
                'SELECT id, firstName, lastName, email, phone, createdAt FROM users WHERE id = ?',
                [result.insertId]
            );
            
            return users[0];
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('User with this email already exists');
            }
            throw error;
        }
    }
    
    // Find user by email
    async findByEmail(email) {
        try {
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Find user by ID
    async findById(id) {
        try {
            const [users] = await pool.execute(
                'SELECT id, firstName, lastName, email, phone, createdAt FROM users WHERE id = ?',
                [id]
            );
            return users[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Update user profile
    async updateUser(id, updateData) {
        try {
            const { firstName, lastName, phone } = updateData;
            
            await pool.execute(
                'UPDATE users SET firstName = ?, lastName = ?, phone = ? WHERE id = ?',
                [firstName, lastName, phone, id]
            );
            
            return await this.findById(id);
        } catch (error) {
            throw error;
        }
    }
    
    // Store user session
    async storeSession(userId, token, expiresAt) {
        try {
            await pool.execute(
                'INSERT INTO user_sessions (userId, token, expiresAt) VALUES (?, ?, ?)',
                [userId, token, expiresAt]
            );
        } catch (error) {
            throw error;
        }
    }
    
    // Remove user session
    async removeSession(token) {
        try {
            await pool.execute(
                'DELETE FROM user_sessions WHERE token = ?',
                [token]
            );
        } catch (error) {
            throw error;
        }
    }
    
    // Validate session
    async validateSession(token) {
        try {
            const [sessions] = await pool.execute(
                'SELECT * FROM user_sessions WHERE token = ? AND expiresAt > NOW()',
                [token]
            );
            return sessions[0] || null;
        } catch (error) {
            throw error;
        }
    }
    
    // Clean expired sessions
    async cleanExpiredSessions() {
        try {
            await pool.execute(
                'DELETE FROM user_sessions WHERE expiresAt <= NOW()'
            );
        } catch (error) {
            throw error;
        }
    }
    
    // Get all users (for admin purposes)
    async getAllUsers() {
        try {
            const [users] = await pool.execute(
                'SELECT id, firstName, lastName, email, phone, createdAt FROM users ORDER BY createdAt DESC'
            );
            return users;
        } catch (error) {
            throw error;
        }
    }
    
    // Delete user (for admin purposes)
    async deleteUser(id) {
        try {
            await pool.execute('DELETE FROM users WHERE id = ?', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService(); 