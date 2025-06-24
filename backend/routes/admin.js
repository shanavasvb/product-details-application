const express = require('express')
const User= require('../models/User.js')
const {adminAuth}=require('../middleware/auth.js')
const router=express.Router()


//Get all the approved user(Admin only)

router.get('/list-user',adminAuth,async (req,res) => {
    try {
        const Userlist=await User.find({
            status:true
        }).select('-password');
        res.json({
            success:true,
            count:Userlist.length,
            data:Userlist
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})
module.exports = router
