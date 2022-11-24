let mongoose = require("mongoose");

let mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  //post represents the test suitable for given subject or post
  post: {
    type: [String],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  questions: {
    type: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: [String],
          required: true,
        },
        correct: {
          type: Number,
          required: true,
          min: 1,
          max: 4,
        },
        /*
        -1 : not attempted
        0 : marked for review
        1 : attempted
      */
        status: {
          type: Number,
          default: -1,
          min: -1,
          max: 1,
        },
        attempt: {
          type: Number,
          min:0,
          max:4,
          default:0 //0 for unattempted questions
        },
        explanation: {
          type: String,
        },
        marks: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.Model("mockTestModel", mockTestSchema);
