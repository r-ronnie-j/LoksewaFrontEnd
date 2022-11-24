let express = require('express');
let questionModel = require('../model/questionModel');
let router = express.Router();

router.post('',async (req,res)=>{
    let {question,answer,correct,marks,chapter,field} = req.body;
    let quest = new questionModel({
        question,answer,chapter,correct,marks,field
    })
    try{
        await quest.save();
        res.status(200).json({
            "status":true,
            "message":"The question has been successfully added to the database"
        })
    }catch(err){
        console.log("Some error has occured while saving data to the database")
        console.log(err);
        res.status(400).json({
            "status":false,
            "message":"We have failed to save the data to the database",
        })
    }
})

module.exports = router;