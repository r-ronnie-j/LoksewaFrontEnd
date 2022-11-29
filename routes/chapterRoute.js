const express = require("express");
const {body, validationResult } = require("express-validator");
let chapterModel = require("../model/chapterModel");
const questionModel = require("../model/questionModel");

let router = express.Router();

router.get("/", async (req, res) => {
  try {
    let chapters = await chapterModel.find({});
    let result = getChapterPreFormat(chapters);
    result = getTheChapters(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(
      "Some error has occured while saving data to the database in the chapterRoute"
    );
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Failed accessing data from the database",
    });
  }
});

router.post("/", async (req, res) => {
  if (
    (req.session.type == "admin" || req.session.type == "editor") &&
    req.session.loggedIn
  ) {
    let { title, field } = req.body;
    let chapter = new chapterModel({
      title,
      field,
    });
    try {
      await chapter.save();
      res.status(200).json({
        status: true,
        message: "Data has been successfully added to the database",
      });
    } catch (error) {
      console.log("Some error has occured while saving data to the database");
      console.log(error);
      res.status(400).json({
        status: false,
        message:
          "Some error occured while saving data to the database please contact the administrator",
      });
    }
  }else{
    res.status(400).json({
      "status":false,
      "message":"Not authorized for the creation of the page"
    })
  }
});

/***************************************************************************** */
//the function to pre format the data in format given below
// {
//     "Technical": {
//       "Engineering": {
//         "Computer": {
//           "Java": {
//             "title": "Inheritence and Polymorphism"
//           }
//         },
//         "civil": {
//           "Dynamics": {
//             "title": "Moment of inertial"
//           }
//         }
//       }
//     }
//   }
//****************************************************************** */
function getChapterPreFormat(chapters) {
  let result = {};
  for (data of chapters) {
    let { field, title } = data;
    let inter = result;
    for (f of field) {
      if (!inter[f]) {
        inter[f] = {};
        console.log(result);
      }
      inter = inter[f];
    }
    inter.title = title;
  }
  return result;
}

//the function to reformat the data received from the backend
function getTheChapters(obj) {
  let res = [];
  for (data of Object.entries(obj)) {
    let a = {
      title: data[0],
    };
    if (typeof data[1] == "object") {
      a.children = getTheChapters(data[1]);
    }
    res = [...res, a];
  }
  return res;
}

router.post(
  "/questions",
  body("chapter", "Chapter is a required field and must be string")
    .exists()
    .isString(),
  body("field", "Field is a required field").exists(),
  body("field.$", "All the content of the field must be string").isString(),
  body("index", "Index is a required field and must be integer").isInt(),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    } else {
      let { chapter, field, index } = req.body;
      try {
        let questions = await questionModel
          .find({ chapter: chapter, field: { $all: field } }, [
            "question",
            "answer",
            "correct",
            "marks",
            "explanation",
          ])
          .limit(10)
          .skip(index);
        res.status(200).json({
          status: true,
          questions: questions,
        });
      } catch (error) {
        console.log("Some error occured in chapter question routes");
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Some error has occured while parsing the data",
        });
      }
    }
  }
);
module.exports = router;
