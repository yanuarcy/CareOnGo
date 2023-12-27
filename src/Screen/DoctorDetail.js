import React, { useContext, useState } from "react";
import {
  Box,
  Text,
  Button,
  Image,
  ScrollView,
  Icon,
  Center,
  Modal,
} from "native-base";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { ThemeContext } from "../component/themeContext";
import colors from "../component/theme";

const DoctorDetailsScreen = () => {
  // Data dokter, gambar, nama, spesialisasi, dan rating

  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  //   const initialName = route.params ? route.params.userName : "";
  //   const initialUserImg = route.params ? route.params.userImg : null;
  //   const initialStar = route.params ? route.params.star : "";
  //   const initialText = route.params ? route.params.text : "";
  //   const initialSpecialty = route.params ? route.params.speciality : "";
  //   const initialPatients = route.params ? route.params.patients : "";
  //   const initialExp = route.params ? route.params.exp : "";
  //   const initialReviews = route.params ? route.params.reviews : "";

  const initialData = route.params ? route.params.doctorData : null;

  // Kemudian, Anda dapat mengakses data seperti ini:
  const UserID = initialData.id;
  const namaLengkap = initialData.namaLengkap;
  const picture = initialData.picture;
  const rating = initialData.rating;
  const specialist = initialData.specialist;
  const patients = initialData.patients;
  const experience = initialData.experience;
  const reviews = initialData.reviews;
  const lokasiClinic = initialData.lokasiClinic;

  const doctorData = [
    {
      name: namaLengkap,
      picture: picture,
      speciality: specialist,
      rating: rating,
      patients: patients,
      experience: experience,
      reviews: reviews,
      lokasiClinic: lokasiClinic,
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at est quis est porttitor aliquet auctor non quam. Aliquam erat volutpat. Proin fringilla tincidunt ligula. Sed sagittis luctus egestas.\n\n Donec ex magna, pharetra sed viverra quis, faucibus faucibus nulla. Nunc libero sem, posuere quis sem eu, placerat consequat lacus. Fusce eu neque eu ligula consequat bibendum a vitae felis. Donec facilisis accumsan nisi, ac pellentesque felis fermentum pellentesque.Vestibulum consectetur metus vitae dictum facilisis. Proin eleifend maximus diam at sollicitudin. Maecenas iaculis mollis efficitur. Proin tristique tortor nec purus vehicula ultrices.",
    },
  ];

  return (
    <ScrollView>
      <Box flex={1} p={2} backgroundColor={activeColors.primary}>
        <Box bg={activeColors.secondary} p={2} mb={2}>
          {showModal && (
            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
              }}
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Body>
                  <Image
                    alt="Selected Image"
                    source={
                      doctorData[0].picture
                        ? { uri: doctorData[0].picture }
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
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Image
                // source={doctorData[0].picture} // Ganti dengan URL gambar profil dokter
                source={
                  doctorData[0].picture
                    ? { uri: doctorData[0].picture }
                    : require("../../assets/Chat/ProfileDefault.jpeg")
                } // Ganti dengan URL gambar profil dokter
                alt="Doctor Profile"
                size="100"
                borderRadius="50px"
              />
            </TouchableOpacity>
            <Box ml={4}>
              <Text fontSize={20} color={activeColors.tint}>
                {doctorData[0].name}
              </Text>
              <Text fontSize={16} color={activeColors.tertiary}>
                {doctorData[0].speciality}
              </Text>
              <Text fontSize={12} color={activeColors.tertiary}>
                Rating:
                <FontAwesome name="star" color="orange" size={12} />{" "}
                <Text>{doctorData[0].rating}</Text>
              </Text>
            </Box>
            <Box ml={"auto"}>
              <TouchableOpacity
                onPress={() => 
                  navigation.navigate("RoomChat", {
                    userName: namaLengkap,
                    userId: UserID,
                    userImg: picture,
                  })
                }
              >
                <Icon
                  as={Ionicons}
                  name="chatbox-ellipses-sharp"
                  size={9}
                  color={"green.500"}
                />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>

        <Box bg={activeColors.secondary} p={2} mb={2}>
          <Text fontWeight={"bold"} color={activeColors.tint}>
            About Doctor
          </Text>
          <Text color={activeColors.tint}>{doctorData[0].about}</Text>
        </Box>

        <Box bg={activeColors.secondary} p={2}>
          <Text color={activeColors.tertiary}>
            Patients:{" "}
            <Text fontWeight={"bold"} color={activeColors.tint}>
              {doctorData[0].patients}
            </Text>
          </Text>
          <Text color={activeColors.tertiary}>
            Experience:{" "}
            <Text fontWeight={"bold"} color={activeColors.tint}>
              {doctorData[0].experience}
            </Text>
          </Text>
          <Text color={activeColors.tertiary}>
            Reviews:{" "}
            <Text fontWeight={"bold"} color={activeColors.tint}>
              {doctorData[0].reviews}
            </Text>
          </Text>
        </Box>

        <Box bg={activeColors.secondary} p={2}>
          <Text mb={1} color={activeColors.tint}>
            Service at
          </Text>
          <Text fontWeight={600} color={activeColors.tint}>
            {doctorData[0].lokasiClinic}
          </Text>
          <Text color={activeColors.tertiary}>
            <Icon
              as={Ionicons}
              name="location-outline"
              size={5}
              color={activeColors.tertiary}
            />
            Jl. Ketintang, Surabaya, Jawa Timur, 60332.
          </Text>
          <Center>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BookAppointment", {
                  namaLengkap: namaLengkap,
                  picture: picture,
                  specialist: specialist,
                  rating: rating,
                })
              }
              style={{
                width: "85%",
                backgroundColor: "#0082f7",
                borderRadius: 12,
                marginVertical: 12,
              }}
            >
              <Text
                textAlign="center"
                fontSize={16}
                // fontFamily="NotoSansBlack"
                color="#fff"
                py={3}
              >
                Book Appointment Now
              </Text>
            </TouchableOpacity>
          </Center>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default DoctorDetailsScreen;
