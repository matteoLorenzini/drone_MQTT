# Realizing an IoT scenario #

## Short Introduction ##
During a drone survey  factors as the wind speed or the air temperature are impacting in the final result.
These factors can be detected and monitored continuously by using specific sensors.
The goal of this project is to simulate a real time data transfer system able to read and visualize the data from three sensors: GPS position, to track the position of the drone on a certain 2D space, the wind speed to have a real time overview about the flight conditions and the temperature to monitor the operating temperature range.

```text
h1: MQTT broker (Eclipse Mosquitto)                     10.0.0.1:1883        
    - Manages the communication between h2 and h3

h2: Webserver (Node js)                                 10.0.0.2:3000        
    - Collects the drone position and weather information
    - Publishes them in HTML 
    - Generates the .kml file of the trajectory

h3: Drone (Python3)                                     10.0.0.3
    - Simulates and publish the GPS trajectory

h4: Client (Curl/Wget)                                 10.0.0.4 
    - Visualises the output of the webserver (h2)       
```
```text
h1  --10Mbps--  s1  --10Mbps--  s2  --10Mbps--  h2
                    --10Mbps--  s3  --10Mbps--  h3  
                    --10Mbps--  s4  --10Mbps--  h4
```

## How to run ##
1. Start mininet and docker containers:
    ```bash
    sudo python3 topology.py
    ```
2. From h4 (Xterm) use the links web browser to see the drone trajectory: 
    ```bash
    links 10.0.0.2:3000/drone
    ```
    or to download in .kml format:
    ```bash
    wget 10.0.0.2:3000/kml
    ```