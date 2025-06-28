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
// Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productLineRoutes = require('./routes/productLine');
const productRoutes = require('./routes/productRoutes');
const enrichedProductRoute = require('./routes/enrichedProduct');
app.use('/api/v1/productLine', productLineRoutes);
app.use('/api/v1/enriched-products', enrichedProductRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/products', productRoutes); // ✅ moved up

app.use('/api/v1/product', require('./routes/product'));
app.use('/api/v1/categories', require('./routes/category'));
app.use('/api/v1/productLines', require('./routes/productLineRoute'));
app.use('/api/v1/brands', require('./routes/brand'));
app.use('/api/v1/approvalNotify',require('./routes/approvalNotify'));

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