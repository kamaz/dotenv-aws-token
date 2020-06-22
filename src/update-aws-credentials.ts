import aws, { STS } from "aws-sdk";
import { config } from "dotenv";
import { join, pickAll, merge, compose, toPairs, map } from "ramda";
import { writeFileSync } from "fs";
import { join as joinPath } from "path";
import os from "os";
import { debug } from "./debug";

export type Authentication = {
  account: string;
  user: string;
  token: string;
  profile?: string;
  role?: string;
  sessionDuration: string;
};

const getCredentials = async (
  authentication: Authentication
): Promise<STS.Credentials | undefined> => {
  const {
    account,
    user,
    token,
    profile = "default",
    role = "",
    sessionDuration,
  } = authentication;
  const credentials = new aws.SharedIniFileCredentials({
    profile,
  });
  aws.config.credentials = credentials;
  const sts = new STS();
  const sessionTokenPayload = {
    DurationSeconds: 43200,
    SerialNumber: `arn:aws:iam::${account}:mfa/${user}`,
    TokenCode: token,
  };
  if (role && role != "") {
    const assumeRoleToken = await sts
      .assumeRole({
        ...sessionTokenPayload,
        // todo: that value can be configured
        DurationSeconds: parseInt(sessionDuration, 10) ?? 3600,
        RoleArn: role,
        RoleSessionName: `${account}-${user}`,
      })
      .promise();
    debug("assume role token response %j", assumeRoleToken);
    return assumeRoleToken.Credentials;
  }

  const tokenResponse = await sts
    .getSessionToken(sessionTokenPayload)
    .promise();

  debug("session token response %j", tokenResponse);
  return tokenResponse.Credentials;
};

export const updateAWSCredentials = async (authentication: Authentication) => {
  const { account, user, profile = "default" } = authentication;
  const credentials = await getCredentials(authentication);

  const awsAccessValues = pickAll(
    ["AccessKeyId", "SecretAccessKey", "SessionToken"],
    credentials
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
    AWS_SESSION_TOKEN: awsAccessValues.SessionToken,
    DAM_USER: user,
    DAM_ACCOUNT: account,
    DAM_PROFILE: profile,
  });

  writeFileSync(joinPath(process.cwd(), ".env"), newDotEnvValues, {
    encoding: "utf-8",
  });
};
