import { AppContext } from '../appContext';
import { DatabaseConfiguration } from '../configuration/dbConfig';
import { EventPublisher } from './eventPublisher';
import { AppApiManager } from './appApiManager';
import { IAppServerSettings } from './appServerSettings';
import { IDisposable } from '../framework/using';

export class AppServer implements IDisposable
{
    //#region Variables
    private apiManager: AppApiManager;
    private settings?: IAppServerSettings;
    private userName: string;

    // Shortcuts for things that the ApiManager has
    public get ApiManager(): AppApiManager
    {
        return this.apiManager;
    }
    public get MyProjectEvents(): EventPublisher
    {
        return this.ApiManager.EventPublisher;
    }
    public get Configuration(): any
    {
        return this.ApiManager.Config;
    }
    public get App(): any
    {
        return this.ApiManager.Express;
    }

    public get AppContext(): AppContext
    {
        return AppContext;
    }
    public get UserName(): string
    {
        return this.userName;
    }
    public get Settings(): IAppServerSettings
    {
        return this.settings;
    }
    public get Environment(): string
    {
        return this.Settings.Environment || undefined;
    }
    //#endregion

    //#region Constructors
    constructor(settings?: IAppServerSettings)
    {
        this.settings = settings;
        DatabaseConfiguration.Initialize(settings);
        this.apiManager = new AppApiManager(settings);
        this.userName = this.Configuration.appSettings.authentication.username || 'UnknownUser';
    }
    //#endregion

    //#region Cleanup
    public dispose(): void
    {
        this.ApiManager.dispose();
    }
    //#endregion
}
