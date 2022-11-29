let express = require("express");
let questionModel = require("../model/questionModel");
let {body , validationResult} = require('express-validator')
let router = express.Router();

router.post("", 
body('question',"Questoin must exist as string").exists().isString(),
body('answer',"Answer is a required field").isArray().isLength({min:4,max:4}),
body('answer.*',"The content of string should be string").isString(),
body('chapter',"Chapter is a required field and should be string").isString().exists(),
body('correct',"Correct is a required field").isNumeric(),
body('marks',"Marks is a required field").isNumeric(),
body('field',"Field is a required field").isArray(),
body('field.*',"Content inside field must be string").isString(),
async (req, res) => {
  if (req.session.loggedIn && req.session.type== ('editor' || 'admin')) {
    let { question, answer, correct, marks, chapter, field,explanation } = req.body;
    let quest = new questionModel({
      question,
      answer,
      chapter,
      correct,
      marks,
      field,
      explanation
    });
    try {
      await quest.save();
      res.status(200).json({
        status: true,
        message: "The question has been successfully added to the database",
      });
    } catch (err) {
      console.log("Some error has occured while saving data to the database");
      console.log(err);
      res.status(400).json({
        status: false,
        message: "We have failed to save the data to the database",
      });
    }
  } else {
    res.status(400).json({
        "status":false,
        "message":"Log in as a editor to visit the given route"
    })
  }
});

module.exports = router;
