// This is a generated file. Modifications will be overwritten.
import { BaseModel, Dict, integer, Integer, Optional, transformValue } from '@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib';
import { Exclude, Expose, Type, Transform } from 'class-transformer';

export class ResourceModel extends BaseModel {
    @Exclude()
    public static readonly TYPE_NAME: string = 'Surnet::ParameterStore::Secret';

    @Exclude()
    protected readonly IDENTIFIER_KEY_NAME: string = '/properties/Name';

    @Expose({ name: 'Name' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'name', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    name?: Optional<string>;
    @Expose({ name: 'Description' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'description', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    description?: Optional<string>;
    @Expose({ name: 'KeyId' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'keyId', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    keyId?: Optional<string>;
    @Expose({ name: 'Tier' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'tier', value, obj, []),
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
        ({value, obj}) =>
            transformValue(String, 'generatedValue', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    generatedValue?: Optional<string>;
    @Expose({ name: 'Tags' })
    @Transform(
        ({value, obj}) =>
            transformValue(Tag, 'tags', value, obj, [Set]),
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
        ({value, obj}) =>
            transformValue(Integer, 'length', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    length?: Optional<integer>;
    @Expose({ name: 'IncludeNumbers' })
    @Transform(
        ({value, obj}) =>
            transformValue(Boolean, 'includeNumbers', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    includeNumbers?: Optional<boolean>;
    @Expose({ name: 'IncludeSymbols' })
    @Transform(
        ({value, obj}) =>
            transformValue(Boolean, 'includeSymbols', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    includeSymbols?: Optional<boolean>;
    @Expose({ name: 'ExcludeSimilarCharacters' })
    @Transform(
        ({value, obj}) =>
            transformValue(Boolean, 'excludeSimilarCharacters', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    excludeSimilarCharacters?: Optional<boolean>;

}

export class Tag extends BaseModel {

    @Expose({ name: 'Key' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'key', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    key?: Optional<string>;
    @Expose({ name: 'Value' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'value_', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    value_?: Optional<string>;

}

export class TypeConfigurationModel extends BaseModel {


}

