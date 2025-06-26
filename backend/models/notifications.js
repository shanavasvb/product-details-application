const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { //notification message
    type: String,
    required: true
  },
  type: {
    type: String, //edit, registration request, new item added through running script(represents the type of notification)
    required: true
  },
  senderId: {
    type: String, 
    required: true
  },
  receiverRole: {
    type: String, //most probably admin, since admin should always notified by the edits made by employye   
    required: true
  },
  relatedId: {
    type: String, //To store product id, edit cheytha productinta id
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
