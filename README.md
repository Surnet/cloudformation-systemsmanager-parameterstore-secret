# AWS CloudFormation Systems Manager Parameter Store Secret Extension

This CloudFormation Extension allows the creation of AWS Systems Manager Parameter Store Secrets with automatically generated passwords.

## Installation

The Resource Provider must be registered before use:

```bash
aws cloudformation register-type \
  --type-name Surnet::ParameterStore::Secret \
  --schema-handler-package s3://bucket-name/resource-handler.zip \
  --type RESOURCE
```

## Usage

After registration, the resource can be used in CloudFormation templates:

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
        ExcludeSimilarCharacters: true
      Tags:
        - Key: Environment
          Value: Production
        - Key: Application
          Value: MyApp

Outputs:
  DatabasePassword:
    Value: !GetAtt MyDatabaseSecret.GeneratedValue
    Description: "The generated database password"
```

## Properties

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| Name | String | Name of the parameter in SSM Parameter Store | Yes |
| Description | String | Description of the parameter | No |
| KeyId | String | KMS Key ID for encryption | No |
| Tier | String | Parameter Store Tier (Standard or Advanced) | No |
| PasswordOptions | Object | Options for password generation | No |
| Tags | Array | List of tags | No |

### PasswordOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Length | Number | 16 | Length of the password |
| IncludeNumbers | Boolean | true | Include numbers |
| IncludeSymbols | Boolean | true | Include special characters |
| ExcludeSimilarCharacters | Boolean | false | Exclude similar-looking characters |

## Return Values

| Attribute | Description |
|-----------|-------------|
| Name | Name of the parameter |
| GeneratedValue | The generated password value |

## Example for accessing the password

```yaml
Resources:
  MyEC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-12345678
      InstanceType: t3.micro
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          echo "DB_PASSWORD=${MyDatabaseSecret.GeneratedValue}" > /etc/app/config
```
