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

const ReportScreen = () => {

  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [value, setValue] = React.useState("one");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("bug");
  const [message, setMessage] = useState("");

  const submitFeedback = () => {
    if (!email || !message) {
      Alert.alert("Please fill in all the fields");
    } else {
      const feedbackTypeText =
        feedbackType === "bug" ? "Bug Report" : "Feedback";
      Alert.alert(`Thank you for your ${feedbackTypeText}!`);
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
      <Box p={4}>
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

        <Text color="gray.600" fontSize="md" p={2}>
          Please let us know your feedback or report a bug. Your input is
          valuable to us!
        </Text>

        <Box p={2}>
          <Text fontWeight="bold" color="gray.600" pb={2}>
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
          <Text fontWeight="bold" color="gray.600" pb={2}>
            Overall, how did you feel about this service?
          </Text>
          <Radio.Group
            name="myRadioGroup"
            accessibilityLabel="Feedback"
            value={value}
            onChange={(nextValue) => {
              setValue(nextValue);
            }}
          >
            <Radio value="one" my={1}>
              Very Comfortable
            </Radio>
            <Radio value="two" my={1}>
              Comfortable
            </Radio>
            <Radio value="three" my={1}>
              Neutral
            </Radio>
            <Radio value="four" my={1}>
              Uncomfortable
            </Radio>
            <Radio value="five" my={1}>
              Very Uncomfortable
            </Radio>
          </Radio.Group>
        </Box>

        <Box p={2}>
          <Text fontWeight="bold" color="gray.600" pb={2}>
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
          <Text py={2} px={24} color={"white"}>Submit</Text>
        </TouchableOpacity>
      </Box>
    </ScrollView>
  );
};

export default ReportScreen;