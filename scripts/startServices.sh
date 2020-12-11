#!/bin/bash

# Stop all servers and start the server as a daemon
forever stopall
forever start NODE_ENV=local /home/ubuntu/TSNewProjectTemplate/dist/src/app.js
