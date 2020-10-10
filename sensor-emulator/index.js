/**
 * emulates a physical sensor by sending periodic data to an MQTT broker, which the client can listen for.
 */

class SensorEmulator {
    mqttStatus = 'Disconnected';
    movementProb = 20;
    mqttClient = null;
    topic = 'swen325/a3';
    clientId = `${Date.now().toString()}_JDKS383HR823`; // this string must be unique to every client

    /**
     * connects to the MQTT broker
     */
    connect() {
        this.mqttStatus = 'Connecting...';

        /**
         * This will generate an error because we have not imported Paho as name
         * using import but this is okay since we have included paho-mqtt.js
         * in the index.html. 
         * The solution to this issue to write an Ionic/angular wrapper to Paho MQTT.
         * Note that current available wrappers have issues with Ionic.
         */
        this.mqttClient = new Paho.MQTT.Client('broker.emqx.io', 8083, '/mqtt', this.clientId);

        // set callback handlers
        this.mqttClient.onConnectionLost = this.onConnectionLost;

        // connect the client
        console.log('Connecting to mqtt via websocket');
        this.mqttClient.connect({ timeout: 10, useSSL: false, onSuccess: this.onConnect, onFailure: this.onFailure });
    }

    /**
   * executes when a connection is established to the MQTT broker
   */
    onConnect = () => {
        console.log('Connected');
        this.mqttStatus = 'Connected';

        // subscribe
        this.mqttClient.subscribe(this.topic);

        // publish the first message to the broker
        this.publishMessage();

        // set an interval to send a message every few seconds
        setInterval(() => {
            this.publishMessage();
        }, 10000);
    }

    /**
   * handles failing to connect to the MQTT broker
   */
    onFailure = (responseObject) => {
        console.log('Failed to connect');
        this.mqttStatus = 'Failed to connect';
    }

    /**
   * handles losing connection to the MQTT broker
   */
    onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log('Connection lost');
            this.mqttStatus = 'Disconnected';
            // attempt to reconnect
            console.log('Reconnecting...')
            this.connect();
        }
    }

    /**
     * sends messages to the broker
     */
    publishMessage() {
        // list of rooms in the senior home
        const rooms = ["Living Room", "Kitchen", "Dining Room", "Toilet", "Bedroom"];
        // the message that will be sent
        const message = [];

        for (const room of rooms) {
            // get the current datetime
            const now = new Date(Date.now()).toISOString();
            // set the probability that a motion has been detected by the room's sensor
            const prob = Math.floor(Math.random() * 100) + 1;
            // assume that the sensor did not detect a motion
            let motion = 0;

            // set the motion to 1 if the probabilty is lower than or equal to the movement probability
            if (prob <= this.movementProb) {
                motion = 1;
            }

            // generate a random battery level for the sensor
            const batteryLevel = Math.floor(Math.random() * 100) + 1;

            // add the current room's data to the message
            message.push({
                room,
                datetime: now,
                motion,
                batteryLevel
            })
        }

        // publish the message to the broker
        this.mqttClient.publish(this.topic, JSON.stringify(message));
    }
}

new SensorEmulator().connect();