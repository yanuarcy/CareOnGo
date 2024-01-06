import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Text, Image, Flex, Center } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "./theme";
import { useNavigation } from "@react-navigation/native";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

const getRandomItem = (items) => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

const JadwaL = () => {
  const navigation = useNavigation();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [Data, setData] = useState([]);
  const [UserData, setUserData] = useState(null);
  const [isEmptyData, setIsEmptyData] = useState(false);

  const getRandomAppointment = async () => {
    // const user = firebase.auth().currentUser;
    const credentialsData = await AsyncStorage.getItem("credentials");
    const parsedCredentials = JSON.parse(credentialsData);
    setUserData(parsedCredentials);
    console.log(parsedCredentials);

    // const userID = user.uid; // ID user yang sedang login
    const DataAppointments = collection(firestore, "Appointments");
    const DataUser = collection(firestore, "users");

    // const appointmentsRef = firebase.firestore().collection('Appointments');
    // const querySnapshot = await appointmentsRef.where('PasienID', '==', userID).get();

    const appointments = [];

    if (parsedCredentials.role === "Doctor") {
      const userSnapshot = await getDocs(
        query(
          DataAppointments,
          where("DoctorName", "==", parsedCredentials.namaLengkap)
        )
      );

      userSnapshot.forEach((doc) => {
        const appointment = doc.data();
        appointments.push(appointment);
      });
    } else {
      const userSnapshot = await getDocs(
        query(DataAppointments, where("PasienID", "==", parsedCredentials.id))
      );

      // const appointments = [];
      userSnapshot.forEach((doc) => {
        const appointment = doc.data();
        appointments.push(appointment);
      });
    }

    if (appointments.length === 0) {
      setIsEmptyData(true);
      console.log("Empty");
    } else {
      // Mengambil data acak dari appointments
      let DataAppointment = [];
      const randomAppointment = getRandomItem(appointments);
      console.log("Data Acak Appointment:", randomAppointment);
      console.log("Data Acak Appointment:", randomAppointment.PasienID);
      DataAppointment.push(randomAppointment);
      console.log("Data:", DataAppointment);

      const userSnapshot = await getDocs(
        query(DataUser, where("id", "==", randomAppointment.PasienID))
      );
      if (!userSnapshot.empty) {
        userSnapshot.forEach((doc) => {
          const DataPasien = doc.data();
          console.log("Data Pasien", DataPasien);

          DataAppointment = DataAppointment.map((appointment) => ({
            ...appointment,
            PasienData: DataPasien, // Menambahkan DataPasien ke setiap objek appointmentDataState
          }));
          // appointments.push(...appointments);
        });
        // console.log("Data Pasien ditemukan")
      }
      console.log("ini data Appointment Random", DataAppointment);

      setIsEmptyData(false);
      setData(DataAppointment);
    }

    // Lakukan sesuatu dengan data acak yang telah diambil
  };

  useEffect(() => {
    getRandomAppointment();
  }, []);

  return (
    <Box>
      <Box mt={5}>
        <Flex direction="row">
          <Text color={"#0082F7"} fontWeight={"bold"}>
            Appointment
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              flex: 1,
            }}
            onPress={() => navigation.navigate("Appointment")}
          >
            <Text color={"#FDB436"} fontWeight={"bold"}>
              Lihat Semua
            </Text>
          </TouchableOpacity>
        </Flex>
      </Box>
      <Box>
        <Box rounded={3} mt={3}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 10 }}
            colors={["#018BF7", "#00BAF7"]}
          >
            {isEmptyData ? (
              <>
                <Center flex={1} justifyContent={"center"} mt={4}>
                  <LottieView
                    style={{
                      width: 70,
                      height: 140,
                      // marginTop: 10,
                      // marginVertical: 10,
                    }}
                    source={require("../../assets/EmptyAnimation.json")}
                    autoPlay
                    loop={true}
                    speed={1.2}
                  />
                </Center>
                <Text
                  textAlign= "center"
                  fontWeight= {500}
                  fontSize= {18}
                  mb= {5}
                  color={"white"}
                >
                  Appointment Masih Kosong
                </Text>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={{ padding: 20, borderRadius: 10 }}
                  onPress={() =>
                    navigation.navigate("AppointmentDetails", {
                      DoctorID: Data[0]?.DoctorID,
                      DoctorImg:
                        UserData.role === "Pasien"
                          ? Data[0]?.DoctorImg
                          : Data[0]?.PasienData.picture,
                      DoctorName:
                        UserData.role === "Pasien"
                          ? Data[0]?.DoctorName
                          : Data[0]?.PasienData.namaLengkap,
                      DoctorSpecialist:
                        UserData.role === "Pasien"
                          ? Data[0]?.DoctorSpecialist
                          : Data[0]?.PasienData.id,
                      AppointmentID: Data[0]?.AppointmentID,
                      AppointmentFor: Data[0]?.AppointmentFor,
                      Date: Data[0]?.Date,
                      Time: Data[0]?.Time,
                      lokasiClinic: Data[0]?.lokasiClinic,
                      NamaPasien: Data[0]?.PasienData.namaLengkap,
                    })
                  }
                >
                  <Box style={{ flexDirection: "row" }}>
                    <Image
                      source={
                        UserData?.role === "Pasien"
                          ? Data[0]?.DoctorImg
                            ? { uri: Data[0].DoctorImg }
                            : require("../../assets/Chat/ProfileDefault.jpeg")
                          : Data[0]?.PasienData.picture
                          ? { uri: Data[0]?.PasienData.picture }
                          : require("../../assets/Chat/ProfileDefault.jpeg")
                      }
                      alt="Profil Doktor"
                      w={12}
                      h={12}
                      rounded={25}
                      backgroundColor={"#FFFFFF"}
                    />
                    <Box flex={1} ml={3} justifyContent={"center"}>
                      {UserData?.role === "Doctor" ? (
                        <>
                          <Text color={"#FFFFFF"} fontWeight={"bold"}>
                            {Data[0]?.PasienData.namaLengkap}
                          </Text>
                          <Text color={"#f4f4f4"}>
                            {Data[0]?.AppointmentFor
                              ? Data[0]?.AppointmentFor.length > 30
                                ? Data[0]?.AppointmentFor.slice(0, 30) + "..."
                                : Data[0]?.AppointmentFor
                              : "No text available"}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text color={"#FFFFFF"} fontWeight={"bold"}>
                            {Data[0]?.DoctorName}
                          </Text>
                          <Text color={"#f4f4f4"}>
                            {Data[0]?.DoctorSpecialist}
                          </Text>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box mt={5}>
                    <Box>
                      <Flex direction="row">
                        <Icon name="time" size={25} color="#FFFFFF" />
                        <Box justifyContent={"center"} alignItems={"center"}>
                          <Text color={"#FFFFFF"} ml={2.5}>
                            {/* 16 Nov 2023 */}
                            {/* {Data?.Date } */}
                            {Data[0]?.Date &&
                              (() => {
                                const dateObj = new Date(Data[0].Date);
                                return `${dateObj.getDate()} ${dateObj.toLocaleString(
                                  "default",
                                  { month: "short" }
                                )} ${dateObj.getFullYear()}`;
                              })()}{" "}
                            - {Data[0]?.Time}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                    <Box style={{ flexDirection: "row" }}>
                      <Flex direction="row">
                        <Icon name="compass" size={25} color="#FFFFFF" />
                        <Box justifyContent={"center"} alignItems={"center"}>
                          <Text color={"#FFFFFF"} ml={2.5}>
                            {/* Maya Clinic Scottsdale AZ */}
                            {Data[0]?.lokasiClinic}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                    <Box justifyContent={"center"} alignItems={"flex-end"}>
                      <Icon
                        name="chevron-forward-circle"
                        size={35}
                        color="#FFFFFF"
                      />
                    </Box>
                  </Box>
                </TouchableOpacity>
              </>
            )}
          </LinearGradient>
        </Box>
      </Box>
    </Box>
  );
};

export default JadwaL;
