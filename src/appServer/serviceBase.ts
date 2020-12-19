import express = require('express');
import { ConfigurationManager } from './configurationManager';
import { EventPublisher } from './eventPublisher';
import { TSLogger } from '../logging/tslogger';
import { IServiceCreationArgs } from '../services/serviceCreationArgs';
import { IAppApiManager } from './appApiManager';
import { IDisposable } from '../framework/using';
import { HTTPStatusCode } from '../framework/httpStatusCode';
// import { IUserEventService, UserEventService } from './services/userEventService';

/**
 * This is what is in each service in the "services" section in the appSettings.json files.
 * There is at least a service name and an optional list of properties.
 */
export interface IServiceConfiguration {
    name: string;
    properties?: any;
    serviceType?: string;
}

export interface IServiceBase extends IDisposable
{
    Name: string;
    ServiceType: string;
    Config: any;
    EventPublisher: EventPublisher;
    ApiManager: IAppApiManager;
    Logger: any;
}

/**
 * ServiceBase
 *
 * @export
 * @class ServiceBase
 * @implements {IDisposable}
 */
export /* abstract */ class ServiceBase implements IServiceBase
{
    //#region Variables
    private static instanceNumber: number = 0;

    public static GlobalConfig: any;

    /**
     * Name
     *
     * @type {string}
     * @memberof ServiceBase
     */
    public name: string;
    public get Name(): string
    {
        return this.name;
    }
    public set Name(val: string)
    {
        this.name = val;
    }

    /**
     * ServiceType
     *
     * @type {string}
     * @memberof ServiceBase
     */
    public serviceType: string;
    public get ServiceType(): string
    {
        return this.serviceType;
    }
    public set ServiceType(val: string)
    {
        this.serviceType = val;
    }

    /**
     * Config
     *
     * @type {*}
     * @memberof ServiceBase
     */
    public config: any;
    public get Config(): any
    {
        return this.config;
    }
    public set Config(val: any)
    {
        this.config = val;
    }

    /**
     * Logger
     *
     * @protected
     * @type {*}
     * @memberof ServiceBase
     */
    public logger: any;
    public get Logger(): any
    {
        return this.logger;
    }
    public set Logger(val: any)
    {
        this.logger = val;
    }

    /**
     * EventPublisher
     *
     * @type {EventPublisher}
     * @memberof ServiceBase
     */
    public eventPublisher: EventPublisher;
    public get EventPublisher(): EventPublisher
    {
        return this.eventPublisher;
    }
    public set EventPublisher(val: EventPublisher)
    {
        this.eventPublisher = val;
    }

    private apiManager: IAppApiManager;
    public get ApiManager(): IAppApiManager
    {
        return this.apiManager;
    }
    public set ApiManager(val: IAppApiManager)
    {
        this.apiManager = val;
    }
    //#endregion

    //#region Constructors
    protected constructor(args: IServiceCreationArgs)
    {
        const inst = ++ServiceBase.instanceNumber;

        this.Name = args.Name;
        this.ServiceType = args.ServiceType;
        this.ApiManager = args.ApiManager;

        this.Config = new ConfigurationManager(args.Settings).Configuration;
        ServiceBase.GlobalConfig = this.Config;

        this.Logger = new TSLogger().createLogger(`${this.Name}-${inst}`, []);
        this.EventPublisher = new EventPublisher(this.Name);

        this.Logger.info(`Service ${this.Name} created`);
    }
    //#endregion

    //#region Cleanup
    public dispose(): void
    {
        this.Logger.info(`${this.Name} disposed`);
    }
    //#endregion

    //#region Methods
    protected getEntityName(): string
    {
        return this.Name.endsWith('Service') ? this.Name.replace('Service', '') : this.Name;
    }

    public getServiceConfiguration(): any
    {
        return this.Config;
    }

    public createApi(router: express.Router): void
    {
        router.route(`/${this.Name}`).get((req, resp) =>
        {
            this.Logger.info(`Got a simple GET request for the service: Name ${this.Name}`);
            resp.status(HTTPStatusCode.OK).json({ serviceName: this.Name });
        });
    }
    //#endregion

    //#region UserEventsService
    /*
    private userEventService: IUserEventService;
    protected getUserEventService(): IUserEventService
    {
        if (!this.userEventService)
        {
            this.userEventService = this.Manager.getService<UserEventService>('UserEventService');
        }

        return this.userEventService;
    }

    protected async addUserEvent(userId: number, eventName: string, entityId?: number)
    {
        if (this.getUserEventService())
        {
            await this.getUserEventService().addOneEvent(userId, eventName, entityId);
        }
    }
    */
    //#endregion
}
