import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import Constants from "expo-constants";
import axios from "axios";

import airbnb from "../assets/airbnb-logo.png";

const SignIn = ({ setToken }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (password && username) {
      try {
        const response = await axios.post(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
          {
            username: username,
            password: password,
          }
        );
        const userToken = response.data.token;
        await AsyncStorage.setItem("userToken", userToken);

        navigation.navigate("Home");
        setToken(userToken);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.data) {
          console.log(error.response.data);
        }
        setErrorMessage("Une erreur est survenue");
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        alignItems: "center",
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 20,
      }}
    >
      <Image source={airbnb} style={styles.logo} />
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
      <Pressable style={styles.buttonSign} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("SignUp")}>
        <Text>No account? Register</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  form: {
    width: "80%",
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "pink",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonSign: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "pink",
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "grey",
    textAlign: "center",
    fontSize: 16,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default SignIn;
