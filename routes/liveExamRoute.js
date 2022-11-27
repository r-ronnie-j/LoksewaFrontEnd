let express = require("express");
const { validationResult } = require("express-validator");
let liveTestModel = require("../model/liveTestModel");
const { findById } = require("../model/studentModel");
const testResultModel = require("../model/testResultModel");
let router = express.Router();

//get all the active exams
router.post("/active", async (req, res) => {
  try {
    let currentTime = new Date();
    let liveExams = await liveTestModel
      .find(
        {
          startTime: {
            $gte: currentTime,
          },
          endTime: {
            $lte: currentTime,
          },
        },
        [
          "prize",
          "cost",
          "description",
          "field",
          "startTime",
          "endTime",
          "duration",
          "id",
        ]
      )
      .sort("startTime"); //We need to change the sorting order if the required field is different
    res.status(200).json(liveExams);
  } catch (err) {
    console.log(
      "Some error has occured while fetching the data from the database"
    );
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Some error occured from the database",
    });
  }
});

//This lists all the test to occur in future
router.post("/future", async (req, res) => {
  try {
    let currentTime = new Date();
    let liveExams = await liveTestModel(
      {
        startTime: {
          $gte: currentTime,
        },
      },
      [
        "prize",
        "cost",
        "description",
        "field",
        "startTime",
        "endTime",
        "duration",
        "id",
      ]
    ).sort("startTime");
  } catch (err) {
    console.log("some error occured in liveExam future route");
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Some error occured in the database",
    });
  }
});

router.post(
  "/getExam",
  body("id", "Id is a required field").exists().isString(),
  async (req, res) => {
    try {
      let { id } = req.body;
      let liveExam = await findById({ id }, { startTime });
      let current = new Date();
      if (current.getTime() < liveExam.startTime.getTime()) {
        let timeDiff =
          current.getTime() + 5 * 60 * 1000 - liveExam.startTime.getTime;
        if (timeDiff < 5 * 60 * 1000) {
          res.status(200).json({
            status: true,
            message: `${timeDiff} millisecond left to start the exam`,
            data: {
              startTime: liveExam.startTime,
            },
          });
        } else {
          liveExam = await liveTestModel.aggregate([
            { $match: { id } },
            {
              $project: {
                "questions.$": {
                  correct: -1,
                  explanation: -1,
                },
              },
            },
          ]);
          res.status(200).json({
            status: true,
            message: "Exam has started",
            data: liveExam,
          });
        }
      }
    } catch (error) {
      console.log("Some error occured in getting the live exam");
      console.log(error);
      res.status(400).json({
        status: false,
        message:
          "Some server error occured the live test might not have existed",
      });
    }
  }
);

router.post(
  "/active/update",
  body("id", "Id is a required field").isString().exists(),
  body("questionNumber", "questionNumber is a required field is numeric")
    .exists()
    .isNumeric(),
  body("answer", "Answer field is required and must be a number")
    .exists()
    .isInt({ min: 0, max: 4 }),
  body("status", "Status is a required field and must be a number")
    .exists()
    .isInt({ min: -1, max: 1 }),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    } else {
      let { id, questionNumber, answer, status } = req.body;
      try {
        let test = await testResultModel.findOneAndUpdate(
          { id },
          {
            $set: {
              "result.$[elem].correctAnswer": answer,
              "result.$[elem].status": status,
            },
          },
          { arrayFilters: [{ elem: questionNumber }], new: true }
        );
        res.status(200).json({
          "status":true,
          "message":"We have successfully update the result"
        })
      } catch (error) {
        console.log(
          "Some error occured while updating the result in the route"
        );
        console.log(error);
        res.status(500).json({
          status: false,
          messsage:
            "Some server error occured while updating the result in the server",
        });
      }
    }
  }
);

module.exports = router;
