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

import { generateResumeFromJD } from "@/lib/generateResumeFromJD";

describe("generateResumeFromJD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns generated resume content", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: "Backend developer experienced with Node.js.",
              skills: ["Node.js", "Express", "MongoDB"],
              highlights: [
                "Builds REST APIs with Node.js",
                "Works with MongoDB data models",
              ],
            }),
          },
        },
      ],
    });

    const result = await generateResumeFromJD(
      "Looking for a backend developer",
      ["Node.js", "Express", "MongoDB"],
    );

    expect(result).toEqual({
      summary: "Backend developer experienced with Node.js.",
      skills: ["Node.js", "Express", "MongoDB"],
      highlights: [
        "Builds REST APIs with Node.js",
        "Works with MongoDB data models",
      ],
    });
  });

  it("falls back to original skills when generated skills are empty", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: "Backend developer",
              skills: [],
              highlights: [],
            }),
          },
        },
      ],
    });

    const skills = ["Node.js", "Express"];

    const result = await generateResumeFromJD("Backend developer", skills);

    expect(result.skills).toEqual(skills);
  });

  it("falls back to original skills when generated skills are not an array", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: "Backend developer",
              skills: "Node.js",
              highlights: [],
            }),
          },
        },
      ],
    });

    const skills = ["Node.js", "Express"];

    const result = await generateResumeFromJD("Backend developer", skills);

    expect(result.skills).toEqual(skills);
  });

  it("uses empty defaults for missing response fields", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({}),
          },
        },
      ],
    });

    const skills = ["JavaScript"];

    const result = await generateResumeFromJD("Frontend developer", skills);

    expect(result).toEqual({
      summary: "",
      skills,
      highlights: [],
    });
  });

  it("throws when Groq returns no content", async () => {
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
      generateResumeFromJD("Frontend developer", ["React"]),
    ).rejects.toThrow("Empty response from Groq");
  });

  it("throws when Groq returns invalid JSON", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "not valid JSON",
          },
        },
      ],
    });

    await expect(
      generateResumeFromJD("Frontend developer", ["React"]),
    ).rejects.toThrow();
  });
});
