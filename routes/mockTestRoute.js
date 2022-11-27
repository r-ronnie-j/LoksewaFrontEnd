let express = require("express");
let router = express.Router();
let { body, query, validationResult } = require("express-validator");
let questionModel = require("../model/questionModel");
let mockTestModel = require("../model/mockTestModel");

//We are creating a mock test from here
//It is going to need array of question details top
router.post(
  "/",
  body("title", "Title field must be present and should be string")
    .isString()
    .exists(),
  body("post.*", "Post field must be presend and should be array of strigns")
    .isString()
    .exists(),
  body("duration", "Duration must be present and should be numeric")
    .exists()
    .isNumeric(),
  body(
    "questionDescription.*.chapter",
    "chapter is a required field in questiondescription and must be string"
  ).exists(),
  body(
    "questionDescription.*.number",
    "number is a required field in questiondescription and must be number"
  )
    .exists()
    .isNumeric(),
  body(
    "questionDescription.*.field",
    "field must be present in a questionDescription"
  )
    .exists()
    .isArray(),
  body(
    "questionDescription.*field.*",
    "Field must be contain string elements as a child"
  ).isString(),
  async (req, res) => {
    console.log(req.body);
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: err.array(),
      });
    }
    try {
      let { title, post, duration, questionDescription } = req.body;
      let mockTest = new mockTestModel({ title, post, duration });
      mockTest.questions = [];
      for (element of questionDescription) {
        let { chapter, number, field } = element;
        let questionResult = await questionModel
          .find({
            chapter: chapter,
            field: field,
          })
          .limit(number);
        for (let element of questionResult) {
          let { question, answer, correct, marks, explanation } = element;
          mockTest.question = [
            ...mockTest.question,
            {
              question,
              answer,
              correct,
              marks,
              explanation,
            },
          ];
        }
      }
      await mockTest.save();
      res.status(200).json({
        status: false,
        message: "A new mock test has been created",
      });
    } catch (error) {
      console.log("Some error occured while creating the model test");
      console.log(error);
      res.status(500).json({
        status: false,
        message:
          "Some error has occured in database. Probabaly the number of questions in the given field are not there",
      });
    }
  }
);

//This is used to get the mock test 
router.post(
  "/",
  body("id", "Id is a required string field").isString(),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    }
    try {
      let mockTest = await mockTestModel.findById(id);
      res.status(200).json(mockTest);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "The given mock test does not exists",
      });
    }
  }
);

module.exports = router;
