let express = require("express");
let { body, validationResult } = require("express-validator");
let bcrypt = require("bcryptjs");
let studentModel = require("../model/studentModel");

let router = express.Router();

router.post(
  "/",
  body("email", "Email is a required field").exists(),
  body("email", "Please enter a valid email address").isEmail(),
  body("password", "Password field must be entered").exists(),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    }
    try {
      let { email, password } = req.body;
      let student = await studentModel.findOne({
        email
      });
      if(await bcrypt.compare(password,student.password)){
        req.session.type="student"
        req.session.loggedIn = true
        res.status(200).json({
            "status":true,
            "message":"Logged in successfully"
        })
      }else{
        res.status(400).json({
            "status":true,
            "message":"The password does not match"
        })
      }
    } catch (error) {
      console.log("Some error has occured while logging in by the user");
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Some server error has occured",
      });
    }
  }
);

module.exports = router;
