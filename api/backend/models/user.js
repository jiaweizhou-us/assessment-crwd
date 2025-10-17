// models/user.js

// Simple user model placeholder. In a real app this would interface with a database.
// user.js - User data model with enhanced features
const { users } = require('../mockData');

class UserModel {
    static getAllUsers() {
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    static getUserById(userId) {
        const user = users.find(user => user.id === userId);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    static getUserByUsername(username) {
        return users.find(user => user.username === username);
    }

    static createUser(userData) {
        const newUser = {
            id: `user${users.length + 1}`,
            ...userData,
            status: 'active',
            created_at: new Date().toISOString().split('T')[0],
            total_earned: 0,
            reviews_completed: 0,
            role: 'user'
        };
        users.push(newUser);
        return newUser;
    }

    static updateUserEarnings(userId, amount) {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.total_earned += amount;
            user.reviews_completed += 1;
        }
        return user;
    }

    static getUserStats() {
        const total = users.filter(u => u.role !== 'admin').length;
        const active = users.filter(u => u.status === 'active' && u.role !== 'admin').length;
        const totalEarnings = users.reduce((sum, u) => sum + (u.total_earned || 0), 0);
        const avgEarnings = active > 0 ? (totalEarnings / active).toFixed(2) : 0;
        
        return { total, active, totalEarnings, avgEarnings };
    }

    static flagUser(userId, reason) {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.status = 'flagged';
            user.flag_reason = reason;
            user.flagged_at = new Date().toISOString().split('T')[0];
        }
        return user;
    }

    static unflagUser(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.status = 'active';
            delete user.flag_reason;
            delete user.flagged_at;
        }
        return user;
    }
}

module.exports = UserModel;
