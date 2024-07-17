import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Switch,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import { sendRequesttoGate } from '../server/mqttService';

interface Alarm {
  id: string;
  hour: number;
  minute: number;
  status: string;
  active: boolean;
}

const dummyArray: Alarm[] = [
  { id: '0', hour: 10, minute: 20, status: "ON", active: true },
  { id: '1', hour: 11, minute: 30, status: "OFF", active: true },
  { id: '2', hour: 12, minute: 45, status: "ON", active: false },
  { id: '3', hour: 13, minute: 50, status: "OFF", active: true },
];

const STORAGE_KEY = '@alarms';
const CHANNEL_ID = 'alarm_channel';

export default function SetUp() {
  const [listAlarms, setListAlarms] = useState<Alarm[]>(dummyArray);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("ON");
  const alarmsRef = useRef<Alarm[]>(listAlarms);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAlarms();
    setupPushNotification();
    scheduleNextCheck();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    saveAlarms();
    alarmsRef.current = listAlarms; // Update the ref to the latest alarms list
  }, [listAlarms]);

  const loadAlarms = async () => {
    try {
      const savedAlarms = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedAlarms !== null) {
        setListAlarms(JSON.parse(savedAlarms));
      }
    } catch (error) {
      console.error('Failed to load alarms.', error);
    }
  };

  const saveAlarms = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listAlarms));
    } catch (error) {
      console.error('Failed to save alarms.', error);
    }
  };

  const setupPushNotification = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });

   
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID, 
        channelName: 'Alarm Channel', 
        channelDescription: 'A channel to categorize alarm notifications', 
        soundName: 'default', 
        importance: 4, 
        vibrate: true, 
      },
      (created) => console.log(`createChannel returned '${created}'`) 
    );
  };

  const scheduleNextCheck = () => {
    const now = new Date();
    const currentSecond = now.getSeconds();
    const msUntilNextMinute = (60 - currentSecond) * 1000;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      checkAlarms();
      scheduleNextCheck(); // Schedule the next check after this one
    }, msUntilNextMinute);
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    alarmsRef.current.forEach((alarm) => {
      if (alarm.active && alarm.hour === currentHour && alarm.minute === currentMinute) {
        sendNotification(alarm);
        sendRequesttoGate(alarm.status); // Call the function when the alarm is triggered
      }
    });
  };

  const sendNotification = (alarm: Alarm) => {
    PushNotification.localNotification({
      channelId: CHANNEL_ID, // Specify the channel ID here
      title: "Alarm Triggered",
      message: `Time: ${alarm.hour}:${alarm.minute} - Status: ${alarm.status}`,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
    });
  };

  const openPicker = (alarm: Alarm | null) => {
    if (alarm) {
      setSelectedAlarm(alarm);
      setSelectedHour(alarm.hour);
      setSelectedMinute(alarm.minute);
      setSelectedStatus(alarm.status);
    } else {
      setSelectedAlarm(null);
      setSelectedHour(0);
      setSelectedMinute(0);
      setSelectedStatus("ON");
    }
    setModalVisible(true);
  };

  const savePicker = () => {
    if (selectedAlarm) {
      const updatedAlarms = listAlarms.map((alarm) => {
        if (alarm.id === selectedAlarm.id) {
          return {
            ...alarm,
            hour: selectedHour,
            minute: selectedMinute,
            status: selectedStatus,
          };
        }
        return alarm;
      });
      setListAlarms(updatedAlarms);
    } else {
      const newAlarm: Alarm = {
        id: (listAlarms.length + 1).toString(),
        hour: selectedHour,
        minute: selectedMinute,
        status: selectedStatus,
        active: true,
      };
      setListAlarms([...listAlarms, newAlarm]);
    }
    setModalVisible(false);
  };

  const itemView = ({ item }: { item: Alarm }) => (
    <View style={styles.item}>
      <View style={styles.timeContainer}>
        <TouchableOpacity
          style={{ flex: 1, justifyContent: "center" }}
          onPress={() => openPicker(item)}
        >
          <Text style={styles.textTime}>
            {item.hour}:{item.minute} - {item.status}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <Switch
          value={item.active}
          onValueChange={(value) => {
            const updatedAlarms = listAlarms.map((alarm) => {
              if (alarm.id === item.id) {
                return { ...alarm, active: value };
              }
              return alarm;
            });
            setListAlarms(updatedAlarms);
          }}
          thumbColor={item.active?"lightgreen":"red"}
          trackColor={{false:"grey", true:"grey"}}
          style={{
            flex: 1,
          }}
        />
      </View>

      <View style={styles.deleteContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            const updatedAlarms = listAlarms.filter(alarm => alarm.id !== item.id);
            for(var i=0;i<updatedAlarms.length;i++){
              updatedAlarms[i].id=i.toString();
            }
            setListAlarms(updatedAlarms);
          }}
        >
          <Text style={styles.textDelete}>DELETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listAlarms}
        renderItem={itemView}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openPicker(null)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Alarm</Text>

            <Text>Hour</Text>
            <Picker
              selectedValue={selectedHour}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
              style={styles.picker}
            >
              {[...Array(24).keys()].map((hour) => (
                <Picker.Item key={hour} label={`${hour}`} value={hour} />
              ))}
            </Picker>

            <Text>Minute</Text>
            <Picker
              selectedValue={selectedMinute}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
              style={styles.picker}
            >
              {[...Array(60).keys()].map((minute) => (
                <Picker.Item key={minute} label={`${minute}`} value={minute} />
              ))}
            </Picker>

            <Text>Status</Text>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="ON" value="ON" />
              <Picker.Item label="OFF" value="OFF" />
            </Picker>

            <TouchableOpacity style={styles.saveButton} onPress={savePicker}>
              <Text style={styles.saveButtonText}>SAVE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#097b51",
  },
  item: {
    flexDirection: "row",
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').height * 0.1,
    borderColor: "yellow",
    borderWidth: 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeContainer: {
    flex: 0.7,
    paddingLeft: 15,
  },
  textTime: {
    fontSize: 20,
    color: "white",
  },
  switchContainer: {
    flex: 0.1,
  },
  deleteContainer: {
    flex: 0.2,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#990000",
    borderRadius: 10,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textDelete: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#097b51",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: "center",
    width: '100%',
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#990000",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    width: '100%',
  },
  cancelButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: "lightgreen",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});
