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
import { ResourceModel, TypeConfigurationModel } from './models';
import { SSM } from 'aws-sdk';

interface CallbackContext extends Record<string, any> {}

interface PasswordOptions {
    length?: bigint;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    excludeSimilarCharacters?: boolean;
}

// Helper function to generate a random password
function generatePassword(options: PasswordOptions = {}): string {
    const {
        length = 16,
        includeNumbers = true,
        includeSymbols = true,
        excludeSimilarCharacters = false
    } = options;
  
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    if (excludeSimilarCharacters) {
        chars = chars.replace(/[ilLI|`oO0]/g, '');
    }
  
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
            
            const passwordOptions: PasswordOptions = model.passwordOptions || {};
            const generatedPassword = generatePassword({
                length: passwordOptions.length,
                includeNumbers: passwordOptions.includeNumbers !== false,
                includeSymbols: passwordOptions.includeSymbols !== false,
                excludeSimilarCharacters: passwordOptions.excludeSimilarCharacters
            });
            
            const params: any = {
                Name: model.name,
                Type: 'SecureString',
                Value: generatedPassword,
                Overwrite: false
            };
            
            if (model.description) params.Description = model.description;
            if (model.keyId) params.KeyId = model.keyId;
            if (model.tier) params.Tier = model.tier;
            
            await ssm.putParameter(params).promise();
            
            // Set the generated value on the model
            model.generatedValue = generatedPassword;
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
            
            const params: any = {
                Name: model.name,
                Type: 'SecureString',
                Value: existingParam.Parameter.Value,
                Overwrite: true
            };
            
            if (model.description) params.Description = model.description;
            if (model.keyId) params.KeyId = model.keyId;
            if (model.tier) params.Tier = model.tier;
            
            await ssm.putParameter(params).promise();
            
            // Set the generated value on the model
            model.generatedValue = existingParam.Parameter.Value;
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
            
            const describeResponse = await ssm.describeParameters({
                ParameterFilters: [{
                    Key: 'Name',
                    Values: [model.name]
                }]
            }).promise();
            
            if (describeResponse.Parameters && describeResponse.Parameters[0]) {
                model.description = describeResponse.Parameters[0].Description;
                model.tier = describeResponse.Parameters[0].Tier;
            }
            model.generatedValue = response.Parameter.Value;
            
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
