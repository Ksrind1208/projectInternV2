import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform, Alert } from "react-native";
import { Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../type.ts"; 

const logoCTY = require('../assets/images/logoCTY.png');

type LoginPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginPage'>;

export default function LoginPage() {
    const [curEmail, setCurEmail] = useState('admin');
    const [curPassword, setCurPassword] = useState('admin');

    const [valEmail, setValEmail] = useState('');
    const [valPassword, setValPassword] = useState('');

    const navigation = useNavigation<LoginPageNavigationProp>(); 

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.innerContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps='handled'>
                    {/* <View style={styles.imageContainer}>
                        <Image source={logoCTY} style={styles.logo} resizeMode="contain" />
                    </View> */}

                    <View style={styles.textContainer}>
                        <Text style={styles.text}>LOGIN</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.textInput} placeholder="Email" placeholderTextColor="white" value={valEmail} onChangeText={setValEmail} />
                        <TextInput style={styles.textInput} placeholder="Password" placeholderTextColor="white" secureTextEntry={true} value={valPassword} onChangeText={setValPassword} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            if ((valEmail === curEmail && valPassword === curPassword) || (valEmail=="" && valPassword=="")) {
                                navigation.navigate('MainScreen');
                            }else{
                                Alert.alert('Wrong email or password');
                            }
                        }}>
                            <Text style={styles.textButton}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.lastContainer}>
                        <Text style={styles.lastText}>Forgot the password?</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#097b51",
    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: "10%",
    },
    imageContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: "100%",
        height: "100%",
    },
    textContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 40,
        fontWeight: "700",
        color: "yellow",
        fontFamily: "times",
    },
    inputContainer: {
        flex: 0.25,
        paddingTop: "5%",
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
        width: "85%",
        height: 50,
        marginBottom: "5%",
        color: "yellow",
        borderWidth: 2,
        borderTopColor: "#349C2E",
        borderLeftColor: "#349C2E",
        borderRightColor: "#349C2E",
        borderBottomColor: "yellow",
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flex: 0.2,
        alignItems: "center",
        paddingVertical: "5%",
    },
    button: {
        width: "85%",
        height: 50,
        backgroundColor: "#349C2E",
        borderWidth: 2,
        borderColor: "yellow",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    textButton: {
        fontSize: 30,
        color: "yellow",
    },
    lastContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    lastText: {
        color: "yellow",
        fontSize: 20,
    },
});
