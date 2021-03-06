import program from "yargs";
import { pickAll, prop, map, filter, compose, mergeWith } from "ramda";
import { debug } from "./debug";

export const getAnswers = (argv: Array<string>) => {
  debug("running in context %s", process.cwd());

  const userOption = {
    name: "user",
    message: "IAM user name",
  };

  const tokenOption = {
    name: "token",
    message: "MFA token",
  };

  const accountOption = {
    name: "account",
    message: "AWS account number",
  };

  const profileOption = {
    name: "profile",
    message: "AWS credential profile",
  };

  const roleOption = {
    name: "role",
    message: "AWS role to assume (optional)",
    default: "",
  };

  const sessionDurationOption = {
    name: "sessionDuration",
    message: "AWS session duration (optional)",
    default: "3600",
  };

  const questions = [
    {
      type: "input",
      ...userOption,
    },
    {
      type: "input",
      ...accountOption,
    },
    {
      type: "input",
      ...profileOption,
    },
    {
      type: "input",
      ...roleOption,
    },
    {
      type: "input",
      ...tokenOption,
    },
  ];
  const pickOnlyOptions = pickAll(
    map(prop("name"))([
      ...questions,
      { name: roleOption.name },
      { name: sessionDurationOption.name },
    ])
  );

  const argvAnswers: object = pickOnlyOptions(
    program(argv)
      .usage("Usage:")
      .option("r", {
        alias: roleOption.name,
        describe: roleOption.message,
        type: "string",
        default: "",
      })
      .option("u", {
        alias: userOption.name,
        describe: userOption.message,
        type: "string",
      })
      .option("a", {
        alias: accountOption.name,
        describe: accountOption.message,
        type: "string",
      })
      .option("t", {
        alias: tokenOption.name,
        describe: tokenOption.message,
        type: "string",
      })
      .option("p", {
        alias: profileOption.name,
        describe: profileOption.message,
        type: "string",
      })
      .option("d", {
        alias: sessionDurationOption.name,
        describe: sessionDurationOption.message,
        type: "string",
        default: sessionDurationOption.default,
      }).argv
  );
  debug("arguments %o", argvAnswers);

  const envVars = {
    [userOption.name]: process.env.DAM_USER,
    [accountOption.name]: process.env.DAM_ACCOUNT,
    [profileOption.name]: process.env.DAM_PROFILE,
    [roleOption.name]: process.env.DAM_ROLE,
    [sessionDurationOption.name]: process.env.DAM_SESSION_DURATION,
  };

  debug("environment variables %o", envVars);
  const definedValue = (a: unknown, b: unknown) =>
    a === undefined || a === "" ? b : a;
  const givenAnswers = mergeWith(definedValue, argvAnswers, envVars);
  debug("partial answers %o", givenAnswers);

  const isAnswered = (property: string) => {
    // at the moment we want to ignore 'role'
    return (
      givenAnswers[property] === undefined &&
      property !== roleOption.name &&
      property !== sessionDurationOption.name
    );
  };

  debug("questions to ask %o", questions);

  const missingAnswers = filter(
    // @ts-ignore
    compose(isAnswered, prop("name"))
  )(questions);

  debug("missing answers %o", questions);

  return { missingAnswers, givenAnswers };
};
