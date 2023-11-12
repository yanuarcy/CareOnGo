import { useContext, useState } from "react";
import {
  Box,
  ScrollView,
  Text,
  Center,
  Button,
  FlatList,
  Flex,
  Image,
  HStack,
  Input,
  Icon,
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useNavigation } from "@react-navigation/native";
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Messages = [
  {
    id: "1",
    userName: "Jenny Doe",
    userImg: require("../../assets/Chat/Doctor-1.jpg"),
    messageTime: "3:41",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    messageTime: "0:48",
    messageText:
      "The doctor's reassuring words were a soothing balm, easing the patient's worries with each gentle explanation.",
  },
  {
    id: "3",
    userName: "Ken William",
    userImg: require("../../assets/Chat/Doctor-2.png"),
    messageTime: "21:42",
    messageText:
      "As the doctor discussed treatment options, a sense of hope painted the patient's outlook with a newfound sense of possibilities.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    userImg: require("../../assets/Chat/Doctor-5.jpg"),
    messageTime: "18:37",
    messageText:
      "Within the quiet confines of the clinic, the doctor's guidance flowed like a refreshing stream of knowledge, providing comfort to the patient..",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: require("../../assets/Chat/Doctor-4.jpg"),
    messageTime: "18:02",
    messageText:
      "Sitting in the doctor's office, the patient found solace in the expert's advice, as it lit a path toward better health and well-being.",
  },
];

const PesanScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();

  const [pencarian, setPencarian] = useState("");

	const filterChatByName = (userName) => {
    return Messages.filter((chat) =>
      chat.userName.toLowerCase().includes(userName.toLowerCase())
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Box flex={1}>
        <Box flex={1} pl={5} pr={5} backgroundColor={activeColors.primary}>
          <Center>
            <Box>
              <HStack alignItems="center" space={2} p={2} rounded="md">
                <Input
                  value={pencarian}
                  onChangeText={(pencarian) => setPencarian(pencarian)}
                  placeholder="Search.."
                  color={activeColors.tint}
                  placeholderTextColor={activeColors.tint}
                  size="sm"
                  w={"87%"}
                  rounded={24}
                />
                <TouchableOpacity>
                  <Box backgroundColor={"#0082f7"} p={2} rounded={12}>
                    <Icon
                      as={Ionicons}
                      name="search"
                      size={6}
                      color={"white"}
                    />
                  </Box>
                </TouchableOpacity>
              </HStack>
            </Box>
            <FlatList
              data={filterChatByName(pencarian)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={() =>
                    navigation.navigate("RoomChat", {
                      userName: item.userName,
                      messageText: item.messageText,
                      userImg: item.userImg,
                    })
                  }
                >
                  <Box justifyContent={"space-between"}>
                    <Flex direction="row">
                      <Box pt={4} pb={2}>
                        <Image
                          w={"60"}
                          h={"60"}
                          rounded={"35"}
                          source={item.userImg}
                          alt="ProfileUserChat"
                        />
                      </Box>

                      <Box
                        justifyContent={"center"}
                        p={"15"}
                        pl={0}
                        ml={"3"}
                        w={"300"}
                        // borderBottomWidth={"1"}
                        // borderBottomColor={"#cccccc"}
                      >
                        <Flex direction="column">
                          <Box mb={"1"}>
                            <Flex direction="row">
                              <HStack space={40}>
                                <Text
                                  fontSize={"14"}
                                  fontWeight={"bold"}
                                  color={activeColors.tint}
                                >
                                  {item.userName}
                                </Text>
                                <Box ml={-5}>
                                  <Text fontSize={12} color={activeColors.tint}>
                                    {item.messageTime}
                                  </Text>
                                </Box>
                              </HStack>
                            </Flex>
                          </Box>
                          {/* <Text fontSize={"14"} mr={10} color={activeColors.tertiary}>
                          {item.messageText}
                        </Text> */}
                          <Text fontSize={"14"} color={activeColors.tertiary}>
                            {item.messageText.length > 40
                              ? item.messageText.slice(0, 40) + "..."
                              : item.messageText}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                </TouchableOpacity>
              )}
            />
          </Center>
        </Box>
        {/* </ScrollView> */}
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default PesanScreen;
