const mqtt = require('mqtt');
var requestify = require('requestify');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'http://10.0.0.1:1883';

    this.info_track_weather = []        // List of dictionaries {'position': kml, 'weather': json_weatherbit.io}
  }
  
  connect() {
    
    this.mqttClient = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('sensor/gps', {qos: 0});        // Subscribe to drone GPS position

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log(topic + ": " + message.toString());
      
      if (topic == 'sensor/gps') {
        // Call to json_weatherbit.io 
        
        // this.info_track_weather.push({'position': tokml(message), 'weather': w})
      }
    });

    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish('mytopic', message);
  }
}

module.exports = MqttHandler;