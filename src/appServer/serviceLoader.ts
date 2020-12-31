import * as services from '../../services';
import { IServiceCreationArgs } from '../services/serviceCreationArgs';
import { IAppApiManager } from './appApiManager';
import { IServiceConfiguration } from './serviceBase';
import { IAppServerSettings } from './appServerSettings';
import { ReflectionHelpers } from '../framework/reflectionHelpers';
import { AppContext } from '../appContext';
import { FileHelpers } from '../framework/fileHelpers';
import { AppServer } from './appServer';

export class ServiceLoader
{
    // eslint-disable-next-line max-len
    public static LoadAllServices(baseClassName: string, servicesToLoad?: IServiceConfiguration[], apiManager?: IAppApiManager, settings?: IAppServerSettings): {}
    {
        const dict = {};

        /*
        const subclasses = ReflectionHelpers.getSubclassesOf(baseClassName);
        subclasses.map((classService) =>
        {
            // eslint-disable-next-line new-cap
            const service = new classService();
            dict[service.Name] = service;
            return service;
        });
        */

        if (servicesToLoad)
        {
            servicesToLoad.map((serviceConfig) =>
            {
                const args: IServiceCreationArgs = {
                    ServiceType: AppContext.AppName,
                    Name: '',
                    ApiManager: apiManager,
                    Settings: settings,
                    ConfigProperties: serviceConfig.properties,
                };

                // Declare serviceName as any to get rid of an error that says that a String cannot be used as an index type
                const serviceName: any = serviceConfig.name;

                try
                {
                    const service = new (services as any)[serviceName](args);
                    dict[service.Name] = service;
                    return service;
                }
                catch (e)
                {
                    // eslint-disable-next-line no-console
                    apiManager.Logger.warn(`ServiceLoader: cannot load service ${serviceName}: ${e.message}`);
                    return null;
                }
            });
        }

        return dict;
    }

    public static GetServiceConfig(server: AppServer, service: string): any
    {
        if (!server.Configuration.appSettings.services)
        {
            return null;
        }

        const servicesConfig: IServiceConfiguration[] = server.Configuration.appSettings.services;
        for (const serviceConfig of servicesConfig)
        {
            if (serviceConfig.name && serviceConfig.name === service)
            {
                return serviceConfig;
            }
        }

        return null;
    }

    public static LoadService(serviceConfig?: IServiceConfiguration, apiManager?: IAppApiManager, settings?: IAppServerSettings): any
    {
        const args: IServiceCreationArgs = {
            ServiceType: serviceConfig.serviceType || AppContext.AppName,
            Name: serviceConfig.name,
            ApiManager: apiManager,
            Settings: settings,
            ConfigProperties: serviceConfig.properties,
        };

        // Declare serviceName as any to get rid of an error that says that a String cannot be used as an index type
        const serviceName: any = serviceConfig.name;

        const service = new (services as any)[serviceName](args);

        service.createApi(apiManager.Express);
        return service;
    }
}
