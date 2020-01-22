# Status

Still beta

# Why

Because switching between AWS credentials is annoying with mfa.

# How

1. Install [direnv](https://direnv.net/) or a clone but I've only tested in `direnv`.

2. Create a `.envrc` file in your project with following configuration:

```bash
# .envrc
dotenv
```

It is safe to check-in to repository.

3. Add a file `.env` and configure with following properties

```
AWS_DEFAULT_REGION=eu-west-2
AWS_PROFILE=default
DAM_USER="replace_aws_user"
DAM_ACCOUNT="replace_aws_account_number"
```

4. Use the token

- By typing the command

```bash
dotenv-aws-mfa -t <token>
```

- By being asked

```bash
dotenv-aws-mfa
```

# Under the hood

## Order of precedence

1. Environment variables
2. Arguments
3. Interactive command line

# Fancy contribute

To install locally just run:

```bash
yarn build; yarn global add ${PWD}
dotenv-aws-mfa
```
