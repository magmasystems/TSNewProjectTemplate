export class AppContext
{
    public static IsMocking: boolean;

    public static AppName: string = 'MyProject';
    public static AppNameLower: string = 'myproject';

    public static RestApiPrefix: string = `/${AppContext.AppNameLower}`;

    public static Env: string;

    public static Configuration: any;

    public static HttpServer: any;
}
