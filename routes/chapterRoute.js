const express = require("express");
let chapterModel = require("../model/chapterModel");

let router = express.Router();

router.get("/", async (req, res) => {
  try {
    let chapters = await chapterModel.find({});
    let result= getChapterPreFormat(chapters)
    result= getTheChapters(result)
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
  console.log(req.body);
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
module.exports = router;
