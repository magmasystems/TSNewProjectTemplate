/* eslint-disable no-template-curly-in-string */
import * as Knex from 'knex';
import * as mockKnex from 'mock-knex';
import * as os from 'os';
import { Model } from 'objection';
import { AppContext } from '../appContext';
import { ConfigurationManager } from '../appServer/configurationManager';
import { IAppServerSettings } from '../appServer/appServerSettings';

export class DatabaseConfiguration
{
    public static db: Knex;

    public static Initialize(settings?: IAppServerSettings): void
    {
        const dbconfig = new ConfigurationManager(settings).Configuration.appSettings.database;
        const currentUserName = os.userInfo().username;

        const dbUser = dbconfig.DB_USER.replace('${user}', currentUserName);
        const dbName = dbconfig.DB_NAME.replace('${user}', currentUserName);

        const knexConfig: Knex.Config = {
            client: dbconfig.DB_TYPE,
            connection:
            {
                charset: 'utf8',
                database: dbName,
                host: dbconfig.DB_HOST,
                password: dbconfig.DB_PASSWORD,
                user: dbUser,
            },
        };

        const k = Knex(knexConfig);

        if (AppContext.IsMocking)
        {
            mockKnex.mock(k);
        }

        DatabaseConfiguration.db = Model.knex(k);
    }
}
