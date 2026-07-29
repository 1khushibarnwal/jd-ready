import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true }, // 0-100
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }],
    summary: { type: String }, // short overall verdict from the LLM
    label: { type: String, default: "" }, // optional, e.g. "Google - SWE" — used by the compare tool
  },
  { timestamps: true },
);

export default mongoose.models.Analysis ||
  mongoose.model("Analysis", AnalysisSchema);
