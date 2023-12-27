import { useContext, useEffect, useState } from "react";
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
  Modal,
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
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const Data = [
  {
    id: "1",
    userName: "Dr. John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    // rating: {
    //   star: <FontAwesome name="star" color="orange" size={12} />,
    //   text: <Text>4.5</Text>,
    // },
    star: <FontAwesome name="star" color="orange" size={12} />,
    text: "4.5",
    specialty: "Cardiologist",
    patients: "1.08K",
    exp: "10 years",
    reviews: "200+",
  },
  {
    id: "2",
    userName: "Dr. Ken William",
    userImg: require("../../assets/Chat/Doctor-2.png"),
    // rating: {
    //   star: <FontAwesome name="star" color="orange" size={12} />,
    //   text: <Text>4.6</Text>,
    // },
    star: <FontAwesome name="star" color="orange" size={12} />,
    text: "4.6",
    specialty: "Pediatrician",
    patients: "1.08K",
    exp: "12 years",
    reviews: "200+",
  },
  {
    id: "3",
    userName: "Dr. Sellina Paul",
    userImg: require("../../assets/Chat/Doctor-5.jpg"),
    // rating: {
    //   star: <FontAwesome name="star" color="orange" size={12} />,
    //   text: <Text>4.9</Text>,
    // },
    star: <FontAwesome name="star" color="orange" size={12} />,
    text: "4.9",
    specialty: "Neurologist",
    patients: "1.08K",
    exp: "8 years",
    reviews: "200+",
  },
  {
    id: "4",
    userName: "Dr. Jenny Doe",
    userImg: require("../../assets/Chat/Doctor-1.jpg"),
    // rating: {
    //   star: <FontAwesome name="star" color="orange" size={12} />,
    //   text: <Text>5</Text>,
    // },
    star: <FontAwesome name="star" color="orange" size={12} />,
    text: "5",
    specialty: "Gastroenterologist",
    patients: "1.08K",
    exp: "14 years",
    reviews: "200+",
  },
  {
    id: "5",
    userName: "Dr. Christy Alex",
    userImg: require("../../assets/Chat/Doctor-4.jpg"),
    // rating: {
    //   star: <FontAwesome name="star" color="orange" size={12} />,
    //   text: <Text>4.8</Text>,
    // },
    star: <FontAwesome name="star" color="orange" size={12} />,
    text: "4.8",
    specialty: "Gynecologist",
    patients: "1.08K",
    exp: "12 years",
    reviews: "200+",
  },
];

const DoctorScreen = () => {
  // const theme = { mode: "dark" };
  const navigation = useNavigation();
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const [pencarian, setPencarian] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      // const db = getFirestore(firebaseApp);
      const DB = initializeApp(firebaseConfig);
      const firestore = getFirestore(DB);
      const doctorRef = collection(firestore, "users");
      const doctorQuery = query(doctorRef, where("role", "==", "Doctor"));

      try {
        const querySnapshot = await getDocs(doctorQuery);
        const doctors = [];

        querySnapshot.forEach((doc) => {
          doctors.push({ id: doc.id, ...doc.data() });
        });

        setDoctorData(doctors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const filterDoctorsBySpecialty = (Pencarian) => {
    return doctorData.filter(
      (doctor) =>
        doctor.specialist.toLowerCase().includes(Pencarian.toLowerCase()) ||
        doctor.username.toLowerCase().includes(Pencarian.toLowerCase())
    );
  };

  console.log(doctorData);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Box flex={1}>
        <Box flex={1} pl={5} pr={5} backgroundColor={activeColors.primary}>
          <Center>
            <Box mt={40}>
              <HStack alignItems="center" space={2} p={2} rounded="md">
                <Input
                  value={pencarian}
                  onChangeText={(pencarian) => setPencarian(pencarian)}
                  placeholder="Search Name or Specialist"
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
                data={filterDoctorsBySpecialty(pencarian)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={{ width: "100%" }}>
                    <Box justifyContent={"space-between"}>
                      <Flex direction="row">
                        {showModal && (
                          <Modal
                            isOpen={showModal}
                            onClose={() => {setShowModal(false); setSelectedImage(null)}}
                          >
                            <Modal.Content>
                              <Modal.CloseButton />
                              <Modal.Body>
                                <Image
                                  alt="Selected Image"
                                  source={
                                    selectedImage
                                      ? { uri: selectedImage }
                                      : require("../../assets/Chat/ProfileDefault.jpeg")
                                  }
                                  w={"100%"}
                                  h={400}
                                  resizeMode="contain"
                                />
                              </Modal.Body>
                            </Modal.Content>
                          </Modal>
                        )}
                        <Box pt={4} pb={4}>
                          <TouchableOpacity onPress={() => {setShowModal(true); setSelectedImage(item.picture)}}>
                            <Image
                              w={"60"}
                              h={"60"}
                              rounded={"35"}
                              // source={item.userImg}
                              source={
                                item.picture
                                  ? { uri: item.picture }
                                  : require("../../assets/Chat/ProfileDefault.jpeg")
                              }
                              alt="ProfileUserChat"
                            />
                          </TouchableOpacity>
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
                                  <HStack space={2}>
                                    <Text
                                      fontSize={"14"}
                                      fontWeight={"bold"}
                                      color={activeColors.tint}
                                    >
                                      {item.namaLengkap}
                                    </Text>
                                  </HStack>
                                  <HStack alignItems="center" space={1}>
                                    <FontAwesome
                                      name="star"
                                      color="orange"
                                      size={12}
                                    />
                                    <Text color={activeColors.tint}>
                                      {item.rating}
                                    </Text>
                                  </HStack>
                                </HStack>
                              </Flex>
                            </Box>
                            <Text
                              fontSize={"14"}
                              mr={10}
                              color={activeColors.tertiary}
                            >
                              {item.specialist}
                            </Text>
                            <HStack space={16}>
                              <Text
                                fontSize={"14"}
                                mr={10}
                                color={activeColors.tertiary}
                              >
                                Exp:{" "}
                                <Text fontWeight="bold">{item.experience}</Text>
                              </Text>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate("DoctorDetails", {
                                    doctorData: {
                                      id: item.id,
                                      namaLengkap: item.namaLengkap,
                                      picture: item.picture,
                                      // star: item.star,
                                      rating: item.rating,
                                      specialist: item.specialist,
                                      patients: item.patients,
                                      experience: item.experience,
                                      reviews: item.reviews,
                                      lokasiClinic: item.lokasiClinic,
                                    },
                                  })
                                }
                              >
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
