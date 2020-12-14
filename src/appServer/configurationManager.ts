/* eslint-disable no-param-reassign */
import * as fs from 'fs';
import * as path from 'path';
import { AppContext } from '../appContext';
import { IAppServerSettings } from './appServerSettings';
import * as main from '../../main';

/**
 * ConfigurationManager
 *
 * @export
 * @class ConfigurationManager
 */
export class ConfigurationManager
{
    /**
     * Configuration
     *
     * @type {*}
     * @memberof ConfigurationManager
     */
    public Configuration: any;

    constructor(settings?: IAppServerSettings, configFileName?: string)
    {
        const env: string = settings && settings.Environment ? settings.Environment : AppContext.Env;

        // Get the directory that main.js is being run from. Since this is usually /dist, go up two levels to find the appsettings file.
        const mainDirectory = `${path.dirname(require.main.filename)}/..`;

        configFileName = configFileName || `${mainDirectory}/app.config.{env}json`;
        configFileName = configFileName.replace('{env}', env ? `${env}.` : '');

        let jsonConfig;

        if (settings && settings.Configuration)
        {
            // The actual Json config was passed into the settings.
            jsonConfig = settings.Configuration;
        }
        else
        {
            try
            {
                // Try to read the environment-specific config file first
                jsonConfig = fs.readFileSync(configFileName, 'utf8');
            }
            catch
            {
                // If the env-specific config file doesn't exist, try to read the general config file
                jsonConfig = fs.readFileSync(`${mainDirectory}/app.config.json`, 'utf8');
            }
        }

        // If there is no config file, then an exception will be thrown
        this.Configuration = JSON.parse(jsonConfig);
        AppContext.Configuration = this.Configuration;

        if (this.Configuration.appSettings.applicationName)
        {
            AppContext.SetAppName(this.Configuration.appSettings.applicationName);
        }
    }
}
