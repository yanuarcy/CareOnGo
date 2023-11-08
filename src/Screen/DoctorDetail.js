import React from "react";
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

const DoctorDetailsScreen = () => {
  // Data dokter, gambar, nama, spesialisasi, dan rating
  const doctorData = {
    name: "Dr. John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    speciality: "Cardiologist",
    rating: {
      star: <FontAwesome name="star" color="orange" size={12} />,
      text: <Text>4.8</Text>,
    },
    patients: "1.08K",
    exp: "10 years",
    reviews: "200+",
    about:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at est quis est porttitor aliquet auctor non quam. Aliquam erat volutpat. Proin fringilla tincidunt ligula. Sed sagittis luctus egestas.\n\n Donec ex magna, pharetra sed viverra quis, faucibus faucibus nulla. Nunc libero sem, posuere quis sem eu, placerat consequat lacus. Fusce eu neque eu ligula consequat bibendum a vitae felis. Donec facilisis accumsan nisi, ac pellentesque felis fermentum pellentesque.Vestibulum consectetur metus vitae dictum facilisis. Proin eleifend maximus diam at sollicitudin. Maecenas iaculis mollis efficitur. Proin tristique tortor nec purus vehicula ultrices.",
  };

  return (
    <ScrollView>
      <Box flex={1} p={2}>
        <Box bg="white" p={2} mb={2}>
          <Box flexDirection="row" alignItems="center">
            <Image
              source={doctorData.userImg} // Ganti dengan URL gambar profil dokter
              alt="Doctor Profile"
              size="100"
              borderRadius="50px"
            />
            <Box ml={4}>
              <Text fontSize={20}>{doctorData.name}</Text>
              <Text fontSize={16} color={"gray.600"}>
                {doctorData.speciality}
              </Text>
              <Text fontSize={12} color={"gray.600"}>
                Rating: {doctorData.rating.star}
                {doctorData.rating.text}
              </Text>
            </Box>
            <Box ml={"auto"}>
              <TouchableOpacity>
                <Icon as={Ionicons} name="chatbox-ellipses-sharp" size={9} color={'green.500'} />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>

        <Box bg="white" p={2} mb={2}>
          <Text fontWeight={"bold"}>About Doctor</Text>
          <Text>{doctorData.about}</Text>
        </Box>

        <Box bg="white" p={2}>
          <Text>
            Patients: <Text fontWeight={"bold"}>{doctorData.patients}</Text>
          </Text>
          <Text>
            Experience: <Text fontWeight={"bold"}>{doctorData.exp}</Text>
          </Text>
          <Text>
            Reviews: <Text fontWeight={"bold"}>{doctorData.reviews}</Text>
          </Text>
        </Box>

        <Box bg="white" p={2}>
          <Text mb={1}>Service at</Text>
          <Text fontWeight={600}>Maya Clinic Scottsdale AZ</Text>
          <Text color={"gray.600"}>
            <Icon
              as={Ionicons}
              name="location-outline"
              size={5}
              color="gray.600"
            />
            Jl. Ketintang, Surabaya, Jawa Timur, 60332.
          </Text>
          <Center>
            <TouchableOpacity
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