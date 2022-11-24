let mongoose = require('mongoose');

let adminSchema =  new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.Model('adminModel',adminSchema)