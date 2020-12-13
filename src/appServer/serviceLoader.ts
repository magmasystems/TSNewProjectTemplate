import * as services from '../../index';
import { IServiceCreationArgs } from '../services/serviceCreationArgs';
import { IAppApiManager, IServiceConfig } from './appApiManager';
import { IAppServerSettings } from './appServerSettings';
import { ReflectionHelpers } from '../framework/reflectionHelpers';
import { AppContext } from '../appContext';

export class ServiceLoader
{
    // eslint-disable-next-line max-len
    public static LoadAllServices(baseClassName: string, classNamesToLoad?: IServiceConfig[], apiManager?: IAppApiManager, settings?: IAppServerSettings): {}
    {
        const dict = {};
        const subclasses = ReflectionHelpers.getSubclassesOf(baseClassName);
        subclasses.map((classService) =>
        {
            // eslint-disable-next-line new-cap
            const service = new classService();
            dict[service.Name] = service;
            return service;
        });

        if (classNamesToLoad)
        {
            classNamesToLoad.map((serviceConfig) =>
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

                const service = new (services as any)[serviceName](args);
                dict[service.Name] = service;
                return service;
            });
        }

        return dict;
    }
}
