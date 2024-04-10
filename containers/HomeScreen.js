import { useNavigation } from "@react-navigation/core";
import { Button, Text, View } from "react-native";

const Home = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Welcome home!</Text>
    </View>
  );
};

export default Home;
