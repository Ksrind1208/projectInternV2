import Paho from 'paho-mqtt'

let client:any;

export function connectMQTT(onMessageArrived:any) {
  return new Promise((resolve, reject) => {
    client = new Paho.Client(
      //"f41b6c6a5f49462c8c57817532ae5e39.s1.eu.hivemq.cloud",
      "mqtt.eclipseprojects.io/mqtt",
      //Number(8884),
      Number(80),
      `mqtt-async-test-${parseInt((Math.random() * 100).toString())}`
    );
    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT server!");
        client.subscribe("/topic/qos0");
        client.subscribe("gate/status");
        client.subscribe('gate/password');
        client.subscribe('gate/adjustBrightnessGate');
        client.subscribe('livingroom/adjustBrightnessLivingRoom');
        client.subscribe('bedroom/adjustBrightnessBedroom');
        client.subscribe('kitchen/adjustBrightnessKitchen');
        client.subscribe('home/sensor/TemperatureandHumid');
        client.onMessageArrived = onMessageArrived;
        resolve(client);
      },
      onFailure: (errorCode:any) => {
        reject(new Error(`Failed to connect to MQTT server: ${errorCode}`));
      },
      // useSSL: true,
      // userName: "duc123123tc",
      // password: "Duc1282003",
    });
  });
}

export function sendRequesttoGate(string:string) {
  if (client) {
    const message = new Paho.Message(string.toString());
    message.destinationName = "/topic/qos0";
    client.send(message);
  } else {
    console.error("MQTT client not available");
  }
}
export function changPasswordGate(string:string) {
    if (client) {
      const message = new Paho.Message(string.toString());
      message.destinationName = "gate/password";
      client.send(message);
    } else {
      console.error("MQTT client not available");
    }
  }
export function adjustBrightnessGate(string:string) {
if (client) {
    const message = new Paho.Message(string.toString());
    message.destinationName = "gate/adjustBrightnessGate";
    client.send(message);
} else {
    console.error("MQTT client not available");
}
}
export function adjustBrightnessLivingRoom(string:string) {
    if (client) {
        const message = new Paho.Message(string.toString());
        message.destinationName = "livingroom/adjustBrightnessLivingRoom";
        client.send(message);
    } else {
        console.error("MQTT client not available");
    }
}
export function adjustBrightnessBedroom(string:string) {
    if (client) {
        const message = new Paho.Message(string.toString());
        message.destinationName = "bedroom/adjustBrightnessBedroom";
        client.send(message);
    } else {
        console.error("MQTT client not available");
    }
}
export function adjustBrightnessKitchen(string:string) {
    if (client) {
        const message = new Paho.Message(string.toString());
        message.destinationName = "kitchen/adjustBrightnessKitchen";
        client.send(message);
    } else {
        console.error("MQTT client not available");
    }
}
export function TemperatureandHumid(string:string) {
  if (client) {
      const message = new Paho.Message(string.toString());
      message.destinationName = "home/sensor/TemperatureandHumid";
      client.send(message);
  } else {
      console.error("MQTT client not available");
  }
}

