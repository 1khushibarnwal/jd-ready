import groq from "@/lib/groq";

const SYSTEM_PROMPT = `You are a careful resume editor. You will be given the full plain text of a
candidate's resume, plus a numbered list of EXACT edit instructions the candidate has personally
reviewed and approved.

Your job is to apply ONLY those exact instructions to the resume text — nothing else.

Hard rules:
- Do NOT rewrite, rephrase, reword, or "improve" any sentence that isn't targeted by one of the
  numbered instructions. Every line that isn't touched by an instruction must be preserved
  EXACTLY as-is, including its wording, punctuation, and line breaks.
- Do NOT add any skill, tool, employer, project, metric, date, or achievement beyond what the
  instruction itself says. If an instruction says to add a line about a topic, write ONLY what a
  reasonable person would write from that exact instruction — do not invent specifics (numbers,
  company names, project names) the candidate didn't give you.
- Do NOT remove or shorten any section that isn't targeted by an instruction.
- Apply each instruction in the most sensible existing section of the resume (e.g. a testing-tools
  mention goes near Skills or the relevant project/experience bullet, not appended as a new
  section) unless the instruction clearly asks for something else.
- If an instruction is vague, apply the most conservative, literal reading of it — do not embellish.
- Preserve the resume's existing overall structure, section order, and formatting style (plain
  text, no markdown, no asterisks).

Respond with ONLY the full resulting resume text, and absolutely nothing else:
- No JSON, no wrapping object, no key/value shape.
- No markdown code fences (no triple backticks).
- No preamble, no "Here is the updated resume:", no explanation, no sign-off.
- No text after the resume ends.
Your entire response must be exactly the resume text itself, ready to be saved as-is.`;

// Guards against the model wrapping its answer in a markdown code fence despite
// being told not to — cheap to strip, and much safer than trusting raw output.
function stripCodeFence(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```[a-zA-Z]*\n([\s\S]*?)\n```$/);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

/**
 * Applies a list of user-approved edit instructions to a resume's plain text via the LLM.
 * Every instruction here must already be something the user explicitly confirmed — this
 * function never decides on its own what to change.
 *
 * Deliberately asks the model for raw text back, NOT JSON: the response has to contain the
 * entire (often multi-paragraph) resume, and LLMs frequently fail to escape embedded newlines
 * correctly inside JSON string values, which breaks JSON.parse. Plain text sidesteps that
 * failure mode entirely, since there's nothing to parse.
 *
 * @param {string} resumeText - the original extracted resume text
 * @param {string[]} edits - user-approved, user-editable instruction strings
 * @returns {Promise<string>} the tweaked resume text
 */
export async function tweakResumeText(resumeText, edits) {
  if (!Array.isArray(edits) || edits.length === 0) {
    throw new Error("No approved edits provided");
  }

  const editList = edits.map((edit, i) => `${i + 1}. ${edit}`).join("\n");

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    // The response has to contain the ENTIRE resume text (not just a short
    // verdict like the analyze call), so it needs a generous cap — otherwise
    // long resumes get cut off mid-response.
    max_tokens: 8192,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `ORIGINAL RESUME TEXT:\n${resumeText}\n\nAPPROVED EDIT INSTRUCTIONS:\n${editList}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  const finishReason = completion.choices[0]?.finish_reason;

  if (!raw || !raw.trim()) {
    throw new Error("Empty response from Groq");
  }

  if (finishReason === "length") {
    // The model ran out of tokens mid-response, so the resume text may be cut
    // off partway through. Surface this distinctly so it's obvious in logs
    // that it's a token-limit issue rather than some other failure.
    throw new Error(
      "Groq response was truncated (hit max_tokens) before finishing the resume text",
    );
  }

  const tweakedResumeText = stripCodeFence(raw);

  // Soft sanity check only (never blocks the result): PDF text extraction can
  // produce wildly inflated whitespace in the original text (multi-column
  // layouts especially), so a shorter-but-valid rewrite is common and should
  // not be treated as a failure. This is just a breadcrumb for debugging.
  if (tweakedResumeText.length < resumeText.length * 0.5) {
    console.warn(
      "Tweak response is notably shorter than the original resume text " +
        `(${tweakedResumeText.length} vs ${resumeText.length} chars) — ` +
        "may be fine (whitespace differences) but worth a spot-check.",
    );
  }

  return tweakedResumeText;
}
