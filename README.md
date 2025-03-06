# AWS CloudFormation Systems Manager Parameter Store Secret Extension

Diese CloudFormation Extension erlaubt das Erstellen von AWS Systems Manager Parameter Store Secrets mit automatisch generierten Passwörtern.

## Installation

Die Resource Provider muss vor der Verwendung registriert werden:

```bash
aws cloudformation register-type \
  --type-name Surnet::ParameterStore::Secret \
  --schema-handler-package s3://bucket-name/resource-handler.zip \
  --type RESOURCE
```

## Verwendung

Nach der Registrierung kann die Ressource in CloudFormation Templates verwendet werden:

```yaml
Resources:
  MyDatabaseSecret:
    Type: Surnet::ParameterStore::Secret
    Properties:
      Name: /prod/db/password
      Description: "Produktions-Datenbank Passwort"
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
    Description: "Das generierte Datenbankpasswort"
```

## Properties

| Property | Typ | Beschreibung | Erforderlich |
|----------|-----|-------------|------------|
| Name | String | Name des Parameters im SSM Parameter Store | Ja |
| Description | String | Beschreibung des Parameters | Nein |
| KeyId | String | KMS Key ID für die Verschlüsselung | Nein |
| Tier | String | Parameter Store Tier (Standard oder Advanced) | Nein |
| PasswordOptions | Object | Optionen für die Passwortgenerierung | Nein |
| Tags | Array | Liste von Tags | Nein |

### PasswordOptions

| Property | Typ | Standard | Beschreibung |
|----------|-----|---------|-------------|
| Length | Number | 16 | Länge des Passworts |
| IncludeNumbers | Boolean | true | Zahlen einfügen |
| IncludeSymbols | Boolean | true | Sonderzeichen einfügen |
| ExcludeSimilarCharacters | Boolean | false | Ähnlich aussehende Zeichen ausschließen |

## Rückgabewerte

| Attribut | Beschreibung |
|----------|-------------|
| Name | Name des Parameters |
| GeneratedValue | Der generierte Passwort-Wert |

## Beispiel für den Zugriff auf das Passwort

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
