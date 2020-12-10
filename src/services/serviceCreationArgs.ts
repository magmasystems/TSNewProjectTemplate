import { IAppApiManager } from '../appApiManager';
import { AppContext } from '../appContext';
import { IAppServerSettings } from '../appServerSettings';

export interface IServiceCreationArgs
{
    ServiceType: string;
    Name: string;
    ApiManager?: IAppApiManager;
    Settings?: IAppServerSettings;
}

export class ServiceCreationArgs implements IServiceCreationArgs
{
    public ServiceType: string = AppContext.AppName;
    public Name: string;
    public ApiManager?: IAppApiManager;
    public Settings?: IAppServerSettings;
}
