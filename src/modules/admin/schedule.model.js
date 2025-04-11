const mongoose = require('mongoose');
const User = require('../auth/auth.model')
const scheduleSchema = new mongoose.Schema({
    day:{type:Date, required:true},
    startTime:{type:String, required:true},
    endTime:{type:String, required:true},
    trainer:{type:mongoose.Schema.Types.ObjectId,ref:User,required:false},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:User,required:true},
    trainees:[{type:mongoose.Schema.Types.ObjectId,ref:User}]
},{timestamps:true})

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
