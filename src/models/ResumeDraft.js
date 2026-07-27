import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" }, // free text, e.g. "Jan 2023" — kept simple on purpose
    endDate: { type: String, default: "" }, // free text, e.g. "Present"
    bullets: [{ type: String }],
  },
  { _id: false },
);

const EducationSchema = new mongoose.Schema(
  {
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  { _id: false },
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const ResumeDraftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    summary: { type: String, default: "" },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [{ type: String }],
    projects: [ProjectSchema],
  },
  { timestamps: true },
);

export default mongoose.models.ResumeDraft ||
  mongoose.model("ResumeDraft", ResumeDraftSchema);
