// This is a generated file. Modifications will be overwritten.
import { BaseModel, Dict, integer, Integer, Optional, transformValue } from '@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib';
import { Exclude, Expose, Type, Transform } from 'class-transformer';

export class ResourceModel extends BaseModel {
    @Exclude()
    public static readonly TYPE_NAME: string = 'Surnet::ParameterStore::Secret';

    @Exclude()
    protected readonly IDENTIFIER_KEY_TPSCODE: string = '/properties/TPSCode';

    @Expose({ name: 'TPSCode' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'tPSCode', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    tPSCode?: Optional<string>;
    @Expose({ name: 'Title' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'title', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    title?: Optional<string>;
    @Expose({ name: 'CoverSheetIncluded' })
    @Transform(
        ({value, obj}) =>
            transformValue(Boolean, 'coverSheetIncluded', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    coverSheetIncluded?: Optional<boolean>;
    @Expose({ name: 'DueDate' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'dueDate', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    dueDate?: Optional<string>;
    @Expose({ name: 'ApprovalDate' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'approvalDate', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    approvalDate?: Optional<string>;
    @Expose({ name: 'Memo' })
    @Type(() => Memo)
    memo?: Optional<Memo>;
    @Expose({ name: 'SecondCopyOfMemo' })
    @Type(() => Memo)
    secondCopyOfMemo?: Optional<Memo>;
    @Expose({ name: 'TestCode' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'testCode', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    testCode?: Optional<string>;
    @Expose({ name: 'Authors' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'authors', value, obj, [Array]),
        {
            toClassOnly: true,
        }
    )
    authors?: Optional<Array<string>>;
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
        if (this.tPSCode != null) {
            identifier[this.IDENTIFIER_KEY_TPSCODE] = this.tPSCode;
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

export class Memo extends BaseModel {

    @Expose({ name: 'Heading' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'heading', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    heading?: Optional<string>;
    @Expose({ name: 'Body' })
    @Transform(
        ({value, obj}) =>
            transformValue(String, 'body', value, obj, []),
        {
            toClassOnly: true,
        }
    )
    body?: Optional<string>;

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

