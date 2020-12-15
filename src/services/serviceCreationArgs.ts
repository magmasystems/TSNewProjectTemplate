import { IAppApiManager } from '../appServer/appApiManager';
import { AppContext } from '../appContext';
import { IAppServerSettings } from '../appServer/appServerSettings';

export interface IServiceCreationArgs
{
    Name: string;
    ServiceType?: string;
    ApiManager?: IAppApiManager;
    Settings?: IAppServerSettings;
    ConfigProperties? : any;
}

export class ServiceCreationArgs implements IServiceCreationArgs
{
    public Name: string;
    public ServiceType?: string = AppContext.AppName;
    public ApiManager?: IAppApiManager;
    public Settings?: IAppServerSettings;
    public ConfigProperties? : any;
}
