const express=require('express');
const User = require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

const router=express.Router();

router.post('/register',async(req,res)=>{
    try {
        const{username,password}=req.body;
        //check if the user already exists
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(400).json({msg:"User already exists"});
        }
        //Hash the password 
        const hashedPassword = await bcrypt.hash(password,10);
        //Create a new user
        const newUser = new User({
            username,
            password:hashedPassword
        });

        //Save the user to the database
        const user=await newUser.save();
const {password:_, ...dataTOSend}=user.toObject();
        res.status(201).json({message:"User registered successfully!",user: dataTOSend})
        
    } catch (error) {
        console.error('Error registering user:',error);
        res.status(500).json({message:"Internal server error"})
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({msg:"User not found"})
        }
        //Check if the password is correct
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({msg:"Wrong password"})
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({token})
    } catch (error) {
         console.error("Error Logging in user:", error);
         res.status(500).json({ message: "Internal server error" });
    }
})

module.exports=router;