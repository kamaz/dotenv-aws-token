#!/usr/bin/env node
import inquirer from "inquirer";
import program from "yargs";
import { existsSync } from "fs";
import { join as joinPath } from "path";
import { pickAll, merge, prop, map, filter, compose, mergeWith } from "ramda";
import { updateAWSCredentials, Authentication } from "./update-aws-credentials";

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
const argv: object = pickOnlyOptions(
  program
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
const partialAnswers = mergeWith(definedValue, envVars, argv);
// console.log("partial answer", partialAnswers);
const isAnswered = (property: string) => {
  // console.log(partialAnswers, property);
  return partialAnswers[property] === undefined;
};
const questionsToAsk = filter(
  // @ts-ignore
  compose(isAnswered, prop("name"))
)(questions);
// console.log("questions to ask", questionsToAsk);

inquirer.prompt(questionsToAsk).then(async answers => {
  const finalAnswers = merge(partialAnswers)(answers) as Authentication;
  const dotEnvFilePath = joinPath(process.cwd(), ".env");
  if (existsSync(dotEnvFilePath)) {
    updateAWSCredentials(finalAnswers);
  } else {
    console.error(`Dot env file is missing under ${process.cwd()}`);
    process.exit(1);
  }
});
