#!/bin/bash

echo "Building docker image for the drone"
docker build -t drone --file ./Dockerfile.drone .

echo "Pulling docker image for the MQTT broker"
docker pull eclipse-mosquitto:latest

echo "Building docker image for the webserver"
docker build -t webserver --file ./Dockerfile.webserver .