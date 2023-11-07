import React, { useContext, useEffect, useState } from "react";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
// import Checkbox from "expo-checkbox";
import {
  Box,
  Text,
  Input,
  Button,
  ScrollView,
  Checkbox,
  Image,
  Stack,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";

const ContactScreen = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const submit = () => {
    if (!name && !email && !phone && !message) {
      Alert.alert("Plzz fill all the fields");
    } else {
      Alert.alert(`Thank You ${name}`);
      navigation.goBack();
    }
  };

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
    <ScrollView>
      <Box height="100%" p="5" backgroundColor={activeColors.primary}>
        <Box>
          <Image
            source={require("../../../../assets/images/81732-contact-us-unscreen.gif")}
            alt="Welcome Image"
            resizeMode="contain"
            style={{
              width: windowDimensions.width * 1.4,
              height: windowDimensions.height * 0.4,
            }}
          />
        </Box>
        <Box p={2} flexDirection="row" alignItems="center">
          <Text
            color={activeColors.tint}
            fontWeight={700}
            fontSize={40}
            alignSelf="flex-start"
          >
            Level Up{"\n"}Your Knowledge
          </Text>
        </Box>
        <Text fontSize="20" p={2} color={activeColors.tint}>
          You can reach us anytime via CareOnGo@gmail.com
        </Text>

        <Box py={2} px={2}>
          <Text fontWeight="bold" color={activeColors.tint}>
            Enter your name
          </Text>
          <Input
            placeholder="Mathew"
            backgroundColor={"#E4F1FF"}
            placeholderTextColor={"muted"}
            rounded={6}
            value={name}
            onChangeText={(userdata) => setName(userdata)}
          />
        </Box>
        <Box py={2} px={2}>
          <Text fontWeight="bold" color={activeColors.tint}>
            Enter your Email
          </Text>
          <InputGroup
            w={{
              base: "80%",
              md: "285",
            }}
            justifyContent="center"
            backgroundColor={"#E4F1FF"}
            rounded={6}
            ml={8}
          >
            <Input
              w={{
                base: "86%",
                md: "100%",
              }}
              placeholder="CareOnGo"
              backgroundColor={"#E4F1FF"}
              placeholderTextColor={"muted"}
              rounded={6}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <InputRightAddon children={"@gmail.com"} />
          </InputGroup>
        </Box>
        <Box py={2} px={2}>
          <Text fontWeight="bold" color={activeColors.tint}>
            Enter your Phone
          </Text>
          <InputGroup
            w={{
              base: "100%",
              md: "285",
            }}
            justifyContent="center"
            backgroundColor={"#E4F1FF"}
            rounded={6}
            // ml={4}
          >
            <InputLeftAddon children={"+62"} />
            <Input
              w={{
                base: "87%",
                md: "100%",
              }}
              placeholder="nativebase"
              placeholderTextColor={"muted"}
            />
            {/* <InputRightAddon children={".io"} /> */}
          </InputGroup>
        </Box>
        <Box py={2} px={2}>
          <Text fontWeight="bold" color={activeColors.tint}>
            How can we help you?
          </Text>
          <Input
            placeholder="Tell us about yourself"
            backgroundColor={"#E4F1FF"}
            placeholderTextColor={"muted"}
            rounded={6}
            value={message}
            onChangeText={(msg) => setMessage(msg)}
            multiline
            numberOfLines={5}
          />
        </Box>
        <Box flexDirection="row" alignItems="center" mt={7} px={2}>
          <Checkbox
            isChecked={agree}
            colorScheme="blue"
            onChange={() => setAgree(!agree)}
            aria-label="Agree to the terms and conditions"
          />
          <Text ml="2" color={activeColors.tint}>Agree to the terms and conditions</Text>
        </Box>
        <TouchableOpacity
          style={{
            marginTop: 30,
            borderRadius: 5,
            paddingVertical: "10",
            paddingHorizontal: "18",
            alignSelf: "center",
            backgroundColor: agree ? "#0082f7" : "gray",
          }}
          disabled={!agree}
          onPress={submit}
        >
          <Text py={4} px={24} color="white">
            Contact Us
          </Text>
        </TouchableOpacity>
      </Box>
    </ScrollView>
  );
};

export default ContactScreen;
