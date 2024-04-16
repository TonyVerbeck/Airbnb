import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function Profile({ userToken, setTokenAndId, userId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);
  const [isPictureModified, setIsPictureModified] = useState(false);
  const [isInfosModified, setIsInfosModified] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    try {
      // console.log(userToken);
      // console.log(userId);
      const { data } = await axios.get(
        `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );
      setUsername(data.username);
      setEmail(data.email);
      setDescription(data.description);

      if (data.photo) {
        setPicture(data.photo.url);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // update informations
  const editInformations = async () => {
    if (isPictureModified || isInfosModified) {
      setIsLoading(true);

      if (isInfosModified) {
        try {
          const { data } = await axios.put(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update`,
            { email, username, description },
            {
              headers: {
                Authorization: "Bearer " + userToken,
              },
            }
          );

          if (data) {
            setUsername(data.username);
            setEmail(data.email);
            setDescription(data.description);
            setMessage("Your profile has been updated");
          } else {
            setMessage("An error occurred");
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (isPictureModified) {
        try {
          const tab = picture.split(".");
          const formData = new FormData();
          formData.append("photo", {
            uri: picture,
            name: `my-pic.${tab[tab.length - 1]}`,
            type: `image/${tab[tab.length - 1]}`,
          });

          const { data } = await axios.put(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture`,
            formData,
            {
              headers: {
                Authorization: "Bearer " + userToken,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (data) {
            setPicture(data.photo?.url);
            setMessage("Your photo has been updated");
          }
        } catch (error) {
          console.log(error);
        }
      }

      isPictureModified && setIsPictureModified(false);
      isInfosModified && setIsInfosModified(false);

      setIsLoading(false);
    } else {
      setMessage("Change at least one information");
    }
  };

  const uploadPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        setPicture(result.assets[0].uri);

        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setMessage(false);
  };

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        setPicture(result.assets[0].uri);

        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setMessage(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        {isLoading === true ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF385C" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.profileDescription}>
              <View style={styles.topView}>
                <Pressable style={styles.pictureView}>
                  {picture ? (
                    <Image
                      source={{ uri: picture }}
                      style={styles.picture}
                      resizeMode="cover"
                    />
                  ) : (
                    <FontAwesome5 name="user-alt" size={100} color="#E7E7E7" />
                  )}
                </Pressable>
                <View style={styles.icons}>
                  <Pressable
                    onPress={() => {
                      uploadPicture();
                    }}
                  >
                    <MaterialIcons
                      name="photo-library"
                      size={30}
                      color="grey"
                    />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => {
                      takePicture();
                    }}
                  >
                    <FontAwesome5 name="camera" size={30} color="grey" />
                  </Pressable>
                </View>
              </View>
              <TextInput
                value={email}
                style={[styles.marginBigBottom, styles.h2, styles.signinput]}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setEmail(text);
                  setIsInfosModified(true);
                }}
              />
              <TextInput
                value={username}
                style={[styles.marginBigBottom, styles.h2, styles.signinput]}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setUsername(text);
                  setIsInfosModified(true);
                }}
              />
              <TextInput
                onChangeText={(text) => {
                  setDescription(text);
                  setIsInfosModified(true);
                }}
                value={description}
                multiline={true}
                numberOfLines={20}
                style={[
                  styles.marginBigBottom,
                  styles.h2,
                  styles.signinputDescription,
                ]}
              />

              <View style={styles.view}>
                {message && <Text style={styles.message}>{message}</Text>}
              </View>

              <View style={styles.button}>
                <Pressable
                  style={styles.buttonTitle}
                  title="Update"
                  onPress={() => {
                    editInformations();
                  }}
                >
                  <Text style={styles.buttonTitle}>Update</Text>
                </Pressable>
              </View>
              <View style={styles.button}>
                <Pressable
                  style={styles.buttonTitle}
                  title="Log out"
                  onPress={() => {
                    setTokenAndId(null);
                  }}
                >
                  <Text style={styles.buttonTitle}>Log Out</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
  },
  h2: {
    fontSize: 18,
  },
  marginBottom: { marginBottom: 10 },
  marginBigBottom: {
    marginBottom: 20,
  },
  profileDescription: {
    marginTop: 40,
    marginBottom: 15,
  },
  signinputDescription: {
    borderWidth: 1,
    borderBottomColor: "lightpink",
    borderTopColor: "lightpink",
    borderLeftColor: "lightpink",
    borderRightColor: "lightpink",
    fontSize: 18,
    height: 100,
    textAlignVertical: "top",
    padding: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  signinput: {
    borderWidth: 1,
    borderBottomColor: "lightpink",
    borderTopColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    fontSize: 18,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonTitle: {
    fontSize: 18,
    color: "#828282",
  },
  button: {
    borderColor: "#FF385C",
    borderRadius: 205,
    borderWidth: 3,
    width: 200,
    height: 60,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 100,
    marginTop: 20,
  },
  picture: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
  pictureView: {
    marginVertical: 20,
    width: 170,
    height: 170,
    borderRadius: 170,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#FFC3C8",
    borderWidth: 2,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  icons: {
    marginLeft: 20,
  },
  iconButton: {
    marginTop: 40,
  },
  view: {
    height: 30,
  },
  message: {
    color: "#FF385C",
    textAlign: "center",
  },
});
