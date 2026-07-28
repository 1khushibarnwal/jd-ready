import mongoose from "mongoose";

const CoverLetterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    jobDescription: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CoverLetter || mongoose.model("CoverLetter", CoverLetterSchema);