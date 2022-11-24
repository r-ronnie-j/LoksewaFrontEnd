let express = require("express");
let bcrypt= require('bcryptjs');
let { body, validationResult } = require("express-validator");
let studentModel=require('../model/studentModel');

let router = express.Router();

router.post(
  "/",
  body("email", "Email is a required field").isEmail().exists(),
  body("password", "Password is a required field").exists().isLength({
    min: 8,
  }),
  body("contactNumber","Contact number is a required field and must be all numbers").isNumeric().isLength(10),
  body("name","Name is a required field and must be a string").exists().isString(),
  body('age',"Age is a required field and must be numeric").exists().isNumeric(),
  async (req, res) => {
    let err = validationResult(req);
    if(!err.isEmpty()){
        res.status(400).json({
            "status":false,
            "message":err.array()
        })
    }
    let {email,password,contactNumber,age,name} = req.body;
    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password,salt)
    try{
        let student = new studentModel({email,password,contactNumber,age,name});
        await student.save();
        res.status(200).json({
            "status":true,
            "message":"User created"
        })
    }catch(error){
        console.log("some error has occured");
        console.log(error);
        res.status(500).json({
            "status":false,
            "message":"Some server error occured"
        })
    }
  }
);

module.exports = router;
