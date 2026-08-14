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

import { parseResumeTextToDraft } from "@/lib/parseResumeTextToDraft";

describe("parseResumeTextToDraft", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses a resume into the expected draft structure", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              fullName: "Khushi Barnwal",
              email: "khushi@example.com",
              phone: "1234567890",
              location: "Kolkata",
              linkedin: "linkedin.com/in/example",
              portfolio: "github.com/example",
              summary: "Full-stack developer",
              skills: ["JavaScript", "React", "Node.js"],
              experience: [],
              education: [],
              projects: [
                {
                  name: "JDReady",
                  description: "AI-powered resume platform",
                },
              ],
              highlights: ["Built a full-stack application"],
            }),
          },
        },
      ],
    });

    const result = await parseResumeTextToDraft(
      "Khushi Barnwal\nJavaScript React Node.js",
    );

    expect(result.fullName).toBe("Khushi Barnwal");
    expect(result.email).toBe("khushi@example.com");
    expect(result.skills).toEqual(["JavaScript", "React", "Node.js"]);
    expect(result.projects).toHaveLength(1);
    expect(result.projects[0].name).toBe("JDReady");
  });

  it("provides defaults for missing fields", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              fullName: "Khushi Barnwal",
            }),
          },
        },
      ],
    });

    const result = await parseResumeTextToDraft("Khushi Barnwal");

    expect(result).toEqual({
      fullName: "Khushi Barnwal",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      summary: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      highlights: [],
    });
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

    await expect(parseResumeTextToDraft("resume")).rejects.toThrow(
      "Empty response from Groq",
    );
  });

  it("throws when the response is truncated", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          finish_reason: "length",
          message: {
            content: JSON.stringify({
              fullName: "Khushi",
            }),
          },
        },
      ],
    });

    await expect(parseResumeTextToDraft("resume")).rejects.toThrow(
      "Groq response was truncated",
    );
  });

  it("throws when the response contains invalid JSON", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "{invalid json",
          },
        },
      ],
    });

    await expect(parseResumeTextToDraft("resume")).rejects.toThrow();
  });

  it("preserves array fields only when they are arrays", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              fullName: "Khushi",
              skills: "JavaScript",
              experience: {},
              education: null,
              projects: "JDReady",
              highlights: "Developer",
            }),
          },
        },
      ],
    });

    const result = await parseResumeTextToDraft("resume");

    expect(result.skills).toEqual([]);
    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.highlights).toEqual([]);
  });
});
