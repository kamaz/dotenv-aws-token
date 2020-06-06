import { getAnswers } from "../src/answers";

const clearEnvironmentVariables = () => {
  delete process.env.DAM_USER;
  delete process.env.DAM_ACCOUNT;
  delete process.env.AWS_PROFILE;
};

const setEnvironmentVariables = () => {
  process.env.DAM_USER = "dam_user";
  process.env.DAM_ACCOUNT = "dam_account";
  process.env.DAM_PROFILE = "aws_profile";
};

describe("questions to ask", () => {
  beforeEach(() => {
    clearEnvironmentVariables();
  });

  it("returns an array with all the questions when no arguments or environment variables are present", () => {
    const { givenAnswers, missingAnswers } = getAnswers([]);

    expect(missingAnswers).toEqual([
      { type: "input", name: "user", message: "IAM user name" },
      { type: "input", name: "account", message: "AWS account number" },
      { type: "input", name: "profile", message: "AWS credential profile" },
      { type: "input", name: "token", message: "MFA token" },
    ]);

    expect(givenAnswers).toEqual({
      user: undefined,
      account: undefined,
      profile: undefined,
      token: undefined,
      role: "",
    });
  });

  it("returns token as missing answer and given answers are populated from environment variables", () => {
    setEnvironmentVariables();

    const { givenAnswers, missingAnswers } = getAnswers([]);

    expect(missingAnswers).toEqual([
      { type: "input", name: "token", message: "MFA token" },
    ]);

    expect(givenAnswers).toEqual({
      user: "dam_user",
      account: "dam_account",
      profile: "aws_profile",
      token: undefined,
      role: "",
    });
  });

  [
    {
      argv: ["--user", "user"],
      expected: {
        user: "user",
        account: "dam_account",
        profile: "aws_profile",
        token: undefined,
        role: "",
      },
      missingAnswers: [{ type: "input", name: "token", message: "MFA token" }],
    },
    {
      argv: ["-u", "user"],
      expected: {
        user: "user",
        account: "dam_account",
        profile: "aws_profile",
        token: undefined,
        role: "",
      },
      missingAnswers: [{ type: "input", name: "token", message: "MFA token" }],
    },
    {
      argv: ["--account", "account"],
      expected: {
        user: "dam_user",
        account: "account",
        profile: "aws_profile",
        token: undefined,
        role: "",
      },
      missingAnswers: [{ type: "input", name: "token", message: "MFA token" }],
    },
    {
      argv: ["-a", "account"],
      expected: {
        user: "dam_user",
        account: "account",
        profile: "aws_profile",
        token: undefined,
        role: "",
      },
      missingAnswers: [{ type: "input", name: "token", message: "MFA token" }],
    },
    {
      argv: ["--profile", "profile"],
      expected: {
        user: "dam_user",
        account: "dam_account",
        profile: "profile",
        token: undefined,
        role: "",
      },
      missingAnswers: [{ type: "input", name: "token", message: "MFA token" }],
    },
    {
      argv: ["-p", "profile"],
      expected: {
        user: "dam_user",
        account: "dam_account",
        profile: "profile",
        token: undefined,
        role: "",
      },
      missingAnswers: [{ type: "input", name: "token", message: "MFA token" }],
    },
    {
      argv: ["--token", "token"],
      expected: {
        user: "dam_user",
        account: "dam_account",
        profile: "aws_profile",
        token: "token",
        role: "",
      },
      missingAnswers: [],
    },
    {
      argv: ["-t", "token"],
      expected: {
        user: "dam_user",
        account: "dam_account",
        profile: "aws_profile",
        token: "token",
        role: "",
      },
      missingAnswers: [],
    },
  ].forEach((t) =>
    it(`arguments ${t.argv} override environment variables`, () => {
      setEnvironmentVariables();

      const { givenAnswers, missingAnswers } = getAnswers([
        "node",
        "program",
        ...t.argv,
      ]);

      expect(missingAnswers).toEqual(t.missingAnswers);

      expect(givenAnswers).toEqual(t.expected);
    })
  );
});
