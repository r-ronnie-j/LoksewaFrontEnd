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
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    //result is the answer that a 
    result:{
        type:[
            {
                correctAnswer:{
                    type:Number,
                    required:true
                },
                attemptedAnswer:{
                    type:Number
                }
            }
        ]
    }
})

module.exports = mongoose.Model('testResultModel',testResultSchema);