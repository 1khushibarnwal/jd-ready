import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.
A candidate will give you a job description and a list of skills they genuinely know. Your job
is to draft resume content that presents those skills in the strongest, most role-relevant way —
without ever inventing anything the candidate didn't tell you.

Respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "summary": <string — a 2-3 sentence professional summary, written in first-person-implied resume
    style (no "I"), that positions the candidate for this specific role using ONLY the skills
    provided>,
  "skills": [<strings — the candidate's input skills, deduplicated, cleaned up (fixed casing/
    spelling), and ordered with the ones most relevant to the job description first. You may
    rephrase a skill to match standard industry naming (e.g. "js" -> "JavaScript"), but never
    add a skill the candidate didn't list>],
  "highlights": [<3-5 strings — short, punchy resume bullet points that describe what the
    candidate CAN DO with their listed skills, framed as capabilities/strengths relevant to the
    job description (e.g. "Builds RESTful APIs with Node.js and Express, backed by MongoDB data
    models"). These must stay strictly at the level of general capability tied to a skill —
    NEVER invent specific employers, job titles, dates, team sizes, project names, or quantified
    metrics like "%", "$", or "increased/reduced by...", since the candidate has not provided
    any of that and fabricating it would misrepresent them>]
}

Write every string field in plain text only — no markdown, no asterisks, no bold/italic markers,
no headers, no bullet characters (the caller renders bullets itself).`;

/**
 * Generates a tailored summary, ordered skill list, and honest capability highlights from a
 * job description and the skills the candidate says they know. Never fabricates work history,
 * education, employers, or metrics — it only reframes the skills the candidate actually gave us.
 * Throws on empty/unparseable responses — caller decides how to handle that.
 * @param {string} jobDescription
 * @param {string[]} skills
 * @returns {Promise<{summary: string, skills: string[], highlights: string[]}>}
 */
export async function generateResumeFromJD(jobDescription, skills) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `JOB DESCRIPTION:\n${jobDescription}\n\nSKILLS THE CANDIDATE KNOWS:\n${skills.join(", ")}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from Groq");
  }

  const parsed = JSON.parse(raw); // let caller catch JSON.parse errors

  const generatedSkills =
    Array.isArray(parsed.skills) && parsed.skills.length > 0
      ? parsed.skills
      : skills;

  return {
    summary: parsed.summary ?? "",
    skills: generatedSkills,
    highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
  };
}
