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

import { tweakResumeText } from "@/lib/tweakResume";

describe("tweakResumeText", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the tweaked resume text", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              "Khushi Barnwal\nSoftware Developer\nBuilt REST APIs using Node.js.",
          },
        },
      ],
    });

    const result = await tweakResumeText("Khushi Barnwal\nSoftware Developer", [
      "Add Node.js API experience",
    ]);

    expect(result).toContain("Khushi Barnwal");
    expect(result).toContain("Built REST APIs using Node.js.");
  });

  it("handles markdown code fences", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              "```text\nKhushi Barnwal\nSoftware Developer\nBuilt APIs.\n```",
          },
        },
      ],
    });

    const result = await tweakResumeText("Khushi Barnwal\nSoftware Developer", [
      "Add API experience",
    ]);

    expect(result).toBe("Khushi Barnwal\nSoftware Developer\nBuilt APIs.");
  });

  it("throws when no edits are provided", async () => {
    await expect(tweakResumeText("resume", [])).rejects.toThrow(
      "No approved edits provided",
    );

    expect(createMock).not.toHaveBeenCalled();
  });

  it("throws when edits is not an array", async () => {
    await expect(tweakResumeText("resume", null)).rejects.toThrow(
      "No approved edits provided",
    );

    expect(createMock).not.toHaveBeenCalled();
  });

  it("throws when Groq returns an empty response", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "",
          },
        },
      ],
    });

    await expect(tweakResumeText("resume", ["Add APIs"])).rejects.toThrow(
      "Empty response from Groq",
    );
  });

  it("throws when Groq response is truncated", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          finish_reason: "length",
          message: {
            content: "partial resume...",
          },
        },
      ],
    });

    await expect(tweakResumeText("resume", ["Add APIs"])).rejects.toThrow(
      "Groq response was truncated",
    );
  });

  it("numbers the approved edit instructions before sending them to Groq", async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "Updated resume",
          },
        },
      ],
    });

    await tweakResumeText("Original resume", [
      "Add Node.js",
      "Mention testing",
    ]);

    const call = createMock.mock.calls[0][0];

    expect(call.messages[1].content).toContain("1. Add Node.js");

    expect(call.messages[1].content).toContain("2. Mention testing");
  });
});
