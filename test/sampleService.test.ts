/* eslint-disable no-undef */
import * as assert from 'assert';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as http from 'http';
import 'mocha';
import { AppContext } from '../src/appContext';
import { TSLogger } from '../src/logging/tslogger';
import { AppServer } from '../src/appServer/appServer';
import { UnitTestHelpers } from './helpers/unitTestHelpers';
import { SampleServiceRestHelpers } from './helpers/sampleServiceRestHelpers';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('SampleService', () =>
{
    TSLogger.initialize();
    const logger: TSLogger = new TSLogger().createLogger(`${AppContext.AppName}.Program.Test`, []);

    UnitTestHelpers.initialize();
    UnitTestHelpers.processCommandLine();

    const server = new AppServer({ Environment: AppContext.Env });
    assert.notStrictEqual(server, null);

    const badService = server.ApiManager.GetService('NonexistentService');
    assert.strictEqual(badService, null);

    const sampleService = server.ApiManager.GetService('SampleService');
    assert.notStrictEqual(sampleService, null);

    let httpServer: http.Server;
    const port = server.Configuration.appSettings.serverPort || 3050;

    // eslint-disable-next-line global-require
    // const knexTracker: any = require('mock-knex').getTracker();

    describe('SampleService API Test', () =>
    {
        before(() =>
        {
            // https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
            // For some strange reason, using mocha, if we listen to the port, then we will get a EADDRINUSE exception
            try
            {
                httpServer = http.createServer(server.App);
                httpServer.listen(port, () =>
                {
                    logger.info(`SampleServiceTests listening on port ${port}!`);
                });
            }
            catch (exc)
            {
                // eslint-disable-next-line no-console
                console.error(`SampleServiceTests.listen(): ${exc.message}`);
            }

            // SampleTestHelpers.enableDbMocking(knexTracker);
        });

        after(() =>
        {
            // Close the HTTP server
            if (httpServer)
            {
                httpServer.close(() =>
                {
                    logger.info(`SampleServiceTests: httpServer closing port ${port}!`);
                });
            }

            server.dispose();
            // SampleTestHelpers.disableDbMocking(knexTracker);
        });

        beforeEach(() =>
        {
            if (AppContext.IsMocking)
            {
                // knexTracker.reset();
            }
        });

        it('Should get a non-zero count', async () =>
        {
            // Now fetch the current count. It should return at least 1 user.
            const count = await SampleServiceRestHelpers.count(port);
            expect(count).to.be.eq(1);

            server.dispose();
        });
    });
});
