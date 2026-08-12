import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are a resume-writing assistant helping a candidate turn one high-level
suggestion into a single, ready-to-use resume line, grounded strictly in their actual resume and
the job description.

You will be given: the candidate's full resume text, the job description, and one specific
suggestion (e.g. "Mention any testing tools or frameworks you used").

Your job:
1. Draft ONE polished resume-ready line (a bullet or summary-style sentence, no leading bullet
   character) that fulfills the suggestion.
2. Ground it ONLY in what the resume already shows or clearly implies. If the suggestion requires
   a specific fact the resume doesn't contain (e.g. which testing tool, which metric), do NOT
   invent it — instead write the line with an obvious bracketed placeholder for the candidate to
   fill in, e.g. "Wrote unit and integration tests using [Jest/Mocha] to validate core API
   endpoints." Never silently make up a tool, number, or name that isn't in the resume.
3. Say WHERE in the resume this line fits best — name the specific existing section or project
   from THEIR resume (e.g. "Add as a new bullet under your 'Scribly' project" or "Add to your
   Technical Skills section"), not a generic section name if a more specific one applies.

Respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "wording": <string — the single drafted line, plain text, no markdown>,
  "placement": <string — one short sentence naming exactly where to add it>
}`;

/**
 * Drafts one concrete, resume-ready line for a given suggestion, grounded in the candidate's
 * actual resume and the job description, plus a specific placement hint. Never invents facts
 * the resume doesn't support — uses bracketed placeholders instead.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @param {string} suggestion
 * @returns {Promise<{wording: string, placement: string}>}
 */
export async function suggestBulletWording(
  resumeText,
  jobDescription,
  suggestion,
) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    max_tokens: 512,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nSUGGESTION TO DRAFT:\n${suggestion}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from Groq");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(
      "Failed to JSON.parse Groq suggest-wording response. Raw content:",
      raw,
    );
    throw err;
  }

  if (!parsed.wording || typeof parsed.wording !== "string") {
    throw new Error("Malformed suggest-wording response from Groq");
  }

  return {
    wording: parsed.wording,
    placement: parsed.placement ?? "",
  };
}
