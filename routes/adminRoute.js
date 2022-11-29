let express = require("express");
let { body, validationResult } = require("express-validator");
let bcrypt = require("bcryptjs");
let adminModel = require("../model/adminModel");
let editorModel = require("../model/editorModel");
let router = express.Router();

router.get("/login", (req, res) => {
  res.send("hi");
});

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
    }
    let { email, password } = req.body;
    try {
      let editor = await adminModel.findOne({ email });
      if (await bcrypt.compare(password, editor.password)) {
        req.session.type = "admin";
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
  async (req, res) => {
    console.log(req.session.id);
    if ((req.session.type = "admin" && req.session.loggedIn)) {
      try {
        let err = validationResult(req);
        if (!err.isEmpty()) {
          res.status(400).json({
            status: false,
            message: err.array(),
          });
        } else {
          let editor = await adminModel.findOne({ email });
          if (await bcrypt.compare(oldPassword, editor.password)) {
            await adminModel.findOneAndUpdate(
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
              message: "The password does not match",
            });
          }
        }
      } catch (error) {
        console.log("error in editor changePassword");
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Some server error has occured",
        });
      }
    } else {
      res.status(400).json({
        status: "false",
        message: "log in first",
      });
    }
    let { email, oldPassword, newPassword } = req.body;
  }
);

router.post(
  "/addEditor",
  body("name", "Name is a required field").isString().exists(),
  body("email", "Email is a required field").isEmail().exists(),
  body("password", "Password is a required field").isString().exists(),
  body("contactNumber", "Contact Number is a required field")
    .isString()
    .exists()
    .isLength({ min: 10, max: 10 }),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    } else {
      let { name, email, password, contactNumber } = req.body;
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      let editor = new editorModel({ name, email, password, contactNumber });
      try {
        if (await editorModel.exists({ email: email })) {
          res.status(200).json({
            status: false,
            message: "editor with the given mail exists",
          });
        } else {
          await editor.save();
          res.status(200).json({
            status: true,
            message: "Editor successfully added to the database",
          });
        }
      } catch (error) {
        console.log(
          "Some error occured in admin routes while creating editors"
        );
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Failed to add the editor database error",
        });
      }
    }
  }
);

router.post(
  "/addAdmin",
  body("name", "Name is a required field").isString().exists(),
  body("email", "Email is a required field").isEmail().exists(),
  body("password", "Password is a required field").isString().exists(),
  body("contactNumber", "Contact Number is a required field")
    .isString()
    .exists()
    .isLength({ min: 10, max: 10 }),
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({
        status: false,
        message: err.array(),
      });
    } else {
      let { name, email, password, contactNumber } = req.body;
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      let editor = new adminModel({ name, email, password, contactNumber });
      try {
        if (await editorModel.exists({ email: email })) {
          res.status(200).json({
            status: false,
            message: "admin with the given mail exists",
          });
        } else {
          await editor.save();
          res.status(200).json({
            status: true,
            message: "Admin successfully added to the database",
          });
        }
      } catch (error) {
        console.log(
          "Some error occured in admin routes while creating admin"
        );
        console.log(error);
        res.status(500).json({
          status: false,
          message: "Failed to add the editor database error",
        });
      }
    }
  }
);

//We will hard codedly add the superadmin in the server
router.post("/superadmin", async (req, res) => {
  let { email, name, password, contactNumber } = req.body;
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);
  let admin = new adminModel({
    email,
    name,
    password: hash,
    contactNumber,
  });
  await admin.save();
  console.log("Super admin has been added");
  res.status(200).json({
    status: true,
    message: "Super admin has been added",
  });
});

module.exports = router;
