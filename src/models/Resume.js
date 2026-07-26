import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true }, // Cloudinary secure_url, used for redownload
    cloudinaryPublicId: { type: String, required: true }, // needed to delete/manage the file later
    fileType: { type: String, enum: ["pdf", "docx"], required: true },
    extractedText: { type: String, required: true }, // plain text used for LLM analysis
  },
  { timestamps: true },
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
