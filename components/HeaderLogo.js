import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HeaderIcon = () => {
  const navigation = useNavigation();

  return (
    <FontAwesome5
      name="airbnb"
      size={32}
      color="#FF385C"
      onPress={() => {
        navigation.navigate("Home");
      }}
    />
  );
};

export default HeaderIcon;

const styles = StyleSheet.create({});
