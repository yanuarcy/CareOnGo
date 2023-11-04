import React, { useEffect, useState } from "react";
import {
  Text,
  Pressable,
  Input,
  Box,
  Center,
  Image,
  Icon,
  ScrollView,
	KeyboardAvoidingView,
} from "native-base";
import {
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// import SvgIcon from '../common/assets/images/SvgIcon';

const ForgotPasswordScreen = ({ navigation }) => {
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
    <KeyboardAvoidingView behavior="position" h={{ base: "800" }}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Box flex={1} backgroundColor="#fff">
            <Box>
              <Center>
                <Box>
                  <Image
                    source={require("../../../../assets/images/forgot.png")}
                    alt="Welcome Image"
                    resizeMode="contain"
                    style={{
                      width: windowDimensions.width * 1,
                      height: windowDimensions.height * 0.4,
                    }}
                  />
                </Box>
                <Box paddingHorizontal={20} mt={-6}>
                  <Box mb={14}>
                    <Text color="#000" fontWeight={900} fontSize={40}>
                      Forgot Password?
                    </Text>
                  </Box>
                  <Box mb>
                    <Text color="#000">
                      Don't worry! It happens, please enter the address
                      associated with your account
                    </Text>
                  </Box>
                  <Box mt={6}>
                    <Input
                      w={{
                        base: "95%",
                        md: "25%",
                      }}
                      InputLeftElement={
                        <Icon
                          as={Ionicons}
                          name="at-outline"
                          size={7}
                          ml="2"
                          color="black"
                        />
                      }
                      placeholder="Email"
                      placeholderTextColor={"black"}
                      backgroundColor={"#E4F1FF"}
                      borderWidth={0}
                      rounded={6}
                      fontSize={16}
                    />
                  </Box>
                  <Box marginTop={16} mb={16}>
                    <TouchableOpacity
                      style={{
                        width: "95%",
                        backgroundColor: "#0082f7",
                        borderRadius: 12,
                      }}
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text
                        textAlign="center"
                        fontSize={16}
                        // fontFamily="NotoSansBlack"
                        color="#fff"
                        py={3}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Center>
            </Box>
          </Box>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;