import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) and technical recruiter.
Compare the given resume text against the given job description and respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "matchScore": <integer 0-100>,
  "matchedSkills": [<strings — skills/requirements from the JD the resume already shows>],
  "missingSkills": [<strings — important skills/requirements from the JD not evidenced in the resume>],
  "suggestions": [<strings — concrete, actionable rewrite/addition suggestions>],
  "summary": <string — 2-3 sentence overall verdict>
}

Be specific and grounded only in the text provided. Do not invent skills that aren't implied by either document.`;

/**
 * Runs a single resume-vs-JD analysis through Groq and returns the parsed result.
 * Throws on empty/unparseable responses — caller decides how to handle that.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Promise<{matchScore:number, matchedSkills:string[], missingSkills:string[], suggestions:string[], summary:string}>}
 */
export async function analyzeResumeAgainstJD(resumeText, jobDescription) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from Groq");
  }

  const parsed = JSON.parse(raw); // let caller catch JSON.parse errors

  return {
    matchScore: parsed.matchScore ?? 0,
    matchedSkills: parsed.matchedSkills ?? [],
    missingSkills: parsed.missingSkills ?? [],
    suggestions: parsed.suggestions ?? [],
    summary: parsed.summary ?? "",
  };
}
