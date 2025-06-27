const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String, //editing, registratio request
    required: true
  },
  senderId: {
    type: String, // employeeID
    required: true
  },
  receiverRole: {
    type: String, //mostly, the reciever will be admin
    required: true
  },
  relatedId: {
    type: String, 
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'notifications',
});

module.exports = mongoose.model('Notification', notificationSchema);
