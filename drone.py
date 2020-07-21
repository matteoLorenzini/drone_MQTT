import paho.mqtt.client as mqtt
from argparse import ArgumentParser

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
    parser.add_argument('--port', help='Port of the MQTT broker', default=1883)
    args = parser.parse_args()

    # Connect to the MQTT broker
    client = mqtt.Client()
    client.connect(args.ip, int(args.port), 60)
    
    # Set callback functions
    client.on_connect = on_connect
    client.on_message = on_message

    # Loop function - Change with the code sending sensor data
    client.loop_forever()


if __name__ == '__main__':
    main()