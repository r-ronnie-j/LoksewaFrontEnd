let express = require("express");
let router = express.Router();

router.get("/", async (req, res) => {
  req.session.destroy((err) => {
    if(err){
      console.log(err)
      res.status(400).json({
        "status":true,
        "message":"Logged oput successfully"
      })
    }else{
      res.status(200).json({
        "status":false,
        "message":"failed to logout some server error occured"
      })
    }
  });
});

module.exports = router;
