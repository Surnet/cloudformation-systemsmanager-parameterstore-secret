import {
    Action,
    BaseResource,
    exceptions,
    handlerEvent,
    HandlerErrorCode,
    LoggerProxy,
    OperationStatus,
    Optional,
    ProgressEvent,
    ResourceHandlerRequest,
    SessionProxy,
} from '@amazon-web-services-cloudformation/cloudformation-cli-typescript-lib';
import { ResourceModel, Tag, TypeConfigurationModel } from './models';
import { SSM } from 'aws-sdk';

interface CallbackContext extends Record<string, any> {}

interface PasswordOptions {
    length?: bigint;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    
}

// Helper function to generate a random password
function generatePassword(options: PasswordOptions = {}): string {
    const {
        length = 16,
        includeNumbers = true,
        includeSymbols = true
    } = options;
  
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return password;
}

class Resource extends BaseResource<ResourceModel> {

    /**
     * CloudFormation invokes this handler when the resource is initially created
     * during stack create operations.
     *
     * @param session Current AWS session passed through from caller
     * @param request The request object for the provisioning request passed to the implementor
     * @param callbackContext Custom context object to allow the passing through of additional
     * state or metadata between subsequent retries
     * @param typeConfiguration Configuration data for this resource type, in the given account
     * and region
     * @param logger Logger to proxy requests to default publishers
     */
    @handlerEvent(Action.Create)
    public async create(
        session: Optional<SessionProxy>,
        request: ResourceHandlerRequest<ResourceModel>,
        callbackContext: CallbackContext,
        logger: LoggerProxy,
        typeConfiguration: TypeConfigurationModel,
    ): Promise<ProgressEvent<ResourceModel, CallbackContext>> {
        const model = new ResourceModel(request.desiredResourceState);
        const progress = ProgressEvent.progress<ProgressEvent<ResourceModel, CallbackContext>>(model);
        
        try {
            if (!(session instanceof SessionProxy)) {
                throw new exceptions.InternalFailure('Session not initialized');
            }
            
            logger.log(`Creating parameter ${model.name}`);
            const ssm = session.client<SSM>('SSM');

            if (model.passwordOptions && model.passwordInput) {
                throw new exceptions.InvalidRequest('Cannot specify both PasswordOptions and PasswordInput');
            }

            let password: string;
            if (model.passwordInput) {
                // If the password is provided, just create the parameter with that value
                password = model.passwordInput;
            } else if (model.passwordOptions) {
                // Otherwise, generate a random password
                const passwordOptions: PasswordOptions = model.passwordOptions;
                password = generatePassword({
                    length: passwordOptions.length,
                    includeNumbers: passwordOptions.includeNumbers !== false,
                    includeSymbols: passwordOptions.includeSymbols !== false
                });
            } else {
                throw new exceptions.InvalidRequest('Must specify either PasswordOptions or PasswordInput');
            }
            
            const params: SSM.Types.PutParameterRequest = {
                Name: model.name,
                Type: 'SecureString',
                Value: password,
                Overwrite: false
            };
            
            if (model.description) params.Description = model.description;
            if (model.keyId) params.KeyId = model.keyId;
            if (model.tier) params.Tier = model.tier;
            if (request.desiredResourceState.tags) params.Tags = Array.from(request.desiredResourceState.tags) as any as SSM.TagList;
            if (request.systemTags) {
                if (!params.Tags) params.Tags = [];
                Object.entries(request.systemTags).forEach(([key, value]) => {
                    params.Tags.push({ Key: key, Value: value });
                });
            }
            
            await ssm.putParameter(params).promise();
            
            // Set the generated value on the model
            model.password = password;
            progress.resourceModel = model;
            progress.status = OperationStatus.Success;
        } catch (err) {
            logger.log(err);
            throw new exceptions.InternalFailure(err.message);
        }
        return progress;
    }

    /**
     * CloudFormation invokes this handler when the resource is updated
     * as part of a stack update operation.
     *
     * @param session Current AWS session passed through from caller
     * @param request The request object for the provisioning request passed to the implementor
     * @param callbackContext Custom context object to allow the passing through of additional
     * state or metadata between subsequent retries
     * @param typeConfiguration Configuration data for this resource type, in the given account
     * and region
     * @param logger Logger to proxy requests to default publishers
     */
    @handlerEvent(Action.Update)
    public async update(
        session: Optional<SessionProxy>,
        request: ResourceHandlerRequest<ResourceModel>,
        callbackContext: CallbackContext,
        logger: LoggerProxy,
        typeConfiguration: TypeConfigurationModel,
    ): Promise<ProgressEvent<ResourceModel, CallbackContext>> {
        const model = new ResourceModel(request.desiredResourceState);
        const oldModel = request.previousResourceState;
        const progress = ProgressEvent.progress<ProgressEvent<ResourceModel, CallbackContext>>(model);
        
        try {
            if (!(session instanceof SessionProxy)) {
                throw new exceptions.InternalFailure('Session not initialized');
            }
            
            logger.log(`Updating parameter ${model.name}`);
            
            // If the name changes, that's not allowed (create-only property)
            if (model.name !== oldModel?.name) {
                throw new exceptions.InvalidRequest('Cannot update parameter name');
            }
            
            const ssm = session.client<SSM>('SSM');
            
            // First get the existing parameter to preserve the password
            const existingParam = await ssm.getParameter({
                Name: model.name,
                WithDecryption: true
            }).promise();

            if (model.passwordOptions && model.passwordInput) {
                throw new exceptions.InvalidRequest('Cannot specify both PasswordOptions and PasswordInput');
            }

            let password = existingParam.Parameter.Value;
            if (model.passwordInput) {
                // If the password is provided, just update the parameter with that value
                password = model.passwordInput;
            } else if (model.passwordOptions) {
                if (model.passwordOptions.length === oldModel?.passwordOptions?.length &&
                    model.passwordOptions.includeNumbers === oldModel.passwordOptions.includeNumbers &&
                    model.passwordOptions.includeSymbols === oldModel.passwordOptions.includeSymbols &&
                    model.passwordOptions.serial === oldModel.passwordOptions.serial) {
                    // If the password options haven't changed, keep the existing password
                    password = existingParam.Parameter.Value;
                } else {
                    // Otherwise, generate a random password if passwordOptions changed
                    const passwordOptions: PasswordOptions = model.passwordOptions;
                    password = generatePassword({
                        length: passwordOptions.length,
                        includeNumbers: passwordOptions.includeNumbers !== false,
                        includeSymbols: passwordOptions.includeSymbols !== false
                    });
                }
            } else {
                throw new exceptions.InvalidRequest('Must specify either PasswordOptions or PasswordInput');
            }
            
            // Update the parameter with the new values
            const params: SSM.Types.PutParameterRequest = {
                Name: model.name,
                Type: 'SecureString',
                Value: password,
                Overwrite: true
            };
            if (model.description) params.Description = model.description;
            if (model.keyId) params.KeyId = model.keyId;
            if (model.tier) params.Tier = model.tier;
            await ssm.putParameter(params).promise();
            
            // Compare tags from desired state to existing state and update as needed with add or remove tag
            const desiredTags = new Set(request.desiredResourceState.tags);
            const existingTags = new Set(oldModel?.tags || []);
            const tagsToAdd = new Set([...desiredTags].filter(tag => !existingTags.has(tag)));
            // Extract keys from desired tags for comparison
            const desiredTagKeys = new Set(Array.from(desiredTags).map(tag => (tag as any).Key));
            const tagsToRemove = new Set([...existingTags].filter(tag => !desiredTagKeys.has((tag as any).Key)));
            if (tagsToRemove.size > 0) {
                await ssm.removeTagsFromResource({
                    ResourceType: 'Parameter',
                    ResourceId: model.name,
                    TagKeys: Array.from(tagsToRemove).map(tag => (tag as any).Key)
                }).promise();
            }
            if (tagsToAdd.size > 0) {
                await ssm.addTagsToResource({
                    ResourceType: 'Parameter',
                    ResourceId: model.name,
                    Tags: Array.from(tagsToAdd) as any as SSM.TagList
                }).promise();
            }

            // Set the generated value on the model
            model.password = existingParam.Parameter.Value;
            progress.resourceModel = model;
            progress.status = OperationStatus.Success;
        } catch (err) {
            logger.log(err);
            throw new exceptions.InternalFailure(err.message);
        }
        return progress;
    }

    /**
     * CloudFormation invokes this handler when the resource is deleted, either when
     * the resource is deleted from the stack as part of a stack update operation,
     * or the stack itself is deleted.
     *
     * @param session Current AWS session passed through from caller
     * @param request The request object for the provisioning request passed to the implementor
     * @param callbackContext Custom context object to allow the passing through of additional
     * state or metadata between subsequent retries
     * @param typeConfiguration Configuration data for this resource type, in the given account
     * and region
     * @param logger Logger to proxy requests to default publishers
     */
    @handlerEvent(Action.Delete)
    public async delete(
        session: Optional<SessionProxy>,
        request: ResourceHandlerRequest<ResourceModel>,
        callbackContext: CallbackContext,
        logger: LoggerProxy,
        typeConfiguration: TypeConfigurationModel,
    ): Promise<ProgressEvent<ResourceModel, CallbackContext>> {
        const model = new ResourceModel(request.desiredResourceState);
        const progress = ProgressEvent.progress<ProgressEvent<ResourceModel, CallbackContext>>();
        
        try {
            if (!(session instanceof SessionProxy)) {
                throw new exceptions.InternalFailure('Session not initialized');
            }
            
            logger.log(`Deleting parameter ${model.name}`);
            const ssm = session.client<SSM>('SSM');
            
            await ssm.deleteParameter({
                Name: model.name
            }).promise();
            
            progress.status = OperationStatus.Success;
        } catch (err) {
            logger.log(err);
            throw new exceptions.InternalFailure(err.message);
        }
        return progress;
    }

    /**
     * CloudFormation invokes this handler as part of a stack update operation when
     * detailed information about the resource's current state is required.
     *
     * @param session Current AWS session passed through from caller
     * @param request The request object for the provisioning request passed to the implementor
     * @param callbackContext Custom context object to allow the passing through of additional
     * state or metadata between subsequent retries
     * @param typeConfiguration Configuration data for this resource type, in the given account
     * and region
     * @param logger Logger to proxy requests to default publishers
     */
    @handlerEvent(Action.Read)
    public async read(
        session: Optional<SessionProxy>,
        request: ResourceHandlerRequest<ResourceModel>,
        callbackContext: CallbackContext,
        logger: LoggerProxy,
        typeConfiguration: TypeConfigurationModel,
    ): Promise<ProgressEvent<ResourceModel, CallbackContext>> {
        const model = new ResourceModel(request.desiredResourceState);
        
        try {
            if (!(session instanceof SessionProxy)) {
                throw new exceptions.InternalFailure('Session not initialized');
            }
            
            logger.log(`Reading parameter ${model.name}`);
            const ssm = session.client<SSM>('SSM');
            
            const response = await ssm.getParameter({
                Name: model.name,
                WithDecryption: true
            }).promise();
            
            model.arn = response.Parameter.ARN;
            model.password = response.Parameter.Value;
            
            const progress = ProgressEvent.success<ProgressEvent<ResourceModel, CallbackContext>>(model);
            return progress;
        } catch (err) {
            logger.log(err);
            throw new exceptions.InternalFailure(err.message);
        }
    }

    /**
     * CloudFormation invokes this handler when summary information about multiple
     * resources of this resource provider is required.
     *
     * @param session Current AWS session passed through from caller
     * @param request The request object for the provisioning request passed to the implementor
     * @param callbackContext Custom context object to allow the passing through of additional
     * state or metadata between subsequent retries
     * @param typeConfiguration Configuration data for this resource type, in the given account
     * and region
     * @param logger Logger to proxy requests to default publishers
     */
    @handlerEvent(Action.List)
    public async list(
        session: Optional<SessionProxy>,
        request: ResourceHandlerRequest<ResourceModel>,
        callbackContext: CallbackContext,
        logger: LoggerProxy,
        typeConfiguration: TypeConfigurationModel,
    ): Promise<ProgressEvent<ResourceModel, CallbackContext>> {
        try {
            if (!(session instanceof SessionProxy)) {
                throw new exceptions.InternalFailure('Session not initialized');
            }
            
            logger.log('Listing parameters');
            const ssm = session.client<SSM>('SSM');
            
            const response = await ssm.describeParameters().promise();
            const models = response.Parameters.map(param => {
                const model = new ResourceModel();
                model.name = param.Name;
                return model;
            });
            
            const progress = ProgressEvent.builder<ProgressEvent<ResourceModel, CallbackContext>>()
                .status(OperationStatus.Success)
                .resourceModels(models)
                .build();
                
            return progress;
        } catch (err) {
            logger.log(err);
            throw new exceptions.InternalFailure(err.message);
        }
    }
}

// @ts-ignore // if running against v1.0.1 or earlier of plugin the 5th argument is not known but best to ignored (runtime code may warn)
export const resource = new Resource(ResourceModel.TYPE_NAME, ResourceModel, null, null, TypeConfigurationModel)!;

// Entrypoint for production usage after registered in CloudFormation
export const entrypoint = resource.entrypoint;

// Entrypoint used for local testing
export const testEntrypoint = resource.testEntrypoint;
