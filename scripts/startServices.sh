#!/bin/bash

export NODE_ENV=local

# Stop all servers and start the server as a daemon
forever stopall
forever start -c node /home/ubuntu/TSNewProjectTemplate/dist/src/app.js mock
