# AWS CloudFormation Systems Manager Parameter Store Secret Extension

This CloudFormation Extension allows the creation of AWS Systems Manager Parameter Store Secrets with automatically generated passwords.
You can find the docs in [here](./docs/README.md).

## Installation

The Resource Provider must be installed before use.

### Dependencies

To build and install the Extension some CLI Tools are needed.
On Mac you can install them like this.

```bash
brew install awscli
brew install aws-sam-cli
brew install pipx
pipx install cloudformation-cli
pipx runpip cloudformation-cli install --upgrade setuptools
pipx inject cloudformation-cli git+https://github.com/HeatherFlux/cloudformation-cli-typescript-plugin.git@bugfix/arch-1058-fix-dependency-and-python --force
```

### Installation

To install the extension you can run the following command:

```bash
./deploy.sh
```

Use [environment variables](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-envvars.html) to specify where to install the extension.

```bash
AWS_PROFILE=dev ./deploy.sh
```

## Usage

After registration, the resource can be used in CloudFormation templates.

### Genrated Passwords

```yaml
Resources:
  MyDatabaseSecret:
    Type: Surnet::ParameterStore::Secret
    Properties:
      Name: /prod/db/password
      Description: "Production database password"
      PasswordOptions:
        Length: 24
        IncludeNumbers: true
        IncludeSymbols: true
        Serial: 1
      Tags:
        - Key: Environment
          Value: Production
        - Key: Application
          Value: MyApp

Outputs:
  DatabasePassword:
    Value: !GetAtt MyDatabaseSecret.Password
    Description: "The generated database password"
```

### User-defined Passwords

```yaml
Resources:
  MyDatabaseSecret:
    Type: Surnet::ParameterStore::Secret
    Properties:
      Name: /prod/db/password
      Description: "Production database password"
      PasswordInput: "MySuperSecretPassword"
      Tags:
        - Key: Environment
          Value: Production
        - Key: Application
          Value: MyApp

Outputs:
  DatabasePassword:
    Value: !GetAtt MyDatabaseSecret.Password
    Description: "The generated database password"
```
