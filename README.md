# Why

Because switching between AWS credentials is annoying with mfa.

## Status

Still beta

## Prerequisite

Before using the script you have to have aws access key and secret key present in `~/.aws/credentials`

## How

1. Install [direnv](https://direnv.net/) or a clone but I've only tested in `direnv`.

2. Create a `.envrc` file in your project with following configuration:

```bash
# .envrc
dotenv
```

It is safe to check-in to repository.

3. Add an empty `.env` file

4. First use

```bash
dotenv-aws-mfa
```

5. Once `.envrc` is reloaded you can just use

```bash
dotenv-aws-mfa -t <token>
```

## Something is not right

```bash
DEBUG=dotenv-aws-mfa dotenv-aws-mfa -t <token>
```

## Under the hood

### Order of precedence

1. Environment variables
2. Arguments
3. Interactive command line

## Fancy contribute

To install locally just run:

```bash
yarn build; yarn global add ${PWD}
dotenv-aws-mfa
```
