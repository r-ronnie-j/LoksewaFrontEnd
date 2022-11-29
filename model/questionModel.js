let mongoose = require('mongoose');

let questionScheme = new mongoose.Schema({
    "question":{
        type:String,
        required:true
    },
    "answer":{
        type:[String],
        required:true
    },
    "correct":{
        type:Number,
        required:true,
        min:1,
        max:4
    },
    "marks":{
        type:Number,
        required:true,
        min:1
    },
    "chapter":{
        type:String,
        required:true
    },
    "field":{
        type:[String],
        required:true
    },
    "explanation":{
        type:String,
    }
})

module.exports = mongoose.model('questionModel',questionScheme);