import * as fs from 'fs';
import * as path from 'path';

export class FileHelpers
{
    public static ProbeDirectories(filename: string, callback?): string
    {
        let f = filename;
        while (!fs.existsSync(f))
        {
            f = path.join('..', f);
            const norm = path.resolve(f);
            if (path.dirname(norm) === path.sep)
            {
                return null;
            }
        }

        if (callback && fs.existsSync(f))
        {
            callback(f);
        }
        return f;
    }
}
