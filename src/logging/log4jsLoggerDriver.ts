/* eslint-disable no-console */
import * as log4js from 'log4js';
import { AppContext } from '../appContext';
import { ILoggingSettings, ITSLogDriver, TSLogLevel } from './tslogger';

export class Log4jsLoggerDriver implements ITSLogDriver
{
    private static defaultLogger: log4js.Logger;
    private logger: log4js.Logger;

    // eslint-disable-next-line class-methods-use-this
    public initialize(loggingSettings: ILoggingSettings): void
    {
        let log2jsLevel = log4js.levels.INFO;

        switch (loggingSettings.level.toLowerCase())
        {
            case 'debug':
                log2jsLevel = log4js.levels.DEBUG;
                break;
            case 'warn':
                log2jsLevel = log4js.levels.WARN;
                break;
            case 'error':
                log2jsLevel = log4js.levels.ERROR;
                break;
            default:
                break;
        }

        try
        {
            log4js.configure(
            {
                appenders:
                {
                    Console:
                    {
                        levels: log2jsLevel,
                        type: 'console',
                    },
                    File:
                    {
                        filename: `./logs/${AppContext.AppName}.log`,
                        levels: log2jsLevel,
                        type: 'file',
                    },
                },
                categories:
                {
                    default:
                    {
                        appenders: ['File', 'Console'],
                        level: log2jsLevel.toString(),
                    },
                },
            },
            );
        }
        catch (exc)
        {
            console.error(exc.message);
        }
    }

    public createLogger(loggerName: string, loggingSettings?: any, params?: []): any
    {
        try
        {
            this.logger = log4js.getLogger(loggerName);
        }
        catch (exc)
        {
            console.log(exc.message);
            this.logger = Log4jsLoggerDriver.defaultLogger;
        }
        return this.logger;
    }

    public log(msg: string, logLevel: TSLogLevel): void
    {
        switch (logLevel)
        {
            case TSLogLevel.Error:
                this.logger.error(msg);
                break;
            case TSLogLevel.Warn:
                this.logger.warn(msg);
                break;
            case TSLogLevel.Info:
                this.logger.info(msg);
                break;
            case TSLogLevel.Debug:
                this.logger.debug(msg);
                break;
            default:
                this.logger.info(msg);
                break;
        }
    }
}
