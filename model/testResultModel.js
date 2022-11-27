let mongoose = require('mongoose');

let testResultSchema = new mongoose.Schema({
    test:{
        //live test that student had given
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    highScore:{
        type:Number,
        require:true,
    },
    obtainedScore:{
        type:Number,
        required:true
    },
    student:{
        //id of student who has given the test
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    //result is the answer that a 
    result:{
        type:[
            {   //must be feed as soon as 
                correctAnswer:{
                    type:Number,
                    required:true
                },
                //here we have 4 option and 0 for unattempted
                attemptedAnswer:{
                    type:Number
                },
                //Here we have -1: not attempted /0:marked for review and 1 for attempted
                status:{
                    type:Number,
                    default:-1
                }
            }
        ],
        required:true
    }
})

module.exports = mongoose.Model('testResultModel',testResultSchema);