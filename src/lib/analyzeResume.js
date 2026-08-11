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

Score matchScore using this rubric — anchor to it rather than an impression:
- 90-100: nearly all required skills/experience are directly evidenced; only minor/nice-to-have gaps.
- 75-89: most required skills are evidenced; a few non-critical gaps.
- 55-74: roughly half the required skills are evidenced; some important gaps remain.
- 30-54: a minority of required skills are evidenced; several important gaps.
- 0-29: little to no overlap between the resume and the JD's core requirements.
Weigh REQUIRED/must-have skills more heavily than nice-to-haves when scoring.

Be specific and grounded only in the text provided. Do not invent skills that aren't implied by either document. Write every string field in plain text only — no markdown, no asterisks, no bold/italic markers, no headers.`;

const SAMPLES = 3;

/**
 * Runs one resume-vs-JD pass through Groq and returns the parsed result.
 * Throws on empty/unparseable responses — caller decides how to handle that.
 */
async function runOnce(resumeText, jobDescription) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0,
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

/**
 * Runs the resume-vs-JD analysis multiple times (self-consistency) and returns
 * a single stable result: the median matchScore, paired with the qualitative
 * fields from whichever run landed closest to that median.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @returns {Promise<{matchScore:number, matchedSkills:string[], missingSkills:string[], suggestions:string[], summary:string}>}
 */
export async function analyzeResumeAgainstJD(resumeText, jobDescription) {
  const results = await Promise.all(
    Array.from({ length: SAMPLES }, () => runOnce(resumeText, jobDescription)),
  );

  const sortedScores = results.map((r) => r.matchScore).sort((a, b) => a - b);
  const medianScore = sortedScores[Math.floor(sortedScores.length / 2)];

  // Use the qualitative fields (skills/suggestions/summary) from whichever
  // run's score is closest to the median, so the write-up matches the score.
  const representative = results.reduce((best, r) =>
    Math.abs(r.matchScore - medianScore) <
    Math.abs(best.matchScore - medianScore)
      ? r
      : best,
  );

  return {
    ...representative,
    matchScore: medianScore,
  };
}
