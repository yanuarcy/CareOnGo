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
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";

const Data = [
  {
    id: "1",
    userName: "John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    specialty: "Cardiologist",
    patients: "1.08K",
    exp: "10 years",
    reviews: "200+",
    date: "10 Nov 2023 - 01:00 pm",
  },
  {
    id: "2",
    userName: "Ken William",
    userImg: require("../../assets/Chat/Doctor-2.png"),
    specialty: "Pediatrician",
    patients: "1.08K",
    exp: "12 years",
    reviews: "200+",
    date: "11 Nov 2023 - 03:00 pm",
  },
  {
    id: "3",
    userName: "Sellina Paul",
    userImg: require("../../assets/Chat/Doctor-5.jpg"),
    specialty: "Neurologist",
    patients: "1.08K",
    exp: "8 years",
    reviews: "200+",
    date: "13 Nov 2023 - 03:00 pm",
  },
];

const AppointmentScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();

  return (
    <MenuProvider
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box flex={1}>
        <Box flex={1} backgroundColor={activeColors.primary}>
          <Center>
            <Box mt={4}>
              <FlatList
                data={Data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ width: "100%" }}
                    onPress={() => navigation.navigate("AppointmentDetails")}
                  >
                    <Box
                      justifyContent="space-between"
                      backgroundColor="white"
                      p={3}
                      mb={3}
                      flexDirection="row" // Mengatur tata letak elemen secara horizontal
                      alignItems="center" // Menyamakan ketinggian elemen
                    >
                      <Box pt={4} pb={4}>
                        <Image
                          w={"70"}
                          h={"70"}
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
                      >
                        <Flex direction="column">
                          <Box mb={"1"}>
                            <Flex
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Text
                                  fontSize={"14"}
                                  fontWeight={"bold"}
                                  color={activeColors.tint}
                                >
                                  {item.userName}
                                </Text>
                              </Box>
                              <Box mr={8}>
                                <Menu>
                                  <MenuTrigger>
                                    <Icon
                                      as={Ionicons}
                                      name="ellipsis-vertical-outline"
                                      size={6}
                                      color={activeColors.tertiary}
                                    />
                                  </MenuTrigger>
                                  <MenuOptions>
                                    <MenuOption text="Cancel" />
                                    <MenuOption text="Reschedule" />
                                  </MenuOptions>
                                </Menu>
                              </Box>
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
                    </Box>
                  </TouchableOpacity>
                )}
              />
            </Box>
          </Center>
        </Box>
      </Box>
    </MenuProvider>
  );
};

export default AppointmentScreen;
