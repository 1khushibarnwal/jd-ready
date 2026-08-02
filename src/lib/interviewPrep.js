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
    { "text": "<the question>", "type": "behavioral" | "technical" }
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

Be specific and grounded in the actual answer given and the resume provided. Do not invent
experience the candidate doesn't have.`;

export async function generateInterviewQuestions(resumeText, jobDescription) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: QUESTIONS_SYSTEM_PROMPT },
      {
        role: "user",
        content: `RESUME TEXT:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
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
