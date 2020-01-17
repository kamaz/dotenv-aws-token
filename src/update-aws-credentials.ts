import aws from "aws-sdk";
import { config } from "dotenv";
import { join, pickAll, merge, compose, toPairs, map } from "ramda";
import { writeFileSync } from "fs";
import { join as joinPath } from "path";
import os from "os";
export type Authentication = {
  account: string;
  user: string;
  token: string;
  profile?: string;
};

export const updateAWSCredentials = async (authentication: Authentication) => {
  const {
    account = "795006049798",
    user = "kamil@cabiri.io",
    token,
    profile = "default"
  } = authentication;
  const credentials = new aws.SharedIniFileCredentials({
    profile
  });
  aws.config.credentials = credentials;
  const sts = new aws.STS();
  const sessionTokenPayload = {
    DurationSeconds: 43200,
    SerialNumber: `arn:aws:iam::${account}:mfa/${user}`,
    TokenCode: token
  };
  const tokenResponse = await sts
    .getSessionToken(sessionTokenPayload)
    .promise();

  const awsAccessValues = pickAll(
    ["AccessKeyId", "SecretAccessKey", "SessionToken"],
    tokenResponse.Credentials
  ) as { AccessKeyId: string; SecretAccessKey: string; SessionToken: string };

  const dotEnvValues = config().parsed || {};

  const newDotEnvValues = compose(
    join(os.EOL),
    map(join("=")),
    toPairs,
    merge(dotEnvValues)
  )({
    AWS_ACCESS_KEY_ID: awsAccessValues.AccessKeyId,
    AWS_SECRET_ACCESS_KEY: awsAccessValues.SecretAccessKey,
    AWS_SESSION_TOKEN: awsAccessValues.SessionToken
  });

  writeFileSync(joinPath(process.cwd(), ".env"), newDotEnvValues, {
    encoding: "utf-8"
  });
};
