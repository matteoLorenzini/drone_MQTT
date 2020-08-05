const mqtt = require('mqtt');
const fs = require('fs')
var requestify = require('requestify');



class MqttHandler {

    constructor() {
        this.mqttClient = null;
        this.host = 'http://10.0.0.1:1883';

        this.info_track_weather = [] // List of dictionaries {'position': kml, 'weather': json_weatherbit.io}
        this.json_log = [];
        
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
        this.mqttClient.subscribe('sensor/gps', {
            qos: 0
        }); // Subscribe to drone GPS position

        // When a message arrives, console.log it
        this.mqttClient.on('message', function(topic, message) {


            this.json_log.push((topic + ": " + message.toString()));

            console.log(this.json_log.length)

           

            
            /*

            if (topic == 'sensor/gps') {
                // Call to json_weatherbit.io
                // this.info_track_weather.push({'position': tokml(message), 'weather': w})
                /*
                requestify.get('https://api.weatherbit.io/v2.0/current?city=Trento,TN&key=245ea69ec9a14549ae68a8c0371e5eb4').then(function(response) {
                  var weather_log =[];
                  var weather_json = JSON.parse(response.body)
                  weather_log.push((weather_json.data[0].temp));
                  console.log(weather_log)

                })
                

                const fs = require('fs');

                // create a JSON object
                const sensor_drone = {
                    json_log
                };

                // convert JSON object to string
                const data = JSON.stringify(sensor_drone);

                // write JSON string to a file
                fs.writeFile('user.json', data, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("JSON data is saved.");
                });

            }
            */
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
