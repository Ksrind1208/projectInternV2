import React from "react";
import { useEffect,useState,createContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./screens/loginPage.tsx";
import MainScreen from "./screens/mainScreen.tsx";
import { RootStackParamList } from "./type.ts"; 
import SetUp from "./screens/setUp.tsx";
import { connectMQTT } from "./server/mqttService.tsx";

const Stack = createNativeStackNavigator<RootStackParamList>(); 
export const MQTTContext = createContext("");

export default function App() {

    const [temp_humid_all,setTemp_Humid_all]=useState("");
    const [flag_all,setFlag_all]=useState(0);
    useEffect(() => {
        const initializeMQTT = async () => {
          try {
            const client = await connectMQTT((message:any) => {
              if (message.destinationName == "home/sensor/TemperatureandHumid") {
                const data = message.payloadString;
                setTemp_Humid_all(data);
              }
            });
          } catch (error) {
            console.error("Failed to connect to MQTT:", error);
          }
        };
    
        initializeMQTT();
      },[]);


    return (
        <MQTTContext.Provider value={temp_humid_all}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginPage">
                    <Stack.Screen
                        name="LoginPage"
                        component={LoginPage}
                        options={{
                            title: "WELCOME",
                            headerStyle: { backgroundColor: "black" },
                            headerTintColor: "yellow",
                            headerTitleStyle: { fontWeight: "bold", fontSize: 24 }
                        }}
                    />
                    <Stack.Screen
                        name="MainScreen"
                        component={MainScreen}
                        options={{
                            title: "Main screen",
                            headerStyle: { backgroundColor: "black" },
                            headerTintColor: "yellow",
                            headerTitleStyle: { fontWeight: "bold", fontSize: 24 }
                        }}
                    />
                    <Stack.Screen
                        name="SetUp"
                        component={SetUp}
                        options={{
                            title: "Set up alarm",
                            headerStyle: { backgroundColor: "black" },
                            headerTintColor: "yellow",
                            headerTitleStyle: { fontWeight: "bold", fontSize: 24 }
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </MQTTContext.Provider>
    );
}
