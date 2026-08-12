import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are restructuring a resume's plain text into a structured JSON shape,
so it can be rendered into a clean PDF template. This is a faithful restructuring task, NOT a
rewrite — you must not invent, embellish, drop, or reword any factual content. Every fact in the
input (company, project, dates, skills, metrics, links) must appear somewhere in the output.

Respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "fullName": <string>,
  "email": <string, "" if not present>,
  "phone": <string, "" if not present>,
  "location": <string, "" if not present>,
  "linkedin": <string, "" if not present>,
  "portfolio": <string — GitHub/portfolio/other profile link, "" if not present>,
  "summary": <string — the professional summary/objective, verbatim or lightly reflowed, "" if none>,
  "skills": [<strings — every individual skill/tool/technology mentioned anywhere (e.g. in a
    "Technical Skills" section with subcategories), flattened into one list. If the original
    grouped skills under category labels like "Languages" or "Backend", drop the category labels
    but keep every individual skill item.>],
  "experience": [
    {
      "company": <string>,
      "role": <string>,
      "location": <string, "" if not present>,
      "startDate": <string, free text e.g. "Jan 2023", "" if not present>,
      "endDate": <string, free text e.g. "Present", "" if not present>,
      "bullets": [<strings — each responsibility/achievement bullet, verbatim>]
    }
  ],
  "education": [
    {
      "school": <string>,
      "degree": <string>,
      "startDate": <string, "" if not present>,
      "endDate": <string, "" if not present>
    }
  ],
  "projects": [
    {
      "name": <string>,
      "description": <string — combine the project's bullets, tech stack, and any live link into
        one flowing description, separated by ". ". Preserve every fact (tech stack, link,
        metrics) — do not drop any of it, just merge it into prose.>
    }
  ],
  "highlights": [<strings — any standalone capability bullets that don't belong to a specific
    project or job (rare — usually empty)>]
}

If a field genuinely isn't present in the input, use an empty string or empty array — never
fabricate a placeholder value.`;

/**
 * Restructures a resume's plain text into the ResumeDraft JSON shape used by the PDF renderer.
 * This is meant to be a faithful reflow, not a rewrite — no new facts should appear.
 * Throws on empty/unparseable responses — caller decides how to handle that.
 * @param {string} resumeText
 * @returns {Promise<object>} a ResumeDraft-shaped object (without user/template fields)
 */
export async function parseResumeTextToDraft(resumeText) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `RESUME TEXT:\n${resumeText}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  const finishReason = completion.choices[0]?.finish_reason;

  if (!raw) {
    throw new Error("Empty response from Groq");
  }
  if (finishReason === "length") {
    throw new Error("Groq response was truncated (hit max_tokens)");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(
      "Failed to JSON.parse Groq draft-parse response. Raw content:",
      raw,
    );
    throw err;
  }

  return {
    fullName: parsed.fullName ?? "",
    email: parsed.email ?? "",
    phone: parsed.phone ?? "",
    location: parsed.location ?? "",
    linkedin: parsed.linkedin ?? "",
    portfolio: parsed.portfolio ?? "",
    summary: parsed.summary ?? "",
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
  };
}
