const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false // false = pending, true = approved
    },
    organization: {
        type: String,
        required: true  
    }
}, {
    timestamps: true,
    collection: 'user'
});

module.exports = mongoose.model('User', userSchema);