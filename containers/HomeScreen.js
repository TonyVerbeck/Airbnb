import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import axios from "axios";

const Home = ({ setToken }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
      );

      setData(response.data);
      const userToken = response.data.token;
      await AsyncStorage.getItem("userToken", userToken);

      setToken(userToken);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <View>
      <FlatList
        ListEmptyComponent={() => <Text>Nothing to show</Text>}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>
                {item.title} - {item.price}€ - {item.ratingValue}
              </Text>

              <Image
                key={item.photos.picture_id}
                source={{ uri: item.url }}
                style={{ width: 200, height: 200 }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Home;
