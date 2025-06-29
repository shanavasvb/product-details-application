const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ type: 'editing' }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
