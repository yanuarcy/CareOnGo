import React, { useContext } from "react";
import {
  Box,
  Text,
  Button,
  Image,
  ScrollView,
  Icon,
  Center,
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
  const userName = initialData.userName;
  const userImg = initialData.userImg;
  const text = initialData.text;
  const specialty = initialData.specialty;
  const patients = initialData.patients;
  const exp = initialData.exp;
  const reviews = initialData.reviews;

  const doctorData = [
    {
      name: userName,
      userImg: userImg,
      speciality: specialty,
      text: text,
      patients: patients,
      exp: exp,
      reviews: reviews,
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at est quis est porttitor aliquet auctor non quam. Aliquam erat volutpat. Proin fringilla tincidunt ligula. Sed sagittis luctus egestas.\n\n Donec ex magna, pharetra sed viverra quis, faucibus faucibus nulla. Nunc libero sem, posuere quis sem eu, placerat consequat lacus. Fusce eu neque eu ligula consequat bibendum a vitae felis. Donec facilisis accumsan nisi, ac pellentesque felis fermentum pellentesque.Vestibulum consectetur metus vitae dictum facilisis. Proin eleifend maximus diam at sollicitudin. Maecenas iaculis mollis efficitur. Proin tristique tortor nec purus vehicula ultrices.",
    },
  ];

  return (
    <ScrollView>
      <Box flex={1} p={2} backgroundColor={activeColors.primary}>
        <Box bg={activeColors.secondary} p={2} mb={2}>
          <Box flexDirection="row" alignItems="center">
            <Image
              source={doctorData[0].userImg} // Ganti dengan URL gambar profil dokter
              alt="Doctor Profile"
              size="100"
              borderRadius="50px"
            />
            <Box ml={4}>
              <Text fontSize={20} color={activeColors.tint}>{doctorData[0].name}</Text>
              <Text fontSize={16} color={activeColors.tertiary}>
                {doctorData[0].speciality}
              </Text>
              <Text fontSize={12} color={activeColors.tertiary}>
                Rating:
                <FontAwesome name="star" color="orange" size={12} />{" "}
                <Text>{doctorData[0].text}</Text>
              </Text>
            </Box>
            <Box ml={"auto"}>
              <TouchableOpacity onPress={() => navigation.navigate("Message")}>
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
          <Text fontWeight={"bold"} color={activeColors.tint}>About Doctor</Text>
          <Text color={activeColors.tint}>{doctorData[0].about}</Text>
        </Box>

        <Box bg={activeColors.secondary} p={2}>
          <Text color={activeColors.tertiary}>
            Patients: <Text fontWeight={"bold"} color={activeColors.tint}>{doctorData[0].patients}</Text>
          </Text>
          <Text color={activeColors.tertiary}>
            Experience: <Text fontWeight={"bold"} color={activeColors.tint}>{doctorData[0].exp}</Text>
          </Text>
          <Text color={activeColors.tertiary}>
            Reviews: <Text fontWeight={"bold"} color={activeColors.tint}>{doctorData[0].reviews}</Text>
          </Text>
        </Box>

        <Box bg={activeColors.secondary} p={2}>
          <Text mb={1} color={activeColors.tint}>Service at</Text>
          <Text fontWeight={600} color={activeColors.tint}>Maya Clinic Scottsdale AZ</Text>
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
                  userName: userName,
                  userImg: userImg,
                  specialty: specialty,
                  text: text,
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