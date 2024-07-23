const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//create an express app
const app = express();

//Json parser middleware
app.use(express.json());

//connect to database

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

  //Routes 
  const authRoutes=require('./routes/auth');
  const taskRoutes=require('./routes/tasks');

  app.use('/api/auth',authRoutes);
  app.use('/api/tasks',taskRoutes);

  const port=process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
