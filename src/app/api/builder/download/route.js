import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import ResumeDraft from "@/models/ResumeDraft";
import ResumePDFDocument from "@/lib/ResumePDFDocument";

export async function POST() {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();

  const draft = await ResumeDraft.findOne({ user: session.user.id }).lean();
  if (!draft) {
    return new Response(JSON.stringify({ error: "No draft found" }), {
      status: 404,
    });
  }

  const buffer = await renderToBuffer(ResumePDFDocument({ draft }));

  const safeName = (draft.fullName || "resume").replace(/[^a-z0-9]+/gi, "_");

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}_JDReady.pdf"`,
    },
  });
}
