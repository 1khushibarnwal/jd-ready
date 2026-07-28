import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";
import CoverLetterPDFDocument from "@/lib/CoverLetterPDFDocument";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await params;

  await connectDB();

  const letter = await CoverLetter.findOne({
    _id: id,
    user: session.user.id,
  }).lean();
  if (!letter) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  const buffer = await renderToBuffer(
    CoverLetterPDFDocument({ content: letter.content }),
  );

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cover_letter_JDReady.pdf"`,
    },
  });
}
