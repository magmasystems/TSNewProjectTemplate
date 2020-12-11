import { IAppApiManager } from './appApiManager';

export interface IAppServerSettings
{
    /**
     * Environment - optional environment string (dev, prod, qa).
     * This is used by the Configuration Manager to find the proper config file to use.
     *
     * @type {string}
     * @memberof IAppServerSettings
     */
    Environment?: string;

    /**
     * ApiManager - the ApiManager that spawned off the MyProject Services
     *
     * @type {IAppApiManager}
     * @memberof IAppServerSettings
     */
    ApiManager?: IAppApiManager;

    /**
     * Configuration - we can pass in the Json of a config
     *
     * @type {*}
     * @memberof IAppServerSettings
     */
    Configuration?: any;

    /**
     *
     * @type {*}
     * @memberof IAppServerSettings
     */
    Properties?: {};
}

export class AppServerSettings implements IAppServerSettings
{
    public Environment?: string;
    public ApiManager?: IAppApiManager;
    public Configuration?: any;
    public Properties?: any;

    constructor(env?: string)
    {
        if (env)
        {
            this.Environment = env;
        }

        this.Properties = {};
    }
}
