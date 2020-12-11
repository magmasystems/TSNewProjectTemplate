import * as chai from 'chai';
import { UnitTestHelpers } from './unitTestHelpers';

const { expect } = chai;

export class SampleServiceRestHelpers
{
    public static async count(port: number): Promise<number>
    {
        const url = `http://localhost:${port}/sample/count`;
        const response = await UnitTestHelpers.sendHttpGet(url);

        // eslint-disable-next-line no-unused-expressions
        expect(response).to.be.not.null;
        const { count } = JSON.parse(response);

        return count;
    }
}
