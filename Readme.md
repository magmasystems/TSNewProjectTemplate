# Template to Create a Typescript App

## Marc Adler

### magmasystems@gmail.com

---

## Introduction

In the `src` directory, there are two files that should be configured.

1. The `AppContext.ts` file has app-specific properties - namely the `AppName` and `AppNameLower` properties. Change these two properties to the name of your app.
2. The `app.ts` file is the actual main application.

## Loading Services at Runtime

The app server tries to dynamically load in any services that derive from the `ServiceBase` class. Because TypeScript does not support reflection like C# does, we need to explicitly list the names of all service. There are two steps to adding a new service.

1. In the root directory, the `index.ts` file contains the list of all of the services that should be loaded by the ServiceLoader. Add all of the additional services to this file.

``` typescript
export * from './src/services/sampleService';
```

2. The `app.config.json` file contains a list of all service names. If you define additional services, add the new services to this file.

``` json
    "services": [ 
      "SampleService"
    ],
```
