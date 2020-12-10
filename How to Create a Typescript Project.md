# How to Create a TypeScript Project in VSCode

This describes how we create a new TypeScript project using Visual Studio Code.

## First Steps

``` shell
mkdir MyProject
cd MyProject
git init
npm init
```

You should now have a single file called `package.json` in the MyProject directory

Bring the directory into a new VSCode workspace

Create two empty directories called `src` and `tests`. Our source code will go into the `src` directory.

There are a few config files that we need to copy to the main directory

* .eslintignore
* .eslintrc.json
* .gitignore
* .npmignore
* jsconfig.json
* tsconfig.json
* tslint.json

We also need to create the `.vscode` directory and create the `tasks.json` and `launch.json` files.

----------------

## Set Up Git

Now we are going to create a project on the Azure DevOps site and push the new project to the new Git repo.

In Azure DevOps, create a new project called `MyProject`. Choose `Git` and `Scrum` from the advanced options.
Now we want to push our little bit of existing code to Azure DevOps.

It's always good to create a personal access token for Azure DevOps. Go into the Azure DevOps site,
click on your account, then click on Security. From there, create a new personal access token. Marc's token is t3ckwrnir2o2sfi6vmx7y53rafgsnoh4h7cbvqyylpzsp47e77da

Now, when VSCode prompts you for your user id, you can use `<accessToken>@mycompany.com`

First, go into the Source Control panel in VSCode, enter in a commit message (like 'Initial Commit'), and do a `Commit All`.

Then we have to associate the remote Azure DevOps repository with the local project. In a Terminal, run the following command:

``` shell
git remote add origin https://storytwo.visualstudio.com/MyProject/_git/MyProject
```

Then, go back to the Source Control panel in VSCode, and do a `Push`. To make sure that the code was really pushed
to Azure DevOps, log into the new MyProject project as check the repo.

----------------

## Customizing the VSCode IDE

There are some settings that you can set in VSCode to make your life easier.

If you do not want to see the `*.js` and the `*.js.map` files that the Typescript compiler generates, find the
`files.exclude` setting and add the following two patterns

``` json
"**/*.js": {"when": "$(basename).ts"}
"**/*.js.map": {"when": "$(basename).ts"}
```

----------------

## Create a basic empty server in the code

We have to customize the `package.json` file to include all of the dependencies that we need. The initial version is:

``` json
{
  "name": "myproject",
  "version": "0.1.0",
  "description": "Typescript version of MyProject server",
  "main": "index.js",
  "typings": "./dist/typings",
  "scripts": {
    "test": "mocha tests/**/*.test.ts",
    "lint": "./node_modules/.bin/eslint src",
    "patch": "npm version patch",
    "publish": "npm publish",
    "unpublish": "npm unpublish myproject --force"
  },
  "author": "Marc Adler <marc.adler@ctoasaservice.org>",
  "license": "ISC",
  "keywords": [
     "MyProject"
  ],
  "repository": {
    "type": "git",
    "url": "https://mycompany.visualstudio.com/MyProject/_git/MyProject"
  },
  "publishConfig": {
  },
  "dependencies": {
    "@types/aws-sdk": "^2.7.0",
    "@types/express": "^4.0.39",
    "@types/node": "^8.0.53",
    "@types/socket.io": "^1.4.31",
    "@types/x-ray": "^2.3.1",
    "aws-sdk": "^2.340.0",
    "cryptr": "^2.0.0",
    "eventemitter2": "^5.0.0",
    "express": "^4.16.2",
    "express-oas-generator": "^0.1.6",
    "pug": "^2.0.3",
    "method-override": "^2.3.9",
    "proxy-agent": "^3.0.3",
    "serve-favicon": "^2.4.4",
    "socket.io": "^2.0.4",
    "stylus": "^0.54.5",
    "uuid": "^3.1.0",
    "x-ray": "^2.3.3"
  },
  "devDependencies": {
    "@types/chai": "^4.0.6",
    "@types/mocha": "^2.2.44",
    "aws-sdk-mock": "^1.7.0",
    "chai": "^4.1.1",
    "eslint": "^4.12.0",
    "eslint-config-airbnb-base": "^11.3.2",
    "eslint-plugin-import": "^2.8.0",
    "mocha": "^5.2.0"
  }
}
```

In order to get all of the proper modules downloaded, go into the terminal and run the command:

``` shell
npm install
```

There might be some warnings from the installation process. You can view any potential problems by running

``` shell
npm audit
```

and you can automatically try to fix the problems by running

``` shell
npm audit fix
```

After everything has been installed, you should see a new directory called `node_modules` that has all of the loaded modules.
