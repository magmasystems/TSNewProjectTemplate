import { LFService, Logger, LoggerFactory, LoggerFactoryOptions, LogGroupRule, LogLevel } from 'typescript-logging';
import { AppContext } from '../appContext';
import { ILoggingSettings, ITSLogDriver, TSLogLevel } from './tslogger';

export class TypescriptLoggerDriver implements ITSLogDriver
{
    private static factory: LoggerFactory;
    private static defaultLogger: Logger;
    private logger: Logger;
    private static PROJECT_NAME = AppContext.AppName;

    public initialize(loggingSettings: ILoggingSettings): void
    {
        const options = new LoggerFactoryOptions();
        options.addLogGroupRule(new LogGroupRule(new RegExp(`${TypescriptLoggerDriver.PROJECT_NAME}.+`), LogLevel.Info));
        TypescriptLoggerDriver.factory = LFService.createNamedLoggerFactory(TypescriptLoggerDriver.PROJECT_NAME, options);
        TypescriptLoggerDriver.defaultLogger = TypescriptLoggerDriver.factory.getLogger(`${TypescriptLoggerDriver.PROJECT_NAME}.default`);
    }

    public createLogger(loggerName: string, loggingSettings: ILoggingSettings, params?: []): any
    {
        try
        {
            if (!loggerName.startsWith(`${TypescriptLoggerDriver.PROJECT_NAME}.`))
            {
                loggerName = `${TypescriptLoggerDriver.PROJECT_NAME}.${loggerName}`;
            }

            this.logger = TypescriptLoggerDriver.factory.getLogger(loggerName);
        }
        catch (exc)
        {
            // eslint-disable-next-line no-console
            console.log(exc.message);
            this.logger = TypescriptLoggerDriver.defaultLogger;
        }

        return this.logger;
    }

    public log(msg: string, logLevel: TSLogLevel = TSLogLevel.Info): void
    {
        switch (logLevel)
        {
            case TSLogLevel.Error:
                this.logger.error(msg);
                break;
            case TSLogLevel.Warn:
                this.logger.warn(msg);
                break;
            default:
                this.logger.info(msg);
                break;
        }
    }
}
