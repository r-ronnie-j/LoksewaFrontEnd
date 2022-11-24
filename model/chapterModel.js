let mongoose = require('mongoose');

//This model is used to store the data about the chapter
let chapterSchema = new mongoose.Schema({
    "title":{
        type:String,
        required: true
    },
    "field":{
        type:[String],
        required:true
    }
});

module.exports = mongoose.model('chapterModel',chapterSchema);