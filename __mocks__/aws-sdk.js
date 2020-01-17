let AccessKeyId;
let SecretAccessKey;
let SessionToken;
class STS {
  getSessionToken() {
    return {
      promise() {
        return Promise.resolve({
          ResponseMetadata: {
            RequestId: "caa6bb77-38b2-11ea-81b8-99982ecda0dc"
          },
          Credentials: {
            AccessKeyId,
            SecretAccessKey,
            SessionToken,
            Expiration: "2020-01-17T10:51:54.000Z"
          }
        });
      }
    };
  }
}

const config = {
  credentials: {}
};

class SharedIniFileCredentials {
  constructor(values) {
    this.values = values;
  }
}

module.exports = {
  setKeys({ AccessKeyIdValue, SecretAccessKeyValue, SessionTokenValue }) {
    AccessKeyId = AccessKeyIdValue;
    SecretAccessKey = SecretAccessKeyValue;
    SessionToken = SessionTokenValue;
  },
  STS,
  SharedIniFileCredentials,
  config
};
