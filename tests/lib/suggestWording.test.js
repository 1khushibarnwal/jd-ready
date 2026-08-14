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

import { suggestBulletWording } from "@/lib/suggestWording";

describe("suggestBulletWording", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses a valid WORDING/PLACEMENT response", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              "WORDING: Built RESTful APIs using Node.js and Express.\nPLACEMENT: Add this under the JDReady project.",
          },
        },
      ],
    });

    const result = await suggestBulletWording(
      "Node.js developer with REST API experience",
      "Backend developer",
      "Mention API development",
    );

    expect(result).toEqual({
      wording: "Built RESTful APIs using Node.js and Express.",
      placement: "Add this under the JDReady project.",
    });
  });

  it("handles markdown code fences", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              "```text\nWORDING: Built REST APIs with Node.js.\nPLACEMENT: Add under the JDReady project.\n```",
          },
        },
      ],
    });

    const result = await suggestBulletWording(
      "Node.js developer",
      "Backend developer",
      "Mention APIs",
    );

    expect(result.wording).toBe("Built REST APIs with Node.js.");
    expect(result.placement).toBe("Add under the JDReady project.");
  });

  it("handles multiline placement text", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              "WORDING: Built scalable APIs using Node.js.\nPLACEMENT: Add this under the backend project section.\nKeep it after the existing API bullet.",
          },
        },
      ],
    });

    const result = await suggestBulletWording(
      "Node.js developer",
      "Backend developer",
      "Mention scalability",
    );

    expect(result.wording).toBe("Built scalable APIs using Node.js.");

    expect(result.placement).toBe(
      "Add this under the backend project section.\nKeep it after the existing API bullet.",
    );
  });

  it("throws for an empty response", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "",
          },
        },
      ],
    });

    await expect(
      suggestBulletWording("resume", "JD", "suggestion"),
    ).rejects.toThrow("Empty response from Groq");
  });

  it("throws for a malformed response", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "Here is your suggested wording.",
          },
        },
      ],
    });

    await expect(
      suggestBulletWording("resume", "JD", "suggestion"),
    ).rejects.toThrow("Malformed suggest-wording response from Groq");
  });

  it("throws when wording is missing", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "WORDING:\nPLACEMENT: Add this under the project.",
          },
        },
      ],
    });

    await expect(
      suggestBulletWording("resume", "JD", "suggestion"),
    ).rejects.toThrow("Malformed suggest-wording response from Groq");
  });
});
