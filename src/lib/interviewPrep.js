import groq from "@/lib/groq";

const QUESTIONS_SYSTEM_PROMPT = `You are an experienced technical interviewer.
Given a candidate's resume text and a job description, generate 6 interview questions
that a real interviewer would plausibly ask this specific candidate for this specific role.

Mix of question types:
- 3-4 behavioral questions grounded in the candidate's actual resume content (past projects,
  experience, decisions they'd have made)
- 2-3 technical questions grounded in the skills/technologies the job description requires

Respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "questions": [
    { "text": "<the question, plain text only, no markdown/asterisks/formatting>", "type": "behavioral" | "technical" }
  ]
}`;

const ANSWER_SYSTEM_PROMPT = `You are an experienced technical interviewer giving feedback on a
candidate's spoken interview answer. Given the question, the candidate's resume, the job
description, and their answer, evaluate the answer.

Respond with ONLY a raw JSON object (no markdown fences, no preamble) in exactly this shape:

{
  "score": <integer 0-100, how strong this answer was for this question/role>,
  "strengths": [<strings — what the answer did well>],
  "improvements": [<strings — specific, actionable ways to improve the answer>],
  "modelAnswer": <string — a strong example answer grounded in the candidate's actual resume content>
}

Write every string field in plain text only — no markdown, no asterisks, no bold/italic
markers, no headers, no bullet characters. Be specific and grounded in the actual answer
given and the resume provided. Do not invent experience the candidate doesn't have.`;

const FOLLOW_UP_SYSTEM_PROMPT = `You are an interview coach helping a candidate understand feedback on ONE
specific interview answer. Stay strictly scoped to this question, this answer, and the
feedback already given — do not introduce new topics or invent details about the
candidate's background that weren't in their resume or answer.

Be concise (2-4 short paragraphs max) and concrete: point to specific phrases to change
or add, not generic advice like "be more confident". Write in plain text only — no
markdown headers, no asterisks/bold markers, no bullet characters (use plain sentences
or "-" for lists).`;

const MAX_FOLLOW_UP_HISTORY = 8; // turns, not messages — keeps this a quick clarification, not an open chat
const MAX_FOLLOW_UP_MESSAGE_LENGTH = 2000;

export async function askInterviewFollowUp({
  question,
  resumeText,
  jobDescription,
  answerText,
  feedback,
  history = [],
  message,
}) {
  const trimmedHistory = history.slice(-MAX_FOLLOW_UP_HISTORY * 2).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, MAX_FOLLOW_UP_MESSAGE_LENGTH),
  }));

  const contextMessage = [
    `INTERVIEW QUESTION:\n${question}`,
    `JOB DESCRIPTION:\n${jobDescription}`,
    `RESUME TEXT:\n${resumeText}`,
    `CANDIDATE'S ANSWER:\n${answerText}`,
    feedback
      ? `FEEDBACK ALREADY GIVEN:\nScore: ${feedback.score}/100\nStrengths: ${(feedback.strengths || []).join("; ")}\nImprovements: ${(feedback.improvements || []).join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.4,
    messages: [
      { role: "system", content: FOLLOW_UP_SYSTEM_PROMPT },
      { role: "user", content: contextMessage },
      ...trimmedHistory,
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0]?.message?.content?.trim();
  if (!reply) throw new Error("Empty response from Groq");

  return reply;
}

export async function generateInterviewQuestions(
  resumeText,
  jobDescription,
  existingQuestions = [],
) {
  const avoidanceNote =
    existingQuestions.length > 0
      ? `\n\nThe candidate has already been asked these questions in this session — generate 6 DIFFERENT questions that don't repeat these in substance:\n${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: QUESTIONS_SYSTEM_PROMPT },
      {
        role: "user",
        content: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}${avoidanceNote}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from Groq");

  const parsed = JSON.parse(raw);
  const questions = parsed.questions ?? [];

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("No questions generated");
  }

  return questions;
}

export async function evaluateInterviewAnswer({
  question,
  resumeText,
  jobDescription,
  answerText,
}) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANSWER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `QUESTION:\n${question}\n\nRESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE'S ANSWER:\n${answerText}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from Groq");

  const parsed = JSON.parse(raw);

  return {
    score: parsed.score ?? 0,
    strengths: parsed.strengths ?? [],
    improvements: parsed.improvements ?? [],
    modelAnswer: parsed.modelAnswer ?? "",
  };
}
