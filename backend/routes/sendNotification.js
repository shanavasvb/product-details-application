const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/notifications');

router.post('/notification', async (req, res) => {
  try {
    console.log('Received notification data:', req.body);
    
    const { message, type, senderId, receiverRole, relatedId } = req.body;
    
    // Check for required fields
    if (!message || !type || !senderId || !receiverRole || !relatedId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['message', 'type', 'senderId', 'receiverRole', 'relatedId'],
        received: req.body
      });
    }
    
    // Validate senderId is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({
        error: 'Invalid senderId format',
        message: 'senderId must be a valid ObjectId'
      });
    }
    
    const notification = new Notification({
      message,
      type,
      senderId, 
      receiverRole,
      relatedId,
      timestamp: new Date(),
      read: false
    });
    
    console.log('Creating notification:', notification);
    
    const savedNotification = await notification.save();
    console.log('Notification saved successfully:', savedNotification);
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification: savedNotification
    });
    
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      error: 'Failed to create notification',
      details: error.message
    });
  }
});

module.exports = router;