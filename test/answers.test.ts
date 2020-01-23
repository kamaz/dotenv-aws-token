import { getAnswers } from "../src/answers";

describe("questions to ask", () => {
  it("returns an array with all the questions when no arguments or environment variables are present", () => {
    const { givenAnswers, missingAnswers } = getAnswers();

    expect(missingAnswers).toEqual([
      { type: "input", name: "user", message: "IAM user name" },
      { type: "input", name: "token", message: "MFA token" },
      { type: "input", name: "account", message: "AWS account number" },
      { type: "input", name: "profile", message: "AWS credential profile" }
    ]);

    expect(givenAnswers).toEqual({
      user: undefined,
      account: undefined,
      profile: undefined,
      token: undefined
    });
  });

  it("returns an array ", () => {
    process.env.DAM_USER = "dam_user";
    process.env.DAM_ACCOUNT = "dam_account";
    process.env.AWS_PROFILE = "aws_profile";

    const { givenAnswers, missingAnswers } = getAnswers();

    expect(missingAnswers).toEqual([
      { type: "input", name: "token", message: "MFA token" }
    ]);

    expect(givenAnswers).toEqual({
      user: "dam_user",
      account: "dam_account",
      profile: "aws_profile",
      token: undefined
    });
  });

  it("arguments override environment variables", () => {
    const { givenAnswers, missingAnswers } = getAnswers();

    expect(missingAnswers).toEqual([
      { type: "input", name: "token", message: "MFA token" }
    ]);

    expect(givenAnswers).toEqual({
      user: "dam_user",
      account: "dam_account",
      profile: "aws_profile",
      token: undefined
    });
  });
});
