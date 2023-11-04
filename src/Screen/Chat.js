import { useContext } from "react";
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
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const Messages = [
  {
    id: "1",
    userName: "Jenny Doe",
    userImg: require("../../assets/Chat/user-3.jpg"),
    messageTime: "4 mins ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    userImg: require("../../assets/Chat/user-1.jpg"),
    messageTime: "2 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "3",
    userName: "Ken William",
    userImg: require("../../assets/Chat/user-4.jpg"),
    messageTime: "1 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    userImg: require("../../assets/Chat/user-6.jpg"),
    messageTime: "1 day ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: require("../../assets/Chat/user-7.jpg"),
    messageTime: "2 days ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
];

const PesanScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();

  return (
    <Box flex={1}>
      <Box flex={1} pl={5} pr={5} backgroundColor={activeColors.primary}>
        <Center>
          <FlatList
            data={Messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() =>
                  navigation.navigate("RoomChat", { userName: item.userName })
                }
              >
                <Box justifyContent={"space-between"}>
                  <Flex direction="row">
                    <Box pt={4} pb={4}>
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
                      borderBottomWidth={"1"}
                      borderBottomColor={"#cccccc"}
                    >
                      <Flex direction="column">
                        <Box mb={"1"}>
                          <Flex direction="row">
                            <HStack space={32}>
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
  );
};

export default PesanScreen;
