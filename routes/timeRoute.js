let express = require('express');
let router = express.Router()

router.get('/',(req,res)=>{
    let date = new Date()
    res.status(200).json({
        "status":true,
        "hours":date.getHours(),
        "minutes":date.getMinutes(),
        "seconds":date.getSeconds()
    })
})

module.exports = router;