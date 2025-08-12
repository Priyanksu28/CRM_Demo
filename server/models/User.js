const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    employeeId:{
        type:String,
        unique:true,
        sparse:true
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    resetPasswordToken: { type: String },               
    resetPasswordExpires: { type: Date },               
    phone:{
        type:String,
        required:true,
    },
    role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
},{timestamps:true});

module.exports = mongoose.model('User',userSchema); 