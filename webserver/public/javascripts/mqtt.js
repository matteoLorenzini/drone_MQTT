const mqtt = require('mqtt');
var requestify = require('requestify');
var XMLBuilder = require('xmlbuilder');

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'http://10.0.0.1:1883';
        
        this.drone_gps_json = [];           // [{'type': string, 'coordinates': [float]}]

        this.info_track_weather = [] // List of dictionaries {'position': kml, 'weather': json_weatherbit.io}
        
    }

    connect() {
        // Connect to the mqtt server
        this.mqttClient = mqtt.connect(this.host);

        // Set callbacks
        this.mqttClient.on('error', (err) => {                      // Error callback
            console.log(err);
            this.mqttClient.end();
        });
        this.mqttClient.on('connect', () => {                       // Connection callback
            console.log(`mqtt client connected`);
        });
        this.mqttClient.on('close', () => {                         // Close connection callback
            console.log(`mqtt client disconnected`);
        });    
        this.mqttClient.on('message', (topic, message) => {         // Message callback
            if (topic == 'sensor/gps') {
                this.drone_gps_json.push(JSON.parse(message))
            }
        });
               
        // mqtt subscriptions
        this.mqttClient.subscribe('sensor/gps', {                   // Subscribe to drone position 
            qos: 0
        }); 
    }

    // Sends a mqtt message
    sendMessage(topic, message) {
        this.mqttClient.publish(topic, message);
    }

    // Generate KML document
    generateKML() {
        let root = XMLBuilder.create('kml');
        root.att('xmlns', "http://www.opengis.net/kml/2.2");
        
        this.drone_gps_json.forEach(function(item, index) {
            console.log(index);
            let placemark = root.ele("Placemark");
            placemark.ele("name", index);

            let point = placemark.ele("Point");
            point.ele("coordinates", item['coordinates'][0] + "," + item['coordinates'][1] + ",0");
        });
        
        return root.end({pretty: true});
    }
}

module.exports = MqttHandler;
