//This route is accessible to the editor or admin when they login
let express = require("express");
let editorModel = require("../model/editorModel");

let { body, validationResult } = require("express-validator");
let bcrypt = require("bcryptjs");

let router = express.Router();

router.post(
  "/login",
  body("email", "Email field must not be empty").exists(),
  body("email", "Please enter a valid email").isEmail(),
  body("password", "Please enter a password").isString(),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    } else {
      let { email, password } = req.body;
      try {
        let editor = await editorModel.findOne({ email });
        if (await bcrypt.compare(password, editor.password)) {
          req.session.type = "editor";
          req.session.loggedIn = true;
          console.log(req.session);
          res.status(200).json({
            status: true,
            message: "Logged in successfully",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "User name and password does not match",
          });
        }
      } catch (error) {
        console.log("Some error has occured while logging as editor");
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Some error has occured while logging in",
        });
      }
    }
  }
);

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "We failed to logout some server error might have occured",
      });
    }
    res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  });
});

router.post(
  "/changePassword",
  body("email", "Please enter a valid email address").exists().isEmail(),
  body("oldPassword", "Old password is a required field").exists().isString(),
  body(
    "newPassword",
    "New password is required and must be atleast 8 character long"
  )
    .exists()
    .isString()
    .isLength({ min: 8 }),
  (req, res, next) => {
    if (!(req.session.type == "editor" || req.session.loggedIn)) {
      res.status(400).json({
        status: false,
        message: "log in first",
      });
    } else {
      next();
    }
  },
  body("oldPassword", "Old password is a required field").exists().isString(),
  body(
    "newPassword",
    "New password is required and must be atleast 8 character long"
  )
    .exists()
    .isString()
    .isLength({ min: 8 }),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    } else {
      let { oldPassword, newPassword, email } = req.body;
      try {
        let editor = await editorModel.findOne({ email });
        if (await bcrypt.compare(oldPassword, editor.password)) {
          await editorModel.findOneAndUpdate(
            { email },
            { password: newPassword }
          );
          res.status(200).json({
            status: true,
            message: "We successfully updated the password",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "the passord entered does not match",
          });
        }
      } catch (error) {
        console.log("error in editor changePassword");
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Some server error has occured",
        });
      }
    }
  }
);

module.exports = router;
