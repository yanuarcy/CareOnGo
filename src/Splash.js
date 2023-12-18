import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = () => {
  const navigation = useNavigation();
  //   setTimeout(() => {
  //     navigate("Tabs");
  //   }, 3000);

  const checkCredentials = async () => {
    try {
      const credentials = await AsyncStorage.getItem("credentials");
      if (credentials !== null) {
        // Data credentials ditemukan
        const parsedCredentials = JSON.parse(credentials);
        // Lakukan pengecekan apakah waktu login masih valid (30 menit)
        const loginTime = parsedCredentials.loginTime || 0;
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - loginTime) / (1000 * 60); // dalam menit

        const timeRemaining = 10 - elapsedTime;
        if (elapsedTime <= 10) {

            console.log("Sisa Waktu anda : ", timeRemaining, "Sekarang sudah' : ", elapsedTime)
          // Masih dalam waktu login yang valid, arahkan ke halaman Home/Tabs
          navigation.replace("Tabs");
        } else {
          // Waktu login telah berakhir, hapus data credentials
          await AsyncStorage.removeItem("credentials");
          console.log("Session Time Expired")
          // Redirect ke halaman Welcome
          navigation.replace("Welcome");
        }
      } else {
        // Data credentials tidak ditemukan, arahkan ke halaman Welcome
        navigation.replace("Welcome");
      }
    } catch (error) {
      console.error("Error checking credentials:", error);
      // Redirect ke halaman Welcome pada kasus error
      navigation.replace("Welcome");
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        style={{
          width: 150,
          height: 170,
        }}
        source={require("../assets/Splash.json")}
        autoPlay
        loop={false}
        speed={0.8}
        onAnimationFinish={() => {
          //   navigation.replace("Tabs");
          setTimeout(() => {
            // navigate("Tabs");
            checkCredentials();
          }, 2000);
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
