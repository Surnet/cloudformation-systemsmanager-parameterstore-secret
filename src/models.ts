// This is a generated file. Modifications will be overwritten.
import { BaseModel, Dict, integer, Integer, Optional, transformValue } from '@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib';
import { Exclude, Expose, Type, Transform, TransformFnParams } from 'class-transformer';

export class ResourceModel extends BaseModel {
    @Exclude()
    public static readonly TYPE_NAME: string = 'Surnet::ParameterStore::Secret';

    @Exclude()
    protected readonly IDENTIFIER_KEY_NAME: string = '/properties/Name';

    @Expose({ name: 'Name' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'name', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    name?: Optional<string>;
    @Expose({ name: 'Description' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'description', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    description?: Optional<string>;
    @Expose({ name: 'KeyId' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'keyId', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    keyId?: Optional<string>;
    @Expose({ name: 'Tier' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'tier', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    tier?: Optional<string>;
    @Expose({ name: 'PasswordOptions' })
    @Type(() => PasswordOptions)
    passwordOptions?: Optional<PasswordOptions>;
    @Expose({ name: 'GeneratedValue' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'generatedValue', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    generatedValue?: Optional<string>;
    @Expose({ name: 'Tags' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(Tag, 'tags', params.value, params.obj, [Set]),
        {
            toClassOnly: true,
        }
    )
    tags?: Optional<Set<Tag>>;

    @Exclude()
    public getPrimaryIdentifier(): Dict {
        const identifier: Dict = {};
        if (this.name != null) {
            identifier[this.IDENTIFIER_KEY_NAME] = this.name;
        }

        // only return the identifier if it can be used, i.e. if all components are present
        return Object.keys(identifier).length === 1 ? identifier : null;
    }

    @Exclude()
    public getAdditionalIdentifiers(): Array<Dict> {
        const identifiers: Array<Dict> = new Array<Dict>();
        // only return the identifiers if any can be used
        return identifiers.length === 0 ? null : identifiers;
    }
}

export class PasswordOptions extends BaseModel {

    @Expose({ name: 'Length' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(Integer, 'length', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    length?: Optional<integer>;
    @Expose({ name: 'IncludeNumbers' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(Boolean, 'includeNumbers', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    includeNumbers?: Optional<boolean>;
    @Expose({ name: 'IncludeSymbols' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(Boolean, 'includeSymbols', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    includeSymbols?: Optional<boolean>;
    @Expose({ name: 'ExcludeSimilarCharacters' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(Boolean, 'excludeSimilarCharacters', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    excludeSimilarCharacters?: Optional<boolean>;

}

export class Tag extends BaseModel {

    @Expose({ name: 'Key' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'key', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    key?: Optional<string>;
    @Expose({ name: 'Value' })
    @Transform(
        (params: TransformFnParams) =>
            transformValue(String, 'value_', params.value, params.obj, []),
        {
            toClassOnly: true,
        }
    )
    value_?: Optional<string>;

}

export class TypeConfigurationModel extends BaseModel {


}

