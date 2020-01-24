import program from "yargs";
import { pickAll, prop, map, filter, compose, mergeWith } from "ramda";

// replace console.log with logging framework

export const getAnswers = (argv: Array<string>) => {
  // console.log(process.cwd()); add as debug
  const userOption = {
    name: "user",
    message: "IAM user name"
  };
  const tokenOption = {
    name: "token",
    message: "MFA token"
  };
  const accountOption = {
    name: "account",
    message: "AWS account number"
  };
  const profileOption = {
    name: "profile",
    message: "AWS credential profile"
  };

  const questions = [
    {
      type: "input",
      ...userOption
    },
    {
      type: "input",
      ...tokenOption
    },
    {
      type: "input",
      ...accountOption
    },
    {
      type: "input",
      ...profileOption
    }
  ];
  const pickOnlyOptions = pickAll(map(prop("name"))(questions));

  const argvAnswers: object = pickOnlyOptions(
    program(argv)
      .usage("Usage:")
      .option("u", {
        alias: userOption.name,
        describe: userOption.message,
        type: "string"
      })
      .option("a", {
        alias: accountOption.name,
        describe: accountOption.message,
        type: "string"
      })
      .option("t", {
        alias: tokenOption.name,
        describe: tokenOption.message,
        type: "string"
      })
      .option("p", {
        alias: profileOption.name,
        describe: profileOption.message,
        type: "string"
      }).argv
  );

  const envVars = {
    [userOption.name]: process.env.DAM_USER,
    [accountOption.name]: process.env.DAM_ACCOUNT,
    [profileOption.name]: process.env.AWS_PROFILE
  };

  // console.log("arguments", argv);
  // console.log("env variables", envVars);
  const definedValue = (a: unknown, b: unknown) => (a === undefined ? b : a);
  const givenAnswers = mergeWith(definedValue, argvAnswers, envVars);
  // console.log("partial answer", partialAnswers);
  const isAnswered = (property: string) => {
    // console.log(partialAnswers, property);
    return givenAnswers[property] === undefined;
  };

  // console.log("questions to ask", questionsToAsk);
  const missingAnswers = filter(
    // @ts-ignore
    compose(isAnswered, prop("name"))
  )(questions);
  // console.log("questions to ask", questionsToAsk);
  return { missingAnswers, givenAnswers };
};
