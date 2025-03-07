# Surnet::ParameterStore::Secret PasswordOptions

Options for password generation

## Syntax

To declare this entity in your AWS CloudFormation template, use the following syntax:

### JSON

<pre>
{
    "<a href="#length" title="Length">Length</a>" : <i>Integer</i>,
    "<a href="#includenumbers" title="IncludeNumbers">IncludeNumbers</a>" : <i>Boolean</i>,
    "<a href="#includesymbols" title="IncludeSymbols">IncludeSymbols</a>" : <i>Boolean</i>,
    "<a href="#serial" title="Serial">Serial</a>" : <i>Integer</i>
}
</pre>

### YAML

<pre>
<a href="#length" title="Length">Length</a>: <i>Integer</i>
<a href="#includenumbers" title="IncludeNumbers">IncludeNumbers</a>: <i>Boolean</i>
<a href="#includesymbols" title="IncludeSymbols">IncludeSymbols</a>: <i>Boolean</i>
<a href="#serial" title="Serial">Serial</a>: <i>Integer</i>
</pre>

## Properties

#### Length

Length of the generated password

_Required_: No

_Type_: Integer

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### IncludeNumbers

Whether to include numbers in the password

_Required_: No

_Type_: Boolean

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### IncludeSymbols

Whether to include symbols in the password

_Required_: No

_Type_: Boolean

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

#### Serial

Whether to generate a new password

_Required_: No

_Type_: Integer

_Update requires_: [No interruption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-no-interrupt)

