import { AppContext } from '../../src/appContext';
import { TSLogger } from '../../src/logging/tslogger';

export class UnitTestHelpers
{
    private static logger: TSLogger;
    private static httpClient: any;

    public static initialize()
    {
        AppContext.Env = 'local';
        UnitTestHelpers.logger = new TSLogger().createLogger(`${AppContext.AppName}.UnitTestHelpers`, []);
        // eslint-disable-next-line global-require
        UnitTestHelpers.httpClient = require('http');
    }

    public static processCommandLine(): void
    {
        let environment: string = 'local';
        for (let i = 0;  i < process.argv.length;  i++)
        {
            const arg = process.argv[i].toLowerCase();
            switch (arg)
            {
                case '-env':
                    environment = process.argv[++i];
                    break;

                case 'mock':
                    AppContext.IsMocking = true;
                    break;

                default:
                    break;
            }
        }
        AppContext.Env = environment;
    }

    public static sendHttpPost(url: string, body: any)
    {
        return this.sendHttpPostOrPut(url, body, 'POST');
    }

    public static sendHttpPut(url: string, body: any)
    {
        return this.sendHttpPostOrPut(url, body, 'PUT');
    }

    private static sendHttpPostOrPut(url: string, body: any, verb: string)
    {
        const options = {
            headers: { 'Content-Type': 'application/json' },
            method: verb,
        };

        return new Promise<any>((resolve, reject) =>
        {
            try
            {
                const req = UnitTestHelpers.httpClient.request(url, options, (res) =>
                {
                    let response: string = '';
                    res.on('data', (chunk: string) =>
                    {
                        response += chunk;
                    });
                    res.on('end', () =>
                    {
                        resolve(response);
                    });
                });

                req.write(JSON.stringify(body));
                req.end();
            }
            catch (exc)
            {
                UnitTestHelpers.logger.error(exc);
                reject(exc);
            }
        });
    }

    public static sendHttpGet(url: string)
    {
        const options = {
            headers: { },
            method: 'GET',
        };

        return new Promise<any>((resolve, reject) =>
        {
            try
            {
                const req = UnitTestHelpers.httpClient.request(url, options, (res) =>
                {
                    let response: string = '';
                    res.on('data', (chunk: string) =>
                    {
                        response += chunk;
                    });
                    res.on('end', () =>
                    {
                        resolve(response);
                    });
                });

                req.end();
            }
            catch (exc)
            {
                UnitTestHelpers.logger.error(exc);
                reject(exc);
            }
        });
    }

    public static sendHttpDelete(url: string)
    {
        const options = {
            headers: { },
            method: 'DELETE',
        };

        return new Promise<any>((resolve, reject) =>
        {
            try
            {
                const req = UnitTestHelpers.httpClient.request(url, options, (res) =>
                {
                    let response: string = '';
                    res.on('data', (chunk: string) =>
                    {
                        response += chunk;
                    });
                    res.on('end', () =>
                    {
                        resolve(response);
                    });
                });

                req.end();
            }
            catch (exc)
            {
                UnitTestHelpers.logger.error(exc);
                reject(exc);
            }
        });
    }
}
