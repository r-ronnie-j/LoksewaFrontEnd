let mongoose = require('mongoose');

let liveTestSchema = new mongoose.Schema({
    prize:{
        type:String,
    },
    cost:{
        type:Number,
        requird:true,
        min:0
    },
    description:{
        type:String,
    },
    field:{
        type:[String],
        required:true
    },
    time:{
        type:Date,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    questions:{
        type:[{
            question:{
                type:String,
                required:true
            },
            answer:{
                type:[String],
                required:true
            },
            correct:{
                type:Number,
                required:true,
                min:1,
                max:4
            },
            status:{
                type:Number,
                default:-1,
                min:-1,
                max:1
            },
            attempt:{
                type:Number,
                required:true
            },
            explanation:{
                type:String,
            },
            marks:{
                type:Number,
                min:1,
                required:true
            }
        }]
    },
    highScore:{
        type:Number,
        required:true
    },
    totalScore:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.Model('liveTestModel',liveTestSchema);