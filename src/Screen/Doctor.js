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
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Header from "../component/Header";

const Data = [
  {
    id: "1",
    userName: "John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    rating: (
      <>
        <FontAwesome name="star" color="orange" size={12} />
        <Text>4.5</Text>
      </>
    ),
    specialty: "Cardiologist",
    exp: "10 years",
  },
  {
    id: "2",
    userName: "Ken William",
    userImg: require("../../assets/Chat/Doctor-2.png"),
    rating: (
      <>
        <FontAwesome name="star" color="orange" size={12} />
        <Text>4.6</Text>
      </>
    ),
    specialty: "Pediatrician",
    exp: "12 years",
  },
  {
    id: "3",
    userName: "Sellina Paul",
    userImg: require("../../assets/Chat/Doctor-5.jpg"),
    rating: (
      <>
        <FontAwesome name="star" color="orange" size={12} />
        <Text>4.9</Text>
      </>
    ),
    specialty: "Neurologist",
    exp: "8 years",
  },
  {
    id: "4",
    userName: "Jenny Doe",
    userImg: require("../../assets/Chat/Doctor-1.jpg"),
    rating: (
      <>
        <FontAwesome name="star" color="orange" size={12} />
        <Text>5</Text>
      </>
    ),
    specialty: "Gastroenterologist",
    exp: "14 years",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: require("../../assets/Chat/Doctor-4.jpg"),
    rating: (
      <>
        <FontAwesome name="star" color="orange" size={12} />
        <Text>4.8</Text>
      </>
    ),
    specialty: "Gynecologist",
    exp: "12 years",
  },
];

const DoctorScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [pencarian, setPencarian] = useState("");

  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
      <Box flex={1}>
        <Box flex={1} pl={5} pr={5} backgroundColor={activeColors.primary}>
          <Center>
            <Box mt={40}>
              <HStack alignItems="center" space={2} p={2} rounded="md">
                <Input
                  placeholder="Search Specialist"
                  color={activeColors.tint}
                  placeholderTextColor={activeColors.tint}
                  size="lg"
                  w={"87%"}
                  rounded={12}
                />
                <Box backgroundColor={"#0082f7"} p={2} rounded={6}>
                  <Icon as={Ionicons} name="search" size={6} color={"white"} />
                </Box>
              </HStack>
            </Box>
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
                                  <Text
                                    fontSize={"14"}
                                    fontWeight={"bold"}
                                    color={activeColors.tint}
                                  >
                                    {item.userName}
                                  </Text>
                                  <Box>
                                    <Text
                                      fontSize={12}
                                      color={activeColors.tint}
                                    >
                                      {item.rating}
                                    </Text>
                                  </Box>
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
                                Exp: <Text fontWeight="bold">{item.exp}</Text>
                              </Text>
                              <TouchableOpacity>
                                <Text color={"#FDB436"} fontWeight={600}>
                                  Detail
                                  <Icon
                                    as={Ionicons}
                                    name="chevron-forward-outline"
                                    size={4}
                                    ml="2"
                                    color={"#FDB436"}
                                  />
                                </Text>
                              </TouchableOpacity>
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
    </TouchableWithoutFeedback>
  );
};

export default DoctorScreen;