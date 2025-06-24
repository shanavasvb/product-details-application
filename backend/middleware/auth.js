const jwt = require('jsonwebtoken');

const User = require('../models/User');

const auth = async (req, res, next) => {  //function checks whether is user is logged in properly
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET );
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

const adminAuth = async (req, res, next) => {  //request checks for requests and response will provide the response and responsil error onnm illenki will proceed to next route which is only accessible to admin
    try {
        await auth(req, res, () => {
            if (!req.user.is_admin) {
                return res.status(403).json({
                    success: false,
                    message: 'Admin privileges required'
                });
            }
            next();
        });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Admin privileges required'
        });
    }
};

module.exports = { auth, adminAuth };