# Surnet::ParameterStore::Secret

Resource schema for creating and managing AWS Systems Manager Parameter Store Secrets with generated passwords

## Syntax

To declare this entity in your AWS CloudFormation template, use the following syntax:

### JSON

<pre>
{
    "Type" : "Surnet::ParameterStore::Secret",
    "Properties" : {
        "<a href="#name" title="Name">Name</a>" : <i>String</i>,
        "<a href="#description" title="Description">Description</a>" : <i>String</i>,
        "<a href="#keyid" title="KeyId">KeyId</a>" : <i>String</i>,
        "<a href="#tier" title="Tier">Tier</a>" : <i>String</i>,
        "<a href="#passwordoptions" title="PasswordOptions">PasswordOptions</a>" : <i><a href="passwordoptions.md">PasswordOptions</a></i>,
        "<a href="#passwordinput" title="PasswordInput">PasswordInput</a>" : <i>String</i>,
        "<a href="#tags" title="Tags">Tags</a>" : <i>[ <a href="tag.md">Tag</a>, ... ]</i>
    }
}
</pre>

### YAML

<pre>
Type: Surnet::ParameterStore::Secret
Properties:
    <a href="#name" title="Name">Name</a>: <i>String</i>
    <a href="#description" title="Description">Description</a>: <i>String</i>
    <a href="#keyid" title="KeyId">KeyId</a>: <i>String</i>
    <a href="#tier" title="Tier">Tier</a>: <i>String</i>
    <a href="#passwordoptions" title="PasswordOptions">PasswordOptions</a>: <i><a href="passwordoptions.md">PasswordOptions</a></i>
    <a href="#passwordinput" title="PasswordInput">PasswordInput</a>: <i>String</i>
    <a href="#tags" title="Tags">Tags</a>: <i>
      - <a href="tag.md">Tag</a></i>
</pre>

## Properties

#### Name

The name of the parameter. Must be unique in the current account and region.

_Required_: Yes

_Type_: String

_Minimum Length_: <code>1</code>

_Maximum Length_: <code>2048</code>

_Pattern_: <code>^[a-zA-Z0-9_.-/]+$</code>

_Update requires_: [Replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement)

#### Description

Information about the parameter that you want to add to the system.

_Required_: No

_Type_: String

_Maximum Length_: <code>1024</code>

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### KeyId

The KMS key ID to use to encrypt the parameter. If not provided, AWS will use the default key.

_Required_: No

_Type_: String

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### Tier

Parameter Store parameter tier.

_Required_: No

_Type_: String

_Allowed Values_: <code>Standard</code> | <code>Advanced</code>

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### PasswordOptions

Options for password generation

_Required_: No

_Type_: <a href="passwordoptions.md">PasswordOptions</a>

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### PasswordInput

The password value. Either `PasswordInput` or `PasswordOptions` can be specified.

_Required_: No

_Type_: String

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### Tags

An array of key-value pairs to apply to this resource.

_Required_: No

_Type_: List of <a href="tag.md">Tag</a>

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

## Return Values

### Ref

When you pass the logical ID of this resource to the intrinsic `Ref` function, Ref returns the Name.

### Fn::GetAtt

The `Fn::GetAtt` intrinsic function returns a value for a specified attribute of this type. The following are the available attributes and sample return values.

For more information about using the `Fn::GetAtt` intrinsic function, see [Fn::GetAtt](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-getatt.html).

#### Arn

The Amazon Resource Name (ARN) of the parameter.

#### Password

The password value. This is a read-only property populated after creation.

