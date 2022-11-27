let mongoose = require('mongoose');

//This model is used to store the data about the chapter
let chapterSchema = new mongoose.Schema({
    "title":{
        type:String,//C
        required: true
    },
    "field":{
        type:[String],//Technical,Engi,Comp
        required:true
    }
});

module.exports = mongoose.model('chapterModel',chapterSchema);