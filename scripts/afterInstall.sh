#!/bin/bash

if [ ! -d "/home/ubuntu/TSNewProjectTemplate" ] 
then
    echo "Directory /home/ubuntu/TSNewProjectTemplate DOES NOT exists." 
    mkdir /home/ubuntu/TSNewProjectTemplate
fi

cd /home/ubuntu/TSNewProjectTemplate

sudo npm install
