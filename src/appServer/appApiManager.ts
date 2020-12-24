//#region Imports
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as swagger from 'express-oas-generator';
import { Router } from 'express';
import { AppContext } from '../appContext';
import { ConfigurationManager } from './configurationManager';
import { EventPublisher } from './eventPublisher';
import { TSLogger } from '../logging/tslogger';
import { IAppServerSettings } from './appServerSettings';
import { IServiceConfiguration, ServiceBase } from './serviceBase';
import { ServiceLoader } from './serviceLoader';
import { IDisposable } from '../framework/using';
//#endregion

export interface IAppApiManager extends IDisposable
{
    Config: any;
    EventPublisher: EventPublisher;
    Express: any;
    ServiceMap: Map<string, ServiceBase>;

    GetService<TService extends ServiceBase>(name: string): TService;
    AddService(service: ServiceBase): void
}

export class AppApiManager implements IAppApiManager
{
    //#region Variables
    // Logging
    private Logger: TSLogger;

    protected Environment: string;

    private config: any;

    public get Config(): any
    {
        return this.config;
    }

    public set Config(val: any)
    {
        this.config = val;
    }

    // Event publisher
    private static eventPublisher: EventPublisher;

    // eslint-disable-next-line class-methods-use-this
    public get EventPublisher(): EventPublisher
    {
        return AppApiManager.eventPublisher;
    }

    // ExpressJS-related stuff
    private express: any;

    private router: Router;

    public get Express(): any
    {
        return this.express;
    }

    // A map of all AWS Service Clients
    public ServiceMap: Map<string, ServiceBase> = new Map<string, ServiceBase>();

    //#endregion

    //#region Constructors
    constructor(settings?: IAppServerSettings)
    {
        this.Environment = settings.Environment;
        if (this.Environment.length === 0)
        {
            this.Environment = 'local';
        }

        this.Config = new ConfigurationManager(settings).Configuration;
        this.Logger = new TSLogger().createLogger(`${AppContext.AppName}.${this.Environment}.${this.constructor.name}`, []);
        AppApiManager.eventPublisher = new EventPublisher(`${AppContext.AppName}.${this.Environment}.RestApi`);

        // Create the Express Web Server
        this.express = express();
        this.router = Router();

        // We need this so that the Swagger API executor can print out the response bodies.
        swagger.handleResponses(this.express, {});

        // Create the services
        // Important - create the services before the Express.use() statements. This is mainly because the Passport-based
        // AuthService needs to set up its serialization callbacks before Express uses Passport.
        this.loadAllServices(settings);

        // Add some middleware to support CORS requests
        this.express
            .use((_req, resp, next) =>
            {
                resp.header('Access-Control-Allow-Origin', '*');
                resp.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS');
                resp.header('Access-Control-Allow-Headers',
                    // eslint-disable-next-line max-len
                    'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
                next();
            });

        // Get the base URL for API requests
        let rootRouteName: string = this.Config.appSettings.route || `${AppContext.RestApiPrefix}`;
        if (!rootRouteName.startsWith('/'))
        {
            rootRouteName = `/${rootRouteName}`;
        }

        this.express
            // .use(passport.initialize())
            // .use(passport.session())
            .use(bodyParser.json())                             // support json encoded bodies
            .use(bodyParser.urlencoded({ extended: true }))     // support encoded bodies
            .use(rootRouteName, this.router);

        // Set up some common functionality in all services. Republishing their events and logging the resource changes.
        this.ServiceMap.forEach((service, _name, _map) =>
        {
            // Tell the service that the controlling API Manager is me.
            service.ApiManager = this;

            // eslint-disable-next-line func-names
            service.EventPublisher.on(`${EventPublisher.Prefix}**`, function (values: any[])
            {
                // Notice that we used the old-style Javascript function() above because we
                // want 'this' to refer to the event publisher and not to the MyProjectRestAPI class.
                //
                // The 'values' element is an Array[]. When we call emit() again, emit() will rewrap 'value'
                // into an Array[Array[]]. So, we need to deconstruct the values array before we call emit() again.
                AppApiManager.eventPublisher.emit(this.event, values[0]);
            });

            /* NOTYET
               See if any AWS resources (queues, topics, etc) have changed
            service.ResourceInfoChanged = (client, newMap) =>
            {
                this.Logger.info(`${client.Name}: The resource map has changed`);
                ProjectApiManager.eventPublisher.emit(`${AWSServiceEventPublisher.Prefix}Resource.Changed`,
                                                        client.ServiceType, client.Name, newMap);
            };
            */
        });

        this.initializeApis();

        // This has to be the very last middleware in the app
        swagger.handleRequests();
    }
    //#endregion

    //#region Cleanup
    public dispose(): void
    {
        this.ServiceMap.forEach((service, _name, _map) =>
        {
            service.dispose();
        });
        this.ServiceMap.clear();
    }
    //#endregion

    //#region Initialization
    private initializeApis(): void
    {
        const welcomeMsg = `Welcome to ${AppContext.AppName}`;

        if (!this.Config.appSettings.ignoreDefaultApis)
        {
            // A simple call just to make sure that the server is up
            this.router.route('/').get((_req, resp) =>
            {
                resp.json({ message: welcomeMsg });
            });

            if (AppContext.RestApiPrefix !== '/')
            {
                this.router.route(`${AppContext.RestApiPrefix}`).get((_req, resp) =>
                {
                    resp.json({ message: welcomeMsg });
                });
            }
        }

        // Create the APIs for each service
        this.ServiceMap.forEach((service, _name, _map) =>
        {
            service.createApi(this.router);
        });
    }
    //#endregion

    //#region Services
    private loadAllServices(settings?: IAppServerSettings): void
    {
        // Note: we should do this dynamically, through reflection
        if (!this.Config)
        {
            this.Config = new ConfigurationManager(settings).Configuration;
        }

        const listOfServices: IServiceConfiguration[] = this.Config.appSettings.services || [{ name: 'SampleService', properties: {} }];
        const services = ServiceLoader.LoadAllServices('ServiceBase', listOfServices, this, settings);

        // Add the various services to the map
        // tslint:disable-next-line:forin
        for (const serviceName in services)
        {
            const service: ServiceBase = services[serviceName] as ServiceBase;
            this.ServiceMap.set(service.Name, service);
        }
    }

    public AddService(service: ServiceBase): void
    {
        this.ServiceMap.set(service.Name, service);

        // Tell the service that the controlling API Manager is me.
        service.ApiManager = this;

        // Create the APIs for the service
        service.createApi(this.Express);

        // eslint-disable-next-line func-names
        service.EventPublisher.on(`${EventPublisher.Prefix}**`, function (values: any[])
        {
            AppApiManager.eventPublisher.emit(this.event, values[0]);
        });
    }

    public GetService<TService extends ServiceBase>(name: string): TService
    {
        if (!this.ServiceMap.has(name))
        {
            return null;
        }

        const service = this.ServiceMap.get(name);
        return service as TService;
    }
    //#endregion
}
