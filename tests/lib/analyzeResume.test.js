import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
}));

vi.mock("@/lib/groq", () => ({
  default: {
    chat: {
      completions: {
        create: createMock,
      },
    },
  },
}));

import { analyzeResumeAgainstJD } from "@/lib/analyzeResume";

describe("analyzeResumeAgainstJD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the median score from successful analysis samples", async () => {
    createMock
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                matchScore: 60,
                matchedSkills: ["JavaScript"],
                missingSkills: ["Python"],
                suggestions: ["Add Python experience"],
                summary: "Moderate match",
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                matchScore: 80,
                matchedSkills: ["JavaScript", "React"],
                missingSkills: ["Python"],
                suggestions: ["Mention React projects"],
                summary: "Good match",
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                matchScore: 70,
                matchedSkills: ["JavaScript"],
                missingSkills: ["Python"],
                suggestions: ["Add relevant projects"],
                summary: "Solid match",
              }),
            },
          },
        ],
      });

    const result = await analyzeResumeAgainstJD(
      "JavaScript React developer",
      "Looking for a JavaScript developer",
    );

    expect(result.matchScore).toBe(70);
    expect(result.matchedSkills).toEqual(["JavaScript"]);
    expect(result.summary).toBe("Solid match");
    expect(createMock).toHaveBeenCalledTimes(3);
  });

  it("continues when one sample fails", async () => {
    createMock
      .mockRejectedValueOnce(new Error("Temporary Groq failure"))
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                matchScore: 70,
                matchedSkills: ["JavaScript"],
                missingSkills: [],
                suggestions: [],
                summary: "Good match",
              }),
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify({
                matchScore: 80,
                matchedSkills: ["JavaScript", "React"],
                missingSkills: [],
                suggestions: [],
                summary: "Very good match",
              }),
            },
          },
        ],
      });

    const result = await analyzeResumeAgainstJD(
      "JavaScript React",
      "JavaScript developer",
    );

    expect(result.matchScore).toBe(80);
    expect(createMock).toHaveBeenCalledTimes(3);
  });

  it("throws when every analysis sample fails", async () => {
    const error = new Error("Groq unavailable");

    createMock.mockRejectedValue(error);

    await expect(
      analyzeResumeAgainstJD("resume", "job description"),
    ).rejects.toThrow("Groq unavailable");

    expect(createMock).toHaveBeenCalledTimes(3);
  });

  it("throws when Groq returns an empty response", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: null,
          },
        },
      ],
    });

    await expect(
      analyzeResumeAgainstJD("resume", "job description"),
    ).rejects.toThrow("Empty response from Groq");
  });

  it("throws when Groq response is truncated", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          finish_reason: "length",
          message: {
            content: JSON.stringify({
              matchScore: 70,
            }),
          },
        },
      ],
    });

    await expect(
      analyzeResumeAgainstJD("resume", "job description"),
    ).rejects.toThrow("Groq response was truncated");
  });

  it("throws when Groq returns invalid JSON", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "this is not JSON",
          },
        },
      ],
    });

    await expect(
      analyzeResumeAgainstJD("resume", "job description"),
    ).rejects.toThrow();
  });

  it("uses fallback values for missing fields", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              matchScore: 75,
            }),
          },
        },
      ],
    });

    const result = await analyzeResumeAgainstJD("resume", "job description");

    expect(result).toEqual({
      matchScore: 75,
      matchedSkills: [],
      missingSkills: [],
      suggestions: [],
      summary: "",
    });
  });
});
