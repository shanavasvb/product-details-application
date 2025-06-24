const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoute=require('./routes/admin')

const app = express();
 
// Middleware
app.use(cors()); /*cross origin resource sharing  * CORS allows restricted resources on a web page to be accessed from another domain outside the domain from which the resource originated.This is essential for enabling communication between the frontend and backend hosted on different origins.
*/
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin',adminRoute)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Create default admin
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ phoneNumber: '1234567890' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Default Admin',
                phoneNumber: '1234567890',
                password: hashedPassword,
                is_admin: true,
                status: true,
                organization: 'Datcarts'
            });
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

createDefaultAdmin();

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});