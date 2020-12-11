/* eslint-disable no-case-declarations */
import * as swagger from 'express-oas-generator';
import { Logger } from 'typescript-logging';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AppContext } from './appContext';
import { EventPublisher } from './appServer/eventPublisher';
import { TSLogger } from './logging/tslogger';
import { AppServer } from './appServer/appServer';
import { IDisposable, using } from './framework/using';

interface IWebSocketOnMessage { data: WebSocket.Data; type: string; target: WebSocket; }
interface IWebSocketOnClose { wasClean: boolean; code: number; reason: string; target: WebSocket; }
interface IWebSocketOnError { error: any; message: string; type: string; target: WebSocket; }

export class Program implements IDisposable
{
    private static APPNAME: string = AppContext.AppName;

    public Servers: AppServer[] = [];
    public Environments: string[] = [];
    private noCreateRest: boolean;
    private static websocket: WebSocket.Server;
    private static logger: Logger;
    public PostmanCollectionName: string;

    constructor(args: string[])
    {
        this.processCommandLine(args);

        // If an environment was specified, then see if there is only a single environment. If so, then
        // the AppContext.Env should use that single environment.
        if (this.Environments.length === 1)
        {
            // eslint-disable-next-line prefer-destructuring
            AppContext.Env = this.Environments[0];
        }
        else if (this.Environments.length === 0)
        {
            this.Environments = [undefined];
        }

        // TSLogger is a facade for logging using either log4js or TypescriptLogger
        TSLogger.initialize();
        Program.logger = new TSLogger().createLogger(`${Program.APPNAME}.Program`, []);

        // Catch termination and clean up
        process.on('SIGINT', () =>
        {
            if (this.Servers)
            {
                for (const server of this.Servers)
                {
                    server.dispose();
                }
            }
            Program.logger.info(`${Program.APPNAME} is exiting`);
            process.exit(0);
        });

        for (let i = 0;  i < this.Environments.length;  i++)
        {
            // Create the Rest API, and also, Rest API for some testing
            if (this.noCreateRest)
            {
                continue;
            }

            // Create the app server
            const server = new AppServer({ Environment: this.Environments[i] });
            this.Servers.push(server);

            // Only generate the Swagger docs on the first go-around.
            // The Swagger docs can be accessed through the browser like this:
            //    http://localhost:3000/api-docs/
            if (i === 0)
            {
                swagger.init(server.App, {});
            }

            // Subscribe to the internal 'event bus'
            // eslint-disable-next-line func-names
            server.EventPublisher.on('**', function (values)
            {
                Program.handleEvents(server, this, values);
            });
        }
    }

    public dispose(): void
    {
    }

    private static handleEvents(server: AppServer, eventPublisher: any, values): void
    {
        let eventName: string = eventPublisher.event;
        eventName = eventName.replace(EventPublisher.Prefix, '');
        let logMessage = '';

        switch (eventName)
        {
            // See if a new queue or topic was added dynamically
            case 'Queue.Created':
            case 'Queue.Deleted':
            case 'Queue.Purged':
            case 'Topic.Created':
            case 'Topic.Deleted':
                const objectName: string = values[0];
                logMessage = `${eventName}: ${objectName}, user: ${server.UserName}`;
                Program.websocket.emit(eventPublisher.event, objectName);
                break;

            case 'Resource.Changed':
                const [serviceType, clientName, newMap] = values;
                Program.websocket.emit(eventPublisher.event, serviceType, clientName, newMap);
                break;

            default:
                break;
        }

        // We can write events to an audit log
        if (logMessage.length > 0)
        {
            Program.logger.info(logMessage);
        }
    }

    private processCommandLine(args: string[]): void
    {
        // args[0] is 'node'
        // args[1] is the name of the file tp execute (app.js)
        // args[2] starts the command-line args
        for (let i = 2;  i < args.length;  i++)
        {
            switch (args[i].toLowerCase())
            {
                case 'mock':
                    AppContext.IsMocking = true;
                    break;

                case 'norest':
                    this.noCreateRest = true;
                    break;

                case '-env':
                    // We can run multiple project servers, one for each different environment (test, prod, dev, etc)
                    this.Environments.push(args[++i]);
                    break;

                case '-postman':
                    this.PostmanCollectionName = args[++i];
                    break;

                default:
                    if (Program.logger)
                    {
                        Program.logger.warn(`Unknown command-line argument: [${args[i]}]`);
                    }
                    else
                    {
                       // eslint-disable-next-line no-console
                       console.warn(`Unknown command-line argument: [${args[i]}]`);
                    }
                    break;
            }
        }
    }

    private initWebSocketWS(httpServer: any): void
    {
        if (Program.websocket)
        {
            return;
        }

        // ws://localhost:3053/myproject/ws
        Program.websocket = new WebSocket.Server({ server: httpServer, path: `/${Program.APPNAME}/ws` });
        Program.websocket.on('connection', (socket) =>
        {
            Program.logger.info('A client connected through the socket');
            socket.on('message', (event: WebSocket.Data) =>
            {
                Program.logger.info('A client sent a message to the socket:');
                Program.logger.info(`[${event.toString()}]`);
            });
            socket.on('close', (_event: IWebSocketOnClose) =>
            {
                Program.logger.info('A client disconnected from the socket');
            });
            socket.on('error', (event: IWebSocketOnError) =>
            {
                Program.logger.error(`WebSocket error: ${event.message}`);
            });

            // Here we can put in event handlers for messages that the clients send us...
        });
    }

    public messageLoop(server: AppServer): void
    {
        if (process.send)
        {
            process.send('ready');  // to let pm2 know that the service is ready
        }

        // const httpServer = require('http').Server(server.App);
        const httpServer = new http.Server(server.App);
        const port = server.Configuration.appSettings.serverPort || 3050;
        AppContext.HttpServer = httpServer.listen(port, () =>
        {
            Program.logger.info(`${Program.APPNAME} listening on port ${port}!`);
        });
        this.initWebSocketWS(AppContext.HttpServer);
    }
}

using(new Program(process.argv), (program: Program) =>
{
    for (const server of program.Servers)
    {
        program.messageLoop(server);
    }
});
