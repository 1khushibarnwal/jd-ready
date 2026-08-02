import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    answerText: { type: String, required: true },
    score: { type: Number }, // 0-100
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    modelAnswer: { type: String },
  },
  { _id: false },
);

const QuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["behavioral", "technical"],
      default: "behavioral",
    },
  },
  { _id: false },
);

const InterviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: { type: String, required: true },
    questions: [QuestionSchema],
    answers: [AnswerSchema],
  },
  { timestamps: true },
);

export default mongoose.models.InterviewSession ||
  mongoose.model("InterviewSession", InterviewSessionSchema);
