import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import ResumePDFDocument from "@/lib/ResumePDFDocument";
import { parseResumeTextToDraft } from "@/lib/parseResumeTextToDraft";

const MAX_TEXT_LENGTH = 20000;

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { tweakedResumeText } = await request.json();

    if (
      !tweakedResumeText ||
      typeof tweakedResumeText !== "string" ||
      !tweakedResumeText.trim()
    ) {
      return new Response(
        JSON.stringify({ error: "No resume text provided" }),
        { status: 400 },
      );
    }
    if (tweakedResumeText.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: "Resume text is too long" }),
        { status: 400 },
      );
    }

    let draft;
    try {
      draft = await parseResumeTextToDraft(tweakedResumeText);
    } catch (err) {
      console.error("Failed to structure tweaked resume for PDF export:", err);
      return new Response(
        JSON.stringify({
          error: "Couldn't format your resume for download. Please try again.",
        }),
        { status: 502 },
      );
    }

    const buffer = await renderToBuffer(ResumePDFDocument({ draft }));

    const safeName = (draft.fullName || "resume").replace(/[^a-z0-9]+/gi, "_");

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}_tweaked_JDReady.pdf"`,
      },
    });
  } catch (error) {
    console.error("Tweaked resume PDF export error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong generating your PDF." }),
      { status: 500 },
    );
  }
}
