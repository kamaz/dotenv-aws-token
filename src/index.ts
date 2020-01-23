#!/usr/bin/env node
import inquirer from "inquirer";
import { existsSync } from "fs";
import { join as joinPath } from "path";
import { merge } from "ramda";
import { updateAWSCredentials, Authentication } from "./update-aws-credentials";
import { getAnswers } from "./answers";

const { missingAnswers, givenAnswers } = getAnswers();

inquirer.prompt(missingAnswers).then(async userAnswers => {
  const finalAnswers = merge(givenAnswers)(userAnswers) as Authentication;
  const dotEnvFilePath = joinPath(process.cwd(), ".env");
  if (existsSync(dotEnvFilePath)) {
    updateAWSCredentials(finalAnswers);
  } else {
    console.error(`Dot env file is missing under ${process.cwd()}`);
    process.exit(1);
  }
});
