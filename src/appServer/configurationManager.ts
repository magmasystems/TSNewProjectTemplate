/* eslint-disable no-param-reassign */
import { exception } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import { AppContext } from '../appContext';
import { FileHelpers } from '../framework/fileHelpers';
import { IAppServerSettings } from './appServerSettings';

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

        let jsonConfig;

        if (settings && settings.Configuration)
        {
            // The actual Json config was passed into the settings.
            jsonConfig = settings.Configuration;
        }
        else
        {
            configFileName = configFileName || 'app.config.{env}json';
            configFileName = configFileName.replace('{env}', env ? `${env}.` : '');

            // Try marching up the directory tree to find the proper appsettings file
            let foundConfigFileName = FileHelpers.ProbeDirectories(configFileName);
            if (!foundConfigFileName)
            {
                foundConfigFileName = FileHelpers.ProbeDirectories('app.config.json');
                if (!foundConfigFileName)
                {
                    throw new Error('No configuration file found');
                }
            }

            // Try to read the environment-specific config file first
            jsonConfig = fs.readFileSync(foundConfigFileName, 'utf8');
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
