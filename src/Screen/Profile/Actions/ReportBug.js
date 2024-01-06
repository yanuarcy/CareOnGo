import React, { useContext, useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import {
  Box,
  Text,
  Input,
  Button,
  Radio,
  InputGroup,
  InputRightAddon,
  Image,
} from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import { useNavigation } from "@react-navigation/core";
import emailjs from "@emailjs/browser";
import AsyncStorage from "@react-native-async-storage/async-storage";


const ReportScreen = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();

  const [UserData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [Service, setService] = useState("Very Comfortable");
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const credentialsData = await AsyncStorage.getItem("credentials");
      const parsedCredentials = JSON.parse(credentialsData);
      setUserData(parsedCredentials);
    }
    fetchUserData();
  }, []);

  const submitFeedback = () => {
    if (!email || !message) {
      Alert.alert("Please fill in all the fields");
    } else {
      console.log("Ini User Data: ", UserData)
      const serviceId = "service_ngo3tdh";
      const templateId = "template_172ubbl";
      const publicKey = "j00igohsXtNjDq6rv";

      const templateParams = {
        header: "Feedback Aplikasi CareOnGo",
        from_name: UserData.namaLengkap,
        from_email: email + "@gmail.com",
        to_name: "CareOnGo Team",
        to_email: "yanuarcahyo567@gmail.com",
        headerText: "Saya sudah mereview aplikasi ini, berikut penilaian saya :",
        service: "Kriteria : " + Service,
        message: message,
      };

      emailjs
        .send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
          console.log("Email sent successfully !", response);
          // console.log(userData);
          Alert.alert("Success", "Email berhasil dikirim");
          navigation.goBack();
        })
        .catch((error) => {
          console.log("Error sending email: ", error);
        });
    }
  };

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

  // console.log("Ini user Data: ", UserData)
  console.log(email + "@gmail.com");
  console.log("Aku menilai :", Service);
  console.log(message);

  return (
    <ScrollView>
      <Box p={4} backgroundColor={activeColors.primary}>
        <Box>
          <Image
            source={require("../../../../assets/images/FeedBack2.png")}
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
            Feedback{"\n"}or Report Bug
          </Text>
        </Box>

        <Text color={activeColors.tint} fontSize="md" p={2}>
          Please let us know your feedback or report a bug. Your input is
          valuable to us!
        </Text>

        <Box p={2}>
          <Text fontWeight="bold" color={activeColors.tint} pb={2}>
            Email
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
              placeholderTextColor={"gray.600"}
              rounded={6}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
            <InputRightAddon children={"@gmail.com"} />
          </InputGroup>
        </Box>

        <Box p={2}>
          <Text fontWeight="bold" color={activeColors.tint} pb={2}>
            Overall, how did you feel about this service?
          </Text>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="Feedback"
            value={Service}
            onChange={(nextValue) => {
              setService(nextValue);
            }}
          >
            <Radio value="Very Comfortable" my={1}>
              <Text color={activeColors.tint}>Very Comfortable</Text>
            </Radio>
            <Radio value="Comfortable" my={1}>
              <Text color={activeColors.tint}>Comfortable</Text>
            </Radio>
            <Radio value="Neutral" my={1}>
              <Text color={activeColors.tint}>Neutral</Text>
            </Radio>
            <Radio value="Uncomfortable" my={1}>
              <Text color={activeColors.tint}>Uncomfortable</Text>
            </Radio>
            <Radio value="Very Uncomfortable" my={1}>
              <Text color={activeColors.tint}>Very Uncomfortable</Text>
            </Radio>
          </Radio.Group>
        </Box>

        <Box p={2}>
          <Text fontWeight="bold" color={activeColors.tint} pb={2}>
            Message
          </Text>
          <Input
            placeholder="Please describe your feedback or report a bug..."
            backgroundColor={"#E4F1FF"}
            value={message}
            onChangeText={(msg) => setMessage(msg)}
            multiline
            numberOfLines={5}
          />
        </Box>

        <TouchableOpacity
          style={{
            marginTop: 30,
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 18,
            backgroundColor: !email || !message ? "gray" : "blue",
            alignSelf: "center",
          }}
          onPress={submitFeedback}
          disabled={!email || !message}
        >
          <Text py={2} px={24} color={"white"}>
            Submit
          </Text>
        </TouchableOpacity>
      </Box>
    </ScrollView>
  );
};

export default ReportScreen;
