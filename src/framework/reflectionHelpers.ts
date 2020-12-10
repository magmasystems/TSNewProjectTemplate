import * as services from '../../index';
import 'reflect-metadata';

export class ReflectionHelpers
{
    public static getSubclassesOf(baseclassName: string): any[]
    {
        const classes = [];

        // tslint:disable-next-line:forin
        for (const element in module.exports)
        {
            const m = module.exports[element];
            if (m.prototype.constructor.name === baseclassName)
            {
                continue;
            }

            let rootName;
            for (let p = m.__proto__;  p.name;  p = p.__proto__)
            {
                rootName = p.name;
            }

            if (rootName === baseclassName)
            {
                classes.push(m);
            }
        }

        return classes;
    }
}
