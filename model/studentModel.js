let mongoose = require('mongoose');

let studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    contactNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    activeTest:{
        type:mongoose.Schema.Types.ObjectId
    },
    waitingTest:{
        type:[mongoose.Schema.Types.ObjectId]
    },
    givenTest:{
        //this contains the result of all the result in the test
        type:[mongoose.Schema.Types.ObjectId]
    }
})

module.exports = mongoose.model('studentModel',studentSchema);