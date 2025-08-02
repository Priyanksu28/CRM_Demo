const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    orgName:{
        type:String,
        required:true,
        trim:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:String,
    address:{
        street:String,
        city:String,
        state:String,
        zip:String,
        country:{type:String, default:'India'}
    },
    customerType:{
        type:String,
        enum:['business', 'individual'],
        default:'individual'
    },
    gstin: String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'active'
    },
},{timestamps:true});

module.exports = mongoose.model('Customer', customerSchema);