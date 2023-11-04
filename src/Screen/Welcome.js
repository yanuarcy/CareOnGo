import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Text, Center, HStack, Image } from "native-base";
import { useNavigation } from "@react-navigation/native";


const WelcomeScreen = () => {
	
	const navigation = useNavigation();
	// const { width, height } = Dimensions.get('window');

	const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions(Dimensions.get('window'));
    };

    // Tambahkan event listener untuk memantau perubahan dimensi layar
    Dimensions.addEventListener('change', updateDimensions);

    return () => {
      // Hapus event listener saat komponen unmount
      // Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  return (
    <SafeAreaView>
      <Image
        source={require("../../assets/images/welcome-img.png")}
        alt="Welcome Image"
        // size={64}
        mt={12}
        m={12}
        resizeMode="contain"
				style={{ width: windowDimensions.width * 0.8, height: windowDimensions.height * 0.4 }}
      />
      <Center>
        <Text
					fontWeight="500"
          textAlign="center"
          fontSize={48}
          color="#0082f7"
          mx={4}
        >
          how's your health today?
        </Text>
        <Text
          fontSize={24}
          color="black"
          //   fontFamily="poppins-regular"
          textAlign="center"
          mt={1}
          p={6}
        >
          An ounce of prevention is worth a pound of cure
        </Text>
      </Center>
      <HStack
        space={6}
        alignItems="center"
        justifyContent="center"
        mt={12}
        m={10}
      >
        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          style={{
            backgroundColor: "#0082f7",
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "48%",
            borderRadius: 10,
            shadowColor: "#0082f7",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
						elevation: 8
          }}
        >
          <Text
            // fontFamily="poppins-bold"
            color="white"
            fontSize="xl"
            textAlign="center"
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.replace("Register")}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            width: "48%",
            borderRadius: 4,
          }}
        >
          <Text
            // fontFamily="poppins-bold"
            color="black"
            fontSize="xl"
            textAlign="center"
          >
            Register
          </Text>
        </TouchableOpacity>
      </HStack>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
