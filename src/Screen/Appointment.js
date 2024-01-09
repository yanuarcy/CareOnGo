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
  Modal,
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import LottieView from "lottie-react-native";

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

  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const usersCollection = collection(firestore, "users");
  const DataAppointments = collection(firestore, "Appointments");

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshChat, setRefreshChat] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const [UserData, setUserData] = useState(null);
  const [DataKu, setData] = useState([]);

  const navigation = useNavigation();

  const onRefresh = async () => {
    // Lakukan proses pembaruan data di sini
    // Contoh: panggil fungsi untuk mengambil data baru
    // dan atur refreshing ke false setelah selesai
    setRefreshing(true);
    await fetchingData(); // Ganti dengan fungsi yang sesuai untuk memuat ulang data
    setRefreshing(false);
  };

  const fetchingData = async () => {
    try {
      const credentialsData = await AsyncStorage.getItem("credentials");
      const parsedCredentials = JSON.parse(credentialsData);
      setUserData(parsedCredentials);

      if (parsedCredentials.role === "Doctor") {
        const appointmentsSnapshot = await getDocs(
          query(
            DataAppointments,
            where("DoctorID", "==", parsedCredentials.id)
          )
        );

        const appointmentDataState = [];

        for (const appointmentDoc of appointmentsSnapshot.docs) {
          const appointmentData = appointmentDoc.data();
          const pasienID = appointmentData.PasienID;

          const pasienQuerySnapshot = await getDocs(
            query(usersCollection, where("id", "==", pasienID))
          );

          pasienQuerySnapshot.forEach((pasienDoc) => {
            const pasienData = pasienDoc.data();
            const appointmentWithPasienData = {
              ...appointmentData,
              PasienData: pasienData,
            };
            appointmentDataState.push(appointmentWithPasienData);
          });
        }

        console.log(
          "Appointment Data State (Doctor): ",
          appointmentDataState
        );
        setData(appointmentDataState);
      } else if (parsedCredentials.role === "Pasien") {
        const appointmentsSnapshot = await getDocs(
          query(
            DataAppointments,
            where("PasienID", "==", parsedCredentials.id)
          )
        );

        const appointmentDataState = [];

        for (const appointmentDoc of appointmentsSnapshot.docs) {
          const appointmentData = appointmentDoc.data();
          const dokterID = appointmentData.DoctorID;

          const dokterQuerySnapshot = await getDocs(
            query(usersCollection, where("id", "==", dokterID))
          );

          dokterQuerySnapshot.forEach((dokterDoc) => {
            const dokterData = dokterDoc.data();
            const appointmentWithDokterData = {
              ...appointmentData,
              DokterData: dokterData,
            };
            appointmentDataState.push(appointmentWithDokterData);
          });
        }

        console.log(
          "Appointment Data State (Pasien): ",
          appointmentDataState
        );
        setData(appointmentDataState);
      }

      setIsLoading(false);

      // const appointmentData = await AsyncStorage.getItem("AppointmentData");
      // let appointmentDataState = [];
      // if (appointmentData !== null) {
      //   const parsedAppointmentData = JSON.parse(appointmentData);
      //   appointmentDataState = parsedAppointmentData;
      //   console.log("Data from AsyncStorage:", appointmentDataState);
      //   // Gunakan parsedAppointmentData untuk menampilkan atau memproses data yang diambil dari AsyncStorage

      //   // Mendapatkan data pengguna dengan PasienID yang sesuai dengan data appointmentDataState
      //   const pasienIDs = appointmentDataState.map(
      //     (appointment) => appointment.PasienID
      //   );
      //   console.log("pasienID:", pasienIDs);

      //   // Array untuk menyimpan DataPasien yang sesuai dengan appointmentDataState
      //   const userDataPromises = pasienIDs.map(async (pasienID) => {
      //     const userSnapshot = await getDocs(
      //       query(usersCollection, where("id", "==", pasienID))
      //     );
      //     if (!userSnapshot.empty) {
      //       const userData = userSnapshot.docs.map((doc) => doc.data());
      //       return userData.length ? userData[0] : null;
      //     }
      //     return null;
      //   });

      //   const userData = await Promise.all(userDataPromises);
      //   console.log("Data Pengguna yang Cocok:", userData);

      //   // Menggabungkan DataPasien ke dalam setiap objek dalam appointmentDataState
      //   appointmentDataState = appointmentDataState.map(
      //     (appointment, index) => ({
      //       ...appointment,
      //       PasienData: userData[index], // Menambahkan DataPasien ke setiap objek appointmentDataState
      //     })
      //   );
      // } else {
      //   console.log("No data found in AsyncStorage for appointments");
      // }

      // setData(appointmentDataState);
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  useEffect(() => {

    if (isFocused) {
      fetchingData();
    }
  }, [isFocused]);

  console.log("Data Appointment cuy: ", DataKu);

  const handleCancelAppointment = async (id) => {
    // Lakukan proses penghapusan data appointment dengan ID yang dipilih
    try {
      // Contoh penghapusan dari AsyncStorage
      const appointmentData = await AsyncStorage.getItem("AppointmentData");
      if (appointmentData !== null) {
        const parsedAppointmentData = JSON.parse(appointmentData);
        const updatedData = parsedAppointmentData.filter(
          (appointment) => appointment.AppointmentID !== id
        );

        // Hapus data dari Firestore
        const appointmentSnapshot = await getDocs(
          query(DataAppointments, where("AppointmentID", "==", id))
        );
        appointmentSnapshot.docs.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log("Data berhasil dihapus dari Appointments");
        });

        // Cari dokumen yang memiliki AppointmentID yang ingin dihapus
        const usersSnapshot = await getDocs(
          query(usersCollection, where("AppointmentID", "array-contains", id))
        );

        usersSnapshot.docs.forEach(async (doc) => {
          // Dapatkan data AppointmentID dari dokumen
          const appointments = doc.data().AppointmentID;
          console.log("Ini AppointmentID sebelum dihapus:", appointments);

          // Cek jika AppointmentID yang ingin dihapus ada di dalam array
          if (appointments.includes(id)) {
            // Hapus AppointmentID yang cocok dengan yang ingin dihapus
            const updatedAppointments = appointments.filter(
              (appointmentId) => appointmentId !== id
            );

            // Update dokumen dengan AppointmentID yang telah dihapus
            await updateDoc(doc.ref, { AppointmentID: updatedAppointments });
            console.log(
              "Data AppointmentsID pada users telah dihapus",
              updatedAppointments
            );
          }
        });

        const updatedDataWithPasien = await Promise.all(
          updatedData.map(async (appointment) => {
            const userSnapshot = await getDocs(
              query(usersCollection, where("id", "==", appointment.PasienID))
            );
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs.map((doc) => doc.data());
              return {
                ...appointment,
                PasienData: userData.length ? userData[0] : null,
              };
            }
            return appointment;
          })
        );

        // Simpan kembali data setelah penghapusan
        await AsyncStorage.setItem(
          "AppointmentData",
          JSON.stringify(updatedDataWithPasien)
        );
        // Perbarui state jika diperlukan 225654710
        setData(updatedDataWithPasien);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <MenuProvider
      style={{
        flex: 1,
        backgroundColor: activeColors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box backgroundColor={activeColors.primary}>
        <Box flex={1}>
          <Center>
            <Box mt={4}>
              {isLoading ? (
                <Center
                  flex={1}
                  justifyContent={"center"}
                  backgroundColor={activeColors.primary}
                >
                  <LottieView
                    style={{
                      width: 70,
                      height: 170,
                    }}
                    source={require("../../assets/LoadingAnimation.json")}
                    autoPlay
                    loop={true}
                    speed={1.5}
                  />
                  {/* <Text>Loading ...</Text> */}
                </Center>
              ) : DataKu.length === 0 ? (
                <Box flex={1} mt={-5} backgroundColor={activeColors.secondary}>
                  <Center justifyContent={"center"}>
                    {/* <Spinner size="lg" color={"black"} /> */}
                    <LottieView
                      style={{
                        width: 70,
                        height: 170,
                        marginTop: 90,
                        // marginBottom: 250,
                      }}
                      source={require("../../assets/EmptyAnimation.json")}
                      autoPlay
                      loop={true}
                      speed={1.3}
                    />
                  </Center>
                  <Text
                    textAlign="center"
                    fontSize={18}
                    fontWeight={500}
                    marginTop={90}
                    color={activeColors.tint}
                  >
                    Appointment Masih Kosong
                  </Text>
                  {UserData.role === "Doctor" ? (
                    <Text
                      textAlign={"center"}
                      fontSize={14}
                      px={8}
                      color={activeColors.tertiary}
                    >
                      Ayo mulai buat janji dengan dokter pilihan anda secara
                      gratis.
                    </Text>
                  ) : (
                    <>
                      <Text
                        textAlign={"center"}
                        fontSize={14}
                        px={8}
                        color={activeColors.tertiary}
                      >
                        Ayo mulai buat janji dengan dokter pilihan anda secara
                        gratis.
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Doctor")}
                        style={{
                          marginTop: 20,
                          backgroundColor: "#0082f7",
                          borderRadius: 8,
                          alignItems: "center",
                          marginHorizontal: 50,
                        }}
                      >
                        <Text color={"white"} p={3}>
                          Buat Janji Sekarang
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Box>
              ) : (
                <FlatList
                  data={DataKu}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  keyExtractor={(item) => item.AppointmentID.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ width: "100%" }}
                      onPress={() =>
                        navigation.navigate("AppointmentDetails", {
                          DoctorID:
                            UserData.role === "Pasien"
                              ? item.DoctorID
                              : item.PasienData?.id,
                          DoctorImg:
                            UserData.role === "Pasien"
                              ? item.DoctorImg
                              : item.PasienData?.picture,
                          DoctorName:
                            UserData.role === "Pasien"
                              ? item.DoctorName
                              : item.PasienData?.namaLengkap,
                          DoctorSpecialist:
                            UserData.role === "Pasien"
                              ? item.DoctorSpecialist
                              : item.PasienData?.id,
                          AppointmentID: item.AppointmentID,
                          AppointmentFor: item.AppointmentFor,
                          Date: item.Date,
                          Time: item.Time,
                          lokasiClinic: item.lokasiClinic,
                          NamaPasien: item.NamaPasien,
                        })
                      }
                    >
                      <Box
                        justifyContent="space-between"
                        backgroundColor={activeColors.secondary}
                        p={3}
                        mb={3}
                        flexDirection="row" // Mengatur tata letak elemen secara horizontal
                        alignItems="center" // Menyamakan ketinggian elemen
                      >
                        <Box pt={4} pb={4}>
                          {showModal && (
                            <Modal
                              isOpen={showModal}
                              onClose={() => {
                                setShowModal(false);
                                setSelectedImage(null);
                              }}
                            >
                              <Modal.Content>
                                <Modal.CloseButton />
                                <Modal.Body
                                  backgroundColor={activeColors.secondary}
                                >
                                  <Image
                                    alt="Selected Image"
                                    source={
                                      UserData.role === "Pasien"
                                        ? selectedImage.DoctorImg
                                          ? { uri: selectedImage.DoctorImg }
                                          : require("../../assets/Chat/ProfileDefault.jpeg")
                                        : selectedImage.PasienData.picture
                                        ? {
                                            uri: selectedImage.PasienData
                                              .picture,
                                          }
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
                          <TouchableOpacity
                            onPress={() => {
                              setShowModal(true);
                              setSelectedImage(item);
                            }}
                          >
                            <Image
                              w={"70"}
                              h={"70"}
                              rounded={"35"}
                              source={
                                UserData.role === "Pasien"
                                  ? item.DoctorImg
                                    ? { uri: item.DoctorImg }
                                    : require("../../assets/Chat/ProfileDefault.jpeg")
                                  : item.PasienData?.picture
                                  ? { uri: item.PasienData?.picture }
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
                                    {UserData.role === "Pasien"
                                      ? item.DoctorName
                                      : item.PasienData?.namaLengkap}
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
                                      <MenuOption
                                        text={
                                          UserData.role === "Pasien"
                                            ? "Cancel"
                                            : "Done"
                                        }
                                        onSelect={() =>
                                          handleCancelAppointment(
                                            item.AppointmentID
                                          )
                                        }
                                      />
                                      {/* <MenuOption text="Reschedule" /> */}
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
                              {/* {item.DoctorSpecialist} */}
                              {UserData.role === "Pasien"
                                ? item.DoctorSpecialist
                                : item.AppointmentFor
                                ? item.AppointmentFor.length > 35
                                  ? item.AppointmentFor.slice(0, 35) + "..."
                                  : item.AppointmentFor
                                : "No text available"}
                            </Text>
                            <HStack space={16}>
                              <Text
                                fontSize={"14"}
                                mr={10}
                                color={activeColors.tertiary}
                              >
                                {/* <Text fontWeight="bold">{item.date}</Text> */}
                                {/* <Text fontWeight="bold">{item.appointmentData[0]?.Time}</Text> */}
                                <Text fontWeight="bold">
                                  {item?.Date &&
                                    (() => {
                                      const dateObj = new Date(item.Date);
                                      return `${dateObj.getDate()} ${dateObj.toLocaleString(
                                        "default",
                                        { month: "short" }
                                      )} ${dateObj.getFullYear()}`;
                                    })()}{" "}
                                  - {item?.Time}
                                </Text>
                              </Text>
                            </HStack>
                          </Flex>
                        </Box>
                      </Box>
                    </TouchableOpacity>
                  )}
                />
              )}
            </Box>
          </Center>
        </Box>
      </Box>
    </MenuProvider>
  );
};

export default AppointmentScreen;
