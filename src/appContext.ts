export class AppContext
{
    public static IsMocking: boolean;

    public static AppName: string = 'MyProject';
    public static AppNameLower: string = `${AppContext.AppName.toLowerCase()}`;
    public static RestApiPrefix: string = `/${AppContext.AppNameLower}`;

    public static Env: string;

    public static Configuration: any;

    public static HttpServer: any;

    public static SetAppName(appname: string): void
    {
        AppContext.AppName = appname;
        AppContext.AppNameLower = appname.toLowerCase();
        AppContext.RestApiPrefix = `/${AppContext.AppNameLower}`;
    }
}
