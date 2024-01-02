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
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const BookAppointmentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const initialUserId = route.params ? route.params.userId : "";
  const initialName = route.params ? route.params.namaLengkap : "";
  const initialPicture = route.params ? route.params.picture : null;
  const initialRating = route.params ? route.params.rating : "";
  const initialSpecialist = route.params ? route.params.specialist : "";
  const initiallokasiClinic = route.params ? route.params.lokasiClinic : "";

  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [initialTimeSelected, setInitialTimeSelected] = useState(true);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const timeSlots = Array.from({ length: 11 }, (_, i) => ({
    id: i,
    time: `${i + 9 === 12 ? 12 : (i + 9) % 12}:00 ${i + 9 >= 12 ? "pm" : "am"}`,
  }));

  const swiper = useRef();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [value, setValue] = useState(new Date());
  // const [value, setValue] = useState(
  //   moment().startOf("day").add(1, "day").toDate()
  // );
  const [week, setWeek] = useState(0);
  console.log(week);
  console.log(value);
  console.log(selectedTime);
  console.log(message);

  const now = moment().startOf("day").add(1, "day");
  const start = moment(now).startOf("week").subtract(-1, "day"); // Ambil awal minggu sebelumnya
  const end = moment(now).endOf("week").add(8, "day");

  const weeks = useMemo(() => {
    const now = moment().startOf("day").add(1, "day");
    const start = moment(now).startOf("week").subtract(-1, "day"); // Ambil awal minggu sebelumnya
    const end = moment(now).endOf("week").add(8, "day"); // Ambil akhir minggu setelahnya

    return [0, 1].map((adj) => {
      // Perbesar jangkauan tiga minggu ke belakang
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(index + adj * 7, "day");
        const isDateBeforeNow = date.isBefore(now);
        const isDateInRange = date.isBetween(start, end, null, "[]");
        // const isDateInRange = date.isBetween(start, end, null, '[]'); // Tampilkan tiga minggu

        return {
          weekday: date.format("ddd"),
          date: isDateInRange ? date.toDate() : null,
          pastDate: isDateBeforeNow, // Tambahkan indikator apakah tanggal sudah lewat
        };
      });
    });
  }, [now, start, end]);

  useEffect(() => {
    AsyncStorage.getItem("credentials")
      .then((data) => {
        if (data) {
          const credentials = JSON.parse(data);
          setUserData(credentials);
        }
        // setLoadingData(false);
      })
      .catch((error) => console.log(error));
  }, []);
  console.log("Ini User Data:", userData);

  const generateRandomID = () => {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const createCustomID = () => {
    const prefix = "2256";
    const randomNumber = generateRandomID();
    const customID = `${prefix}${randomNumber}`;
    return customID;
  };

  const saveAppointmentData = async () => {
    try {
      const appointmentData = {
        AppointmentID: createCustomID(),
        PasienID: userData.id,
        NamaPasien: userData.namaLengkap,
        DoctorID: initialUserId,
        DoctorImg: initialPicture,
        DoctorName: initialName,
        DoctorSpecialist: initialSpecialist,
        lokasiClinic: initiallokasiClinic,
        AppointmentFor: message,
        Date: value.toISOString(),
        Time: selectedTime,
      };
      // Simpan ke AsyncStorage
      // await AsyncStorage.setItem(
      //   "AppointmentData",
      //   JSON.stringify(appointmentData)
      // );
      // console.log("Data saved to AsyncStorage");

      // Simpan ke Firebase Firestore
      const usersCollection = collection(firestore, "users");
      const userCollectionn = collection(firestore, "Appointments");
      const userRef = doc(firestore, "users", userData.uid);

      const newDoc = await addDoc(userCollectionn, appointmentData);
      console.log("Data saved to Firestore", newDoc.id);

      const AppointmentID = appointmentData.AppointmentID;
      await updateDoc(userRef, {
        AppointmentID: arrayUnion(AppointmentID),
      });

      const userQuerySnapshot = await getDocs(
        query(usersCollection, where("id", "==", initialUserId))
      );

      userQuerySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          AppointmentID: arrayUnion(AppointmentID),
        });
      });

      let existingRecords = [];
      const appointmentRecords = await AsyncStorage.getItem("AppointmentData");

      console.log("appointment Records :", appointmentRecords);
      console.log("Existing Records before push :", existingRecords);

      if (appointmentRecords !== null) {
        existingRecords = JSON.parse(appointmentRecords);
        if (!Array.isArray(existingRecords)) {
          existingRecords = []; // Reset to an empty array if the data is not an array
        }
        console.log("Existing Appointment: ", existingRecords);
      }

      console.log("Appointment Data : ", appointmentData);
      existingRecords.push(appointmentData); // Add appointmentData to existingRecords

      console.log("Existing Records after push:", existingRecords);
      await AsyncStorage.setItem(
        "AppointmentData",
        JSON.stringify(existingRecords)
      );
      console.log("Data saved to AsyncStorage");

      navigation.replace("BookedAppointment");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Di dalam komponen BookAppointmentScreen setelah pengguna menekan tombol "Confirm Appointment"
  // const handleConfirmAppointment = async () => {
  //   // Logika lainnya...

  //   // Data appointment yang akan disimpan
  //   const appointmentData = {
  //     value: value.toISOString(),
  //     selectedTime,
  //     message,
  //   };

  //   // Panggil fungsi untuk menyimpan data appointment
  //   await saveAppointmentData(appointmentData);

  //   navigation.replace("BookedAppointment");
  // };

  return (
    <ScrollView backgroundColor={activeColors.primary} pagingEnabled>
      <Box bg={activeColors.secondary} p={4} mb={2} mt={3}>
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
                    initialPicture
                      ? { uri: initialPicture }
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
              // source={initialPicture} // Ganti dengan URL gambar profil dokter
              source={
                initialPicture
                  ? { uri: initialPicture }
                  : require("../../assets/Chat/ProfileDefault.jpeg")
              } // Ganti dengan URL gambar profil dokter
              alt="Doctor Profile"
              size="100"
              borderRadius="50px"
            />
          </TouchableOpacity>
          <Box ml={4}>
            <Text fontSize={20} color={activeColors.tint}>
              {initialName}
            </Text>
            <Text fontSize={16} color={activeColors.tertiary}>
              {initialSpecialist}
            </Text>
            <Text fontSize={12} color={activeColors.tertiary}>
              Rating:
              <FontAwesome name="star" color="orange" size={12} />{" "}
              <Text>{initialRating}</Text>
            </Text>
          </Box>
        </Box>
      </Box>

      <Box
        bg={activeColors.secondary}
        p="2"
        my="4"
        borderRadius="md"
        shadow={2}
      >
        <Text fontSize="16" p={2} color={activeColors.tint} fontWeight={800}>
          Select Date
        </Text>
        <Text fontSize="16" color={activeColors.tint} textAlign={"center"}>
          {value.toDateString()}
        </Text>

        <Box flex={1}>
          <Box
            flex={1}
            maxH={74}
            py={3}
            flexDirection={"row"}
            alignItems={"center"}
          >
            <Swiper
              index={weeks.findIndex((week) =>
                week.some(
                  (day) =>
                    day.date &&
                    day.date.toDateString() === currentDate.toDateString()
                )
              )}
              ref={swiper}
              loop={false}
              showsPagination={false}
              onIndexChanged={(ind) => {
                setTimeout(() => {
                  if (ind > 1) {
                    swiper.current.scrollTo(1, false);
                  } else {
                    const newIndex = ind - 1;
                    if (newIndex >= 0 && newIndex <= 1) {
                      const newWeek = newIndex;
                      setWeek(newWeek);
                      setValue(
                        moment(now)
                          .add(newWeek * 7, "day")
                          .toDate()
                      );
                    }
                  }
                }, 0);
              }}
            >
              {weeks.map((dates, index) => {
                {
                  /* const currentDateIndex = dates.findIndex(
                  (day) =>
                    day.date && day.date.toDateString() === value.toDateString()
                ); */
                }

                const currentDateIndex = dates.findIndex(
                  (day) =>
                    day.date &&
                    day.date.toDateString() === currentDate.toDateString()
                );

                const currentWeekDates =
                  currentDateIndex !== -1
                    ? [
                        ...dates.slice(currentDateIndex),
                        ...dates.slice(0, currentDateIndex),
                      ]
                    : [...dates]; // Jika tidak ada tanggal saat ini, gunakan semua tanggal

                return (
                  <Box
                    key={index}
                    width={width}
                    flexDirection={"row"}
                    alignItems={"flex-start"}
                    justifyContent={"space-between"}
                    mx={-2}
                    px={2}
                  >
                    {currentWeekDates.map((item, dateIndex) => {
                      const isActive =
                        item.date &&
                        value.toDateString() === item.date.toDateString();
                      return (
                        <TouchableWithoutFeedback
                          key={dateIndex}
                          onPress={() => {
                            // Ketika pengguna memilih tanggal lain
                            if (!isActive) {
                              // Ubah value sesuai dengan tanggal yang dipilih
                              item.date && setValue(item.date);
                            }
                          }}
                        >
                          <Box
                            borderColor={isActive ? "#0082f7" : "#e3e3e3"}
                            backgroundColor={
                              isActive ? "#0082f7" : "transparent"
                            }
                            flex={1}
                            h={50}
                            mx={1}
                            borderWidth={1}
                            rounded={8}
                            flexDirection={"column"}
                            alignItems={"center"}
                          >
                            {item.date && (
                              <>
                                <Text
                                  fontSize={13}
                                  fontWeight={500}
                                  color={
                                    isActive ? "#fff" : activeColors.tertiary
                                  }
                                  mb={1}
                                >
                                  {item.weekday}
                                </Text>
                                <Text
                                  fontSize={15}
                                  fontWeight={600}
                                  color={isActive ? "#fff" : activeColors.tint}
                                >
                                  {item.date.getDate()}
                                </Text>
                              </>
                            )}
                          </Box>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </Box>
                );
              })}
            </Swiper>
          </Box>
        </Box>
      </Box>

      <Box
        bg={activeColors.secondary}
        p="2"
        my="2"
        borderRadius="md"
        shadow={2}
      >
        <Text fontSize="16" p={2} color={activeColors.tint} fontWeight={800}>
          Select Appointment Time
        </Text>
        <Center>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={timeSlots}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const formattedTime = moment(item.time, "h:mm a").format(
                "hh:mm A"
              );
              const isActive =
                selectedTime === item.time ||
                (initialTimeSelected && formattedTime === "11:00 AM");

              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setSelectedTime(item.time);
                    console.log("item", item.time);
                    setInitialTimeSelected(false); // Setelah memilih, nonaktifkan value awal
                  }}
                >
                  <Box
                    p="2"
                    my={4}
                    mx={1}
                    rounded={12}
                    bg={isActive ? "#0082f7" : "gray.100"}
                  >
                    <Text fontWeight={500} color={isActive ? "white" : "black"}>
                      {formattedTime}
                    </Text>
                  </Box>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </Center>
      </Box>

      <Box
        bg={activeColors.secondary}
        p="4"
        my="4"
        borderRadius="md"
        shadow={2}
      >
        <Text fontSize="16" fontWeight={800} color={activeColors.tint}>
          Appointment for
        </Text>
        <Input
          placeholder="e.g Heart Pain, Body Ache, etc."
          backgroundColor={"gray.100"}
          placeholderTextColor={"muted"}
          rounded={6}
          value={message}
          onChangeText={(msg) => setMessage(msg)}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          my={3}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#0082f7",
            borderRadius: 8,
          }}
          onPress={() => saveAppointmentData()}
        >
          <Text py={3} textAlign={"center"} color={"white"}>
            Confirm Appointment
          </Text>
        </TouchableOpacity>
      </Box>
    </ScrollView>
  );
};

export default BookAppointmentScreen;
