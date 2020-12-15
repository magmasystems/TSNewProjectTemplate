# Template to Create a Typescript App

## Marc Adler

### magmasystems@gmail.com

---

## Introduction

This is an attempt to create the template of a NodeJS application that you can clone and use as the basis of any TypeScript/Node application. It support the definition and loading of "services".

A "service" is a class that derived from `ServiceBase`. It has a name, a logger, an event publisher, and a global API Manager. The API Manager manages all interactions with the Express web server.

## The APIManager

As mentioned above, the shared APIManager manages all interactions with Express. It maintains a map of all services. At startup, it loads all of the services and calls their `createApi()` method in order to let each service define their routes.

The APIManager contains an event publisher that is based on `EventEmitter2`. Your app can use this to send messages between the various services by calling the `emit()` method. The name of the event channel is {AppName}RestApi. Each service will have its own event publisher too, each with a different channel name.

The APIManager sets up Swagger so that the APIs are documented. You can view the Swagger docs by going to <http://host:port/api-docs>.

## Defining New Services

In the `src` directory, there are two files that should be configured.

1. The `AppContext.ts` file has app-specific properties - namely the `AppName` and `AppNameLower` properties. Change these two properties to the name of your app.
2. The `app.ts` file is the actual main application.

The constructor of the service should specify the name of the service.

``` typescript
    constructor(args: IServiceCreationArgs)
    {
        args.Name = 'SampleService';

        super(args);

        // more ....
    }
```

Each service can override the `createApi()` method. This gives the service a change to register their own APIs and routes.

``` typescript
    public createApi(router: express.Router): void
    {
        super.createApi(router);

        // Define your own routes here using router.route()
```

## Loading Services at Runtime

The app server tries to dynamically load in any services that derive from the `ServiceBase` class. Because TypeScript does not support reflection like C# does, we need to explicitly list the names of all service. There are two steps to adding a new service.

1. In the root directory, the `services.ts` file contains the list of all of the services that should be loaded by the ServiceLoader. Add all of the additional services to this file.

``` typescript
export * from './src/services/sampleService';
```

2. The `app.config.json` file contains a list of all service names and optional properties. If you define additional services, add the new services to this file.

``` json
    "services": [{ 
      "name": "SampleService",
      "properties": {
        "prop1": "foo",
        "prop2": "baz",
        "prop3": 
        { 
          "prop3.1": "Hello",
          "prop3.2": "Sample",
          "prop3.3": "Service"
        }
      }
    }],
```

## Architecture

Each separate "environment" has the following class hierarchy.

| Hierarchy        |           |            |                                          |
|------------------|-----------|------------|------------------------------------------|
| Environment      |           |            |                                          |
|                  | AppServer |            |                                          |
|                  |           | ApiManager |                                          |
|                  |           |            | EventPublisher                           |
|                  |           |            | Configuration _(appsettings.{env}.json)_ |
|                  |           |            | Express web server                       |
|                  |           |            | Logger                                   |
|                  |           |            | Map of Services (name, ServiceBase)      |

## Enhancements Needed

1. The ApiManager has one single Express server. The web servers should be associated with each services, so that each services can run on its own port.
