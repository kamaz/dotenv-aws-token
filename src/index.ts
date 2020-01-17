#!/usr/bin/env node
import inquirer from "inquirer";
import program from "yargs";
import { pickAll, merge, prop, map, filter, compose } from "ramda";
import { updateAWSCredentials, Authentication } from "./update-aws-credentials";

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

const partialAnswers = merge(envVars)(argv);
const isAnswered = (property: string) => partialAnswers[property] === undefined;
const questionsToAsk = filter(
  // @ts-ignore
  compose(isAnswered, prop("name"))
)(questions);

inquirer.prompt(questionsToAsk).then(async answers => {
  const finalAnswers = merge(partialAnswers)(answers) as Authentication;
  updateAWSCredentials(finalAnswers);
});
