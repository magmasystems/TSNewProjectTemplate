import { IAppApiManager } from '../appServer/appApiManager';
import { AppContext } from '../appContext';
import { IAppServerSettings } from '../appServer/appServerSettings';

export interface IServiceCreationArgs
{
    ServiceType: string;
    Name: string;
    ApiManager?: IAppApiManager;
    Settings?: IAppServerSettings;
    ConfigProperties? : any;
}

export class ServiceCreationArgs implements IServiceCreationArgs
{
    public ServiceType: string = AppContext.AppName;
    public Name: string;
    public ApiManager?: IAppApiManager;
    public Settings?: IAppServerSettings;
    public ConfigProperties? : any;
}
