#!/usr/bin/env node
import inquirer from "inquirer";
import { existsSync } from "fs";
import { join as joinPath } from "path";
import { merge } from "ramda";
import { updateAWSCredentials, Authentication } from "./update-aws-credentials";
import { getAnswers } from "./answers";
import { debug } from "./debug";

const { missingAnswers, givenAnswers } = getAnswers(process.argv);

inquirer.prompt(missingAnswers).then(async (userAnswers) => {
  debug("user answers %o", userAnswers);
  const finalAnswers = merge(givenAnswers)(userAnswers) as Authentication;
  debug("all answers %o", finalAnswers);
  // if not present want the directory tree to find it
  const dotEnvFilePath = joinPath(process.cwd(), ".env");
  if (existsSync(dotEnvFilePath)) {
    updateAWSCredentials(finalAnswers).catch((e) => {
      console.error("Error: ", e.message);
    });
  } else {
    console.error(`Dot env file is missing under ${process.cwd()}`);
    process.exit(1);
  }
});
