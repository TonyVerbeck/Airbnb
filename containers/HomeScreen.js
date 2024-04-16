import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

import { AntDesign } from "@expo/vector-icons";

export default function Home() {
  const navigation = useNavigation();

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
      );
      //   console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      alert("Cannot load");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stars = (rating) => {
    const tabStar = [];
    for (let i = 0; i < rating; i++) {
      tabStar.push(
        <AntDesign key={i} name="star" margin={1} size={20} color="#FFB000" />
      );
    }

    for (let j = rating; j < 5; j++) {
      tabStar.push(<AntDesign key={j} name="star" size={20} color="#BBBBBB" />);
    }

    return tabStar;
  };

  return (
    <View style={styles.container}>
      {isLoading === true ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FF385C" />
        </View>
      ) : (
        <FlatList
          style={{ height: "100%" }}
          data={data}
          keyExtractor={(elem) => elem._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Room", {
                    id: item._id,
                  });
                }}
              >
                <View style={styles.homeBloc}>
                  <Image
                    style={styles.homePicture}
                    source={{ uri: item.photos[0].url }}
                  />
                  <View style={styles.homePrice}>
                    <Text style={styles.price}>{item.price} €</Text>
                  </View>
                  <View style={styles.homeDetail}>
                    <View style={styles.homeDescription}>
                      <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                        key={item.ratingValue}
                      >
                        {stars(item.ratingValue)}
                        <Text style={styles.homeReview}>
                          {item.reviews} avis
                        </Text>
                      </View>
                    </View>
                    <Image
                      style={styles.homeDetailPic}
                      source={{ uri: item.user.account.photo.url }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  loading: {
    justifyContent: "center",
  },
  homeBloc: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  homePicture: {
    height: 230,
  },
  homePrice: {
    backgroundColor: "black",
    width: 80,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 90,
  },
  price: {
    color: "white",
    fontSize: 17,
  },
  homeDetail: {
    paddingTop: 15,
    paddingBottom: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  homeDescription: {
    flex: 4,
  },
  homeReview: {
    color: "#CACACA",
    paddingLeft: 10,
    fontSize: 15,
  },
  homeDetailPic: {
    width: 80,
    height: 70,
    resizeMode: "cover",
    borderRadius: 60,
    flex: 1,
    marginLeft: 8,
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
  },
});
