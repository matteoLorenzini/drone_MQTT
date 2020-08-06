import paho.mqtt.client as mqtt

from argparse import ArgumentParser
from datetime import datetime
from random import uniform
from time import sleep
from json import dumps

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

def main():
    # Parse arguments
    parser = ArgumentParser(description="Drone script. Connect to the MQTT broker and send position and sensor data")
    parser.add_argument('--ip', help='IP of the MQTT broker' ,required=True)
    parser.add_argument('--port', help='Port of the MQTT broker', type=int, default=1883)
    parser.add_argument('--freq', help='Update frequency, in microseconds', type=int, default=15000)
    parser.add_argument('--it', help='Number of iterations', type=int, default=100)
    parser.add_argument('--lon', help='Starting longitude', type=float, default=0.0)
    parser.add_argument('--lat', help='Starting latitude', type=float, default=0.0)
    parser.add_argument('--debug', help="Debug mode. Print extra informations", action='store_true')
    args = parser.parse_args()

    ''' ------------------------------------------------------------------------------------
    Connect to the MQTT broker
    '''
    # Try connection
    client = mqtt.Client()
    client.connect(args.ip, args.port, 60)
    
    # Set callback functions
    client.on_connect = on_connect
    client.on_message = on_message

    # Loop function to make the client listen in the background
    client.loop_start()

    ''' -------------------------------------------------------------------------------------
    Main simulation loop
    '''
    prev_longitude, prev_latitude = args.lon, args.lat
    for n in range(0, args.it):
        start_t = datetime.now()
        
        # Simulate GPS: get new longitude and latitude and publish them (kml format) 
        longitude, latitude = prev_longitude + uniform(-1,1), prev_latitude + uniform(-1,1)
        coordinates = [longitude, latitude]
        client.publish("sensor/gps", dumps({'type': 'Point', 'coordinates': coordinates}))
        if args.debug:
            print('GPS position emitted: ({}, ({}, {}))'.format(n, longitude, latitude))

        prev_longitude = longitude
        prev_latitude = latitude

        end_t = datetime.now()

        # Sleep if elapsed time bigger than the target frequency
        elapsed = (end_t - start_t).microseconds
        if elapsed < args.freq:
            sleep((args.freq - elapsed) / float(1e6))                               # Convert microseconds to seconds

    # Stop client listening loop
    client.loop_stop()
    client.disconnect()


if __name__ == '__main__':
    main()