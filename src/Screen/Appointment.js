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
  Icon,
  InputGroup,
  Input,
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useNavigation } from "@react-navigation/native";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Header from "../component/Header";


const Data = [
  {
    id: "1",
    userName: "John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    specialty: "Cardiologist",
    patients: "1.08K",
    exp: "10 years",
    reviews: "200+",
    date: "11 Jan 2020 - 13:00 pm",
  },
  {
    id: "2",
    userName: "Ken William",
    userImg: require("../../assets/Chat/Doctor-2.png"),
    specialty: "Pediatrician",
    patients: "1.08K",
    exp: "12 years",
    reviews: "200+",
    date: "11 Jan 2020 - 15:00 pm",
  },
  {
    id: "3",
    userName: "Sellina Paul",
    userImg: require("../../assets/Chat/Doctor-5.jpg"),
    specialty: "Neurologist",
    patients: "1.08K",
    exp: "8 years",
    reviews: "200+",
    date: "13 Jan 2020 - 15:00 pm",
  },
  {
    id: "4",
    userName: "Jenny Doe",
    userImg: require("../../assets/Chat/Doctor-1.jpg"),
    specialty: "Gastroenterologist",
    patients: "1.08K",
    exp: "14 years",
    reviews: "200+",
    date: "14 Jan 2020 - 17:00 pm",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: require("../../assets/Chat/Doctor-4.jpg"),
    specialty: "Gynecologist",
    patients: "1.08K",
    exp: "12 years",
    reviews: "200+",
    date: "15 Jan 2020 - 14:00 pm",
  },
];

const AppointmentScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [pencarian, setPencarian] = useState("");

  const navigation = useNavigation();

  return (
    <ScrollView>
      <Box flex={1}>
        <Box flex={1} pl={5} pr={5} backgroundColor={activeColors.primary}>
          <Center>
            <Box mt={4}>
              <FlatList
                data={Data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={{ width: "100%" }}>
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
                                  <HStack>
                                    <Text
                                      fontSize={"14"}
                                      fontWeight={"bold"}
                                      color={activeColors.tint}
                                    >
                                      {item.userName}
                                    </Text>
                                  </HStack>
                                  <HStack alignItems="center">
                                    {item.star}
                                    <Text>{item.text}</Text> 
                                  </HStack>
                                </HStack>
                              </Flex>
                            </Box>
                            <Text
                              fontSize={"14"}
                              mr={10}
                              color={activeColors.tertiary}
                            >
                              {item.specialty}
                            </Text>
                            <HStack space={16}>
                              <Text
                                fontSize={"14"}
                                mr={10}
                                color={activeColors.tertiary}
                              >
                               <Text fontWeight="bold">{item.date}</Text>
                              </Text>
                            </HStack>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  </TouchableOpacity>
                )}
              />
            </Box>
          </Center>
        </Box>
        {/* </ScrollView> */}
      </Box>
    </ScrollView>
  );
};

export default AppointmentScreen;