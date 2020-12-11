import * as services from '../../index';
import { IServiceCreationArgs } from '../services/serviceCreationArgs';
import { IAppApiManager } from './appApiManager';
import { IAppServerSettings } from './appServerSettings';
import { ReflectionHelpers } from '../framework/reflectionHelpers';
import { AppContext } from '../appContext';

export class ServiceLoader
{
    // eslint-disable-next-line max-len
    public static LoadAllServices(baseClassName: string, classNamesToLoad?: string[], apiManager?: IAppApiManager, settings?: IAppServerSettings): {}
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
            classNamesToLoad.map((name) =>
            {
                const args: IServiceCreationArgs = {
                    ServiceType: AppContext.AppName,
                    Name: '',
                    ApiManager: apiManager,
                    Settings: settings,
                };
                const service = new (services as any)[name](args);
                dict[service.Name] = service;
                return service;
            });
        }

        return dict;
    }
}
