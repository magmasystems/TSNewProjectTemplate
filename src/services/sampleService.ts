import express = require('express');
import { nextTick } from 'process';
import { ServiceBase } from '../serviceBase';
import { IServiceCreationArgs } from './serviceCreationArgs';

/**
 * SampleService
 *
 * This is an example of a service that is derived from ServiceBase. It just supports one API call, which returns a
 * current count and increments the count.
 */
export class SampleService extends ServiceBase
{
    private count: number;

    /**
     * The constructor simple changes the name that the service is known by.
     * @param args : contains the service creation arguments
     */
    constructor(args: IServiceCreationArgs)
    {
        args.Name = 'SampleService';

        super(args);

        this.count = 0;
    }

    /**
     *
     * @param router : This is the Express router. We add all of our routes to this router.
     *
     * In this case, we isolate the entity name, and append "/count" to it. For example, if the service
     * name is UserService, then the entity name will be "user".
     */
    public createApi(router: express.Router): void
    {
        super.createApi(router);

        const entity = this.Name.endsWith('Service') ? this.Name.replace('Service', '') : this.Name;

        // This can be called through the browser like this:
        //     http://localhost:3000/myproject/sample/count
        router.route(`/${entity.toLowerCase()}/count`).get((_req, resp, next) =>
        {
            try
            {
                this.Logger.info(`Got a count request for the service: Name ${this.Name}`);
                resp.json({ count: ++this.count });

                next();
            }
            catch (exc)
            {
                next(exc);
            }
        });
    }
}
