const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title:String,
    description:String,
    completed:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
});
const Task=mongoose.model('Tasks',taskSchema);

module.exports=Task;