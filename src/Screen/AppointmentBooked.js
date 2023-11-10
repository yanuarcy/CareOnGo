import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Text, Center, HStack, Image } from "native-base";
import { useNavigation } from "@react-navigation/native";

const AppointmentBookedScreen = () => {
  const navigation = useNavigation();
  // const { width, height } = Dimensions.get('window');

  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions(Dimensions.get("window"));
    };

    // Tambahkan event listener untuk memantau perubahan dimensi layar
    Dimensions.addEventListener("change", updateDimensions);

    return () => {
      // Hapus event listener saat komponen unmount
      // Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  return (
    <SafeAreaView>
      <Image
        source={require("../../assets/images/BookedAnimation.png")}
        alt="Welcome Image"
        mt={12}
        m={12}
        resizeMode="contain"
        style={{
          width: windowDimensions.width * 0.8,
          height: windowDimensions.height * 0.3,
        }}
      />
      <Center>
        <Text
          fontSize={16}
          color="#0082f7"
          //   fontFamily="poppins-regular"
          textAlign="center"
          mt={1}
          px={8}
        >
          Your Appointment has been Booked Successfully !!
        </Text>
        <Text
          fontSize={16}
          color="black"
          //   fontFamily="poppins-regular"
          textAlign="center"
          //   mt={1}
          px={4}
        >
          Check my appointments tab for all your upcoming appointments
        </Text>
      </Center>
      <Box flexDirection={'row'} justifyContent={'center'} mt={32}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Appointment")}
          style={{
            backgroundColor: "#0082f7",
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "85%",
            borderRadius: 10,
            shadowColor: "#0082f7",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 8,
          }}
        >
          <Text
            // fontFamily="poppins-bold"
            color="white"
            fontSize="xl"
            textAlign="center"
          >
            My Appointments
          </Text>
        </TouchableOpacity>
      </Box>
    </SafeAreaView>
  );
};

export default AppointmentBookedScreen;
