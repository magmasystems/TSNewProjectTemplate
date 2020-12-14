import { Program } from './src/app';
import { using } from './src/framework/using';

using(new Program(process.argv), (program: Program) =>
{
    for (const server of program.Servers)
    {
        program.messageLoop(server);
    }
});
