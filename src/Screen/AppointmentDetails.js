import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  Box,
  Button,
  Input,
  HStack,
  Center,
  ScrollView,
  Image,
  FlatList,
  Icon,
  Modal,
} from "native-base";
import moment from "moment";
import Swiper from "react-native-swiper";
import {
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../component/themeContext";
import colors from "../component/theme";

const { width } = Dimensions.get("window");

const AppointmentDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const [showModal, setShowModal] = useState(false);

  const initialDoctorID = route.params ? route.params.DoctorID : "";
  const initialDoctorName = route.params ? route.params.DoctorName : "";
  const initialDoctorImg = route.params ? route.params.DoctorImg : null;
  const initialDoctorSpecialist = route.params
    ? route.params.DoctorSpecialist
    : "";
  const initialAppointmentID = route.params ? route.params.AppointmentID : "";
  const initialAppointmentFor = route.params ? route.params.AppointmentFor : "";
  const initialDate = route.params ? route.params.Date : "";
  const initialTime = route.params ? route.params.Time : "";
  const initiallokasiClinic = route.params ? route.params.lokasiClinic : "";
  const initialNamaPasien = route.params ? route.params.NamaPasien : "";

  return (
    <ScrollView backgroundColor={activeColors.primary}>
      <Box bg={activeColors.secondary} p={4} mb={2} mt={3}>
        <Box flexDirection="row" alignItems="center">
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
                      initialDoctorImg
                        ? { uri: initialDoctorImg }
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
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Image
              // source={require("../../assets/Chat/Doctor-2.png")} // Ganti dengan URL gambar profil dokter
              source={
                initialDoctorImg
                  ? { uri: initialDoctorImg }
                  : require("../../assets/Chat/ProfileDefault.jpeg")
              } // Ganti dengan URL gambar profil dokter
              alt="Doctor Profile"
              size="100"
              borderRadius="50px"
            />
          </TouchableOpacity>
          <Box ml={4}>
            <Text fontSize={20} color={activeColors.tint}>
              {initialDoctorName}
            </Text>
            <Text fontSize={16} color={activeColors.tertiary}>
              {initialDoctorSpecialist}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box
        bg={activeColors.secondary}
        p="4"
        mt="2"
        borderRadius="md"
        shadow={2}
      >
        <Box
          py={4}
          borderBottomWidth={0.5}
          borderBottomColor={activeColors.tint}
          mb={2}
        >
          <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
            Appointment ID
          </Text>
          <Text fontSize="16" py={2} color={activeColors.tertiary}>
            <Icon as={Ionicons} name="medkit" size={5} color={"#0082f7"} />{" "}
            {initialAppointmentID}
          </Text>
        </Box>

        <Box
          py={4}
          borderBottomWidth={0.5}
          borderBottomColor={activeColors.tint}
          mb={2}
        >
          <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
            Appointment For
          </Text>
          <Text fontSize="16" py={2} color={activeColors.tertiary}>
            <Icon as={Ionicons} name="pencil-outline" size={5} color={"#0082f7"} />{" "}
            {initialAppointmentFor ? initialAppointmentFor : "No text available"}
          </Text>
        </Box>

        <Box
          py={4}
          borderBottomWidth={0.5}
          borderBottomColor={activeColors.tint}
          mb={2}
        >
          <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
            Appointment Date & Time
          </Text>
          <Text fontSize="16" py={2} color={activeColors.tertiary}>
            <Icon
              as={Ionicons}
              name="alarm-outline"
              size={5}
              color={"#0082f7"}
            />{" "}
            {initialDate &&
              (() => {
                const dateObj = new Date(initialDate);
                return `${dateObj.getDate()} ${dateObj.toLocaleString(
                  "default",
                  { month: "short" }
                )} ${dateObj.getFullYear()}`;
              })()}{" "}
            - {initialTime}
          </Text>
        </Box>

        <Box
          py={4}
          borderBottomWidth={0.5}
          borderBottomColor={activeColors.tint}
          mb={2}
        >
          <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
            Location
          </Text>
          <Text fontSize="16" py={2} color={activeColors.tertiary}>
            <Icon
              as={FontAwesome}
              name="hospital-o"
              size={5}
              color={"#0082f7"}
            />{" "}
            {initiallokasiClinic}
          </Text>
        </Box>

        <Box py={4} mb={10}>
          <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
            Patient Detail
          </Text>
          <Text fontSize="16" py={2} color={activeColors.tertiary}>
            <Icon
              as={Ionicons}
              name="person-outline"
              size={5}
              color={"#0082f7"}
            />{" "}
            {initialNamaPasien}
          </Text>
        </Box>

        <Box>
          <TouchableOpacity
            style={{
              backgroundColor: "#0082f7",
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate("RoomChat", {
                userName: initialDoctorName,
                userId: initialDoctorID,
                userImg: initialDoctorImg,
              });
            }}
          >
            <HStack space={2} alignItems="center" justifyContent={"center"}>
              <Icon
                as={Ionicons}
                name="chatbox-ellipses-sharp"
                size={6}
                color={"white"}
              />
              <Text py={4} fontSize={20} textAlign={"center"} color={"white"}>
                Chat
              </Text>
            </HStack>
          </TouchableOpacity>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default AppointmentDetailsScreen;
