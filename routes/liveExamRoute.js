let express = require('express');
let liveTestModel= require('../model/liveTestModel');
const testResultModel = require('../model/testResultModel');

let router = express.Router();

router.post('/',async (req,res)=>{
    let pastDate = new Date();
    d.setHours(d.getHours() - 2)
    let current = new Date()
    try{
        let liveExams = await liveTestModel.find({time:{$gte:pastDate,$lte:current}},{});

    }catch(err){
        console.log("Some error has occured while fetching the data from the database")
        console.log(err)
        res.status(500).json({
            "status":false,
            "message":"Some error occured from the database"
        })
    }   
})

module.exports = router