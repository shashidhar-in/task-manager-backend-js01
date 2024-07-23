const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const router = express.Router();

const authenticateUser = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this resource." });
  } else {
    console.log(token);
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({
      title,
      description,
      userId: req.userId,
    });
    await newTask.save();
    res.status(201).json({ message: "Task created successfully.", newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get('/',authenticateUser,async(req,res)=>{
    try {
        const tasks = await Task.find({userId:req.userId});
        res.status(200).json({message:"Tasks successfully fetched!",tasks})
        
        
    } catch (error) {
          console.error("Error fetching task:", error);
          res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;
