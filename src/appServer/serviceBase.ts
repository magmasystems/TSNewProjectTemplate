import express = require('express');
import { ConfigurationManager } from './configurationManager';
import { EventPublisher } from './eventPublisher';
import { TSLogger } from '../logging/tslogger';
import { IServiceCreationArgs } from '../services/serviceCreationArgs';
import { IAppApiManager } from './appApiManager';
import { IAppServerSettings } from './appServerSettings';
import { IDisposable } from '../framework/using';
// import { IUserEventService, UserEventService } from './services/userEventService';

/**
 * ServiceBase
 *
 * @export
 * @class ServiceBase
 * @implements {IDisposable}
 */
export abstract class ServiceBase implements IDisposable
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
    public Name: string;

    /**
     * ServiceType
     *
     * @type {string}
     * @memberof ServiceBase
     */
    public ServiceType: string;

    /**
     * Config
     *
     * @type {*}
     * @memberof ServiceBase
     */
    public Config: any;

    /**
     * Logger
     *
     * @protected
     * @type {*}
     * @memberof ServiceBase
     */
    protected Logger: any;

    /**
     * EventPublisher
     *
     * @type {EventPublisher}
     * @memberof ServiceBase
     */
    public EventPublisher: EventPublisher;

    private apiManager: IAppApiManager;
    public get Manager(): IAppApiManager
    {
        return this.apiManager;
    }
    public set Manager(val: IAppApiManager)
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
        this.Manager = args.ApiManager;

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
            this.Logger.info(`Got a simple GET request for the service: Name ${req.params.queue}`);
            resp.status(200).json({ serviceName: this.Name });
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
