import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";
import cloudinary from "@/lib/cloudinary";
import { extractTextFromResume, getFileType } from "@/lib/resumeParser";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 },
      );
    }

    let fileType;
    try {
      fileType = getFileType(file.name);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract plain text first — if the file is corrupt/unreadable, fail before
    // wasting a Cloudinary upload.
    const extractedText = await extractTextFromResume(buffer, fileType);

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        {
          error:
            "Couldn't read meaningful text from this file. Try a different file.",
        },
        { status: 400 },
      );
    }

    // Upload the original file to Cloudinary as a raw resource so the user
    // can redownload the exact file they uploaded.
    const base64 = buffer.toString("base64");
    const dataUri = `data:application/octet-stream;base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      folder: `jdready/resumes/${session.user.id}`,
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
      format: fileType,
    });

    await connectDB();

    const resume = await Resume.create({
      user: session.user.id,
      filename: file.name,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileType,
      extractedText,
    });

    return NextResponse.json(
      {
        resumeId: resume._id.toString(),
        filename: resume.filename,
        fileUrl: resume.fileUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Resume upload error:", error);
    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json(
      {
        error: isDev
          ? `Dev error: ${error.message}`
          : "Something went wrong processing your resume.",
      },
      { status: 500 },
    );
  }
}
