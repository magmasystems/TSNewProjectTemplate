#!/bin/bash

export NODE_ENV=local

# Stop all servers and start the server as a daemon
forever stopall
forever start --minUptime 1000 --spinSleepTime 1000 -c node /home/ubuntu/TSNewProjectTemplate/dist/main.js mock
