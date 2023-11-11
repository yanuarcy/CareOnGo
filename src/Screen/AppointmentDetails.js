import React, { useEffect, useMemo, useRef, useState } from "react";
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

const { width } = Dimensions.get("window");

const AppointmentDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const initialName = route.params ? route.params.userName : "";
  const initialUserImg = route.params ? route.params.userImg : null;
  const initialText = route.params ? route.params.text : "";
  const initialSpecialty = route.params ? route.params.specialty : "";

  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [initialTimeSelected, setInitialTimeSelected] = useState(true);
  const [message, setMessage] = useState("");

  const timeSlots = Array.from({ length: 11 }, (_, i) => ({
    id: i,
    time: `${i + 9}:00 am`,
  }));

  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);

  const weeks = useMemo(() => {
    const start = moment().add(week, "weeks").startOf("week");

    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, "week").add(index, "day");

        return {
          weekday: date.format("ddd"),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  return (
    <ScrollView>
      <Box bg="white" p={4} mb={2} mt={3}>
        <Box flexDirection="row" alignItems="center">
          <Image
            source={require("../../assets/Chat/Doctor-2.png")} // Ganti dengan URL gambar profil dokter
            alt="Doctor Profile"
            size="100"
            borderRadius="50px"
          />
          <Box ml={4}>
            <Text fontSize={20}>Ken William</Text>
            <Text fontSize={16} color={"gray.600"}>
              Pediatrician
            </Text>
          </Box>
        </Box>
      </Box>

      <Box bg="white" p="4" mt="2" borderRadius="md" shadow={2}>
        <Box py={4} borderBottomWidth={0.5} mb={2}>
          <Text fontSize="16" color="black" fontWeight={600}>
            Appointment ID
          </Text>
          <Text fontSize="16" py={2} color={"gray.500"}>
            <Icon as={Ionicons} name="medkit" size={5} color={"#0082f7"} />{" "}
            215612661
          </Text>
        </Box>

        <Box py={4} borderBottomWidth={0.5} mb={2}>
          <Text fontSize="16" color="black" fontWeight={600}>
            Appointment Date & Time
          </Text>
          <Text fontSize="16" py={2} color={"gray.500"}>
            <Icon
              as={Ionicons}
              name="alarm-outline"
              size={5}
              color={"#0082f7"}
            />{" "}
            11 Nov 2023 - 03:00 pm
          </Text>
        </Box>

        <Box py={4} borderBottomWidth={0.5} mb={2}>
          <Text fontSize="16" color="black" fontWeight={600}>
            Location
          </Text>
          <Text fontSize="16" py={2} color={"gray.500"}>
            <Icon
              as={FontAwesome}
              name="hospital-o"
              size={5}
              color={"#0082f7"}
            />{" "}
            Maya Clinic Scottsdale AZ, Jl. Ketintang, Surabaya, Jawa Timr,
            60332.
          </Text>
        </Box>

        <Box py={4} mb={10}>
          <Text fontSize="16" color="black" fontWeight={600}>
            Patient Detail
          </Text>
          <Text fontSize="16" py={2} color={"gray.500"}>
            <Icon
              as={Ionicons}
              name="person-outline"
              size={5}
              color={"#0082f7"}
            />{" "}
            Mathew Renandra
          </Text>
        </Box>

        <Box>
          <TouchableOpacity
            style={{
              backgroundColor: "#0082f7",
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate("Message");
            }}
          >
            <HStack space={2} alignItems="center" justifyContent={'center'}>
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
