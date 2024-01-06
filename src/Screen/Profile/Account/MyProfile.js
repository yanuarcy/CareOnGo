import React, { useContext, useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import {
  Box,
  Text,
  Input,
  ScrollView,
  Flex,
  HStack,
  Spinner,
} from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../../../../firebase-config";
import { initializeApp } from "firebase/app";

const MyProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [loadingData, setLoadingData] = useState(true);

  const [editingTelp, setEditingTelp] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingNama, setEditingNama] = useState(false);
  const [editingGender, setEditingGender] = useState(false);
  const [editingTgl, setEditingTgl] = useState(false);
  const [editingAlamat, setEditingAlamat] = useState(false);
  const [editingCity, setEditingCity] = useState(false);

  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("");

  const [nama, setNama] = useState("");
  const [gender, setGender] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    // Ambil data dari AsyncStorage saat komponen dipasang (mounted)
    AsyncStorage.getItem("credentials")
      .then((data) => {
        if (data) {
          const credentials = JSON.parse(data);
          setUserData(credentials);
          setNama(credentials.namaLengkap);
          setGender(credentials.jenisKelamin);
          setTglLahir(credentials.tglLahir);
          setAlamat(credentials.alamat);
          setCity(credentials.cities);
          setUserRole(credentials.role);
        }
        setLoadingData(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleFieldChange = async (field, newValue) => {
    if (!userData || !userData.uid) {
      console.error("UserData is not defined or does not have a UID");
      return;
    }

    let updatedUserData = { ...userData };
    console.log("UpdateUserData ke - 1: ", updatedUserData);

    switch (field) {
      case "Telp":
        updatedUserData = { ...updatedUserData, phone: newValue };
        break;
      case "Email":
        updatedUserData = { ...updatedUserData, email: newValue };
        break;
      case "Biodata":
        if (newValue.nama) {
          updatedUserData = {
            ...updatedUserData,
            namaLengkap: newValue.nama,
          };
        }
        if (newValue.gender) {
          updatedUserData = {
            ...updatedUserData,
            jenisKelamin: newValue.gender,
          };
        }
        if (newValue.tgl) {
          updatedUserData = { ...updatedUserData, tglLahir: newValue.tgl };
        }
        if (newValue.alamat) {
          updatedUserData = { ...updatedUserData, alamat: newValue.alamat };
        }
        if (newValue.city) {
          updatedUserData = { ...updatedUserData, cities: newValue.city };
        }
        break;
      default:
        break;
    }

    console.log("Ini NewValue Gender  : ", newValue.gender);
    console.log("Ini updateUserData ke - 2 : ", updatedUserData);

    try {
      if (newValue.nama) {
        const querySnapshot = await getDocs(
          collection(firestore, "users"),
          where("friends", "array-contains", newValue.nama)
        );

        // Loop melalui hasil query
        querySnapshot.forEach(async (doc) => {
          const userRef = doc.ref;
          const userDataa = doc.data();

          if (
            userDataa &&
            userDataa.friends &&
            Array.isArray(userDataa.friends)
          ) {
            const friends = userDataa.friends;
            console.log("Friends:", friends);

            // Perbarui nama di friends jika ditemukan
            const updatedFriends = friends.map((name) =>
              name === userData.namaLengkap ? newValue.nama : name
            );
            console.log("UpdatedFriends:", updatedFriends);

            // Perbarui field friends di Firestore
            await updateDoc(userRef, { friends: updatedFriends });

            // Memeriksa apakah role user yang login adalah "Doctor"
            if (userData.role === "Doctor") {
              // Memperbarui field DoctorName di koleksi Appointments
              const appointmentsRef = collection(firestore, "Appointments");
              const appointmentsQuery = query(
                appointmentsRef,
                where("DoctorID", "==", userData.id)
              );

              const appointmentsSnapshot = await getDocs(appointmentsQuery);
              appointmentsSnapshot.forEach(async (appointmentDoc) => {
                const appointmentRef = appointmentDoc.ref;
                // Melakukan pembaruan pada field DoctorName
                await updateDoc(appointmentRef, { DoctorName: newValue.nama });
                console.log("DoctorName di Appointment diperbarui.");
              });
            }
          } else {
            console.log("Data teman tidak ditemukan atau tidak valid.");
          }
        });
      }

      console.log("Ini UpdateUserData: ", updatedUserData);

      const userDoc = doc(firestore, "users", userData.uid);
      await updateDoc(userDoc, updatedUserData);

      await AsyncStorage.setItem(
        "credentials",
        JSON.stringify(updatedUserData)
      );

      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error saving or updating data:", error);
    }
  };

  console.log(userData);
  const handleEditAndSave = async (field) => {
    if (field === "Telp") {
      setEditingTelp(!editingTelp);
    } else if (field === "Email") {
      setEditingEmail(!editingEmail);
    } else if (field === "Biodata") {
      if (editingNama) {
        if (nama.trim() === "") {
          Alert.alert(
            "Error",
            "Data nama lengkap tidak boleh kosong, harap di isi !"
          );
        } else {
          handleFieldChange("Biodata", {
            nama: nama,
            gender: gender,
            tgl: tglLahir,
            alamat: alamat,
            city: city,
          });
        }
      }
      setEditingNama(!editingNama);
      setEditingGender(!editingGender);
      setEditingTgl(!editingTgl);
      setEditingAlamat(!editingAlamat);
      setEditingCity(!editingCity);
    }
  };

  return (
    <ScrollView backgroundColor={activeColors.primary}>
      <Box flex={1} p={5}>
        <Text py={2} color={activeColors.tint}>
          Informasi data diri anda belum lengkap, silahkan lengkapi data diri
          anda.
        </Text>

        <Box mb={5} backgroundColor={activeColors.secondary}>
          <Box
            p={5}
            rounded={10}
            borderWidth={0.7}
            borderColor={activeColors.tint}
          >
            <Flex direction="column">
              <Box alignItems={"center"}>
                <Flex direction="row">
                  <HStack space={"56"}>
                    <Text mb={1.5} color={activeColors.tertiary} ml={16}>
                      No Telepone
                    </Text>
                    <TouchableOpacity onPress={() => handleEditAndSave("Telp")}>
                      <Text color={"#0082F7"} mr={16} ml={-16}>
                        {editingTelp ? "SIMPAN" : "UBAH"}
                      </Text>
                    </TouchableOpacity>
                  </HStack>
                </Flex>
              </Box>
              <Box alignItems={"center"}>
                <Flex direction="row">
                  {editingTelp ? (
                    <Input
                      variant={"unstyled"}
                      flex={1}
                      p={0}
                      mt={1}
                      mb={1}
                      fontSize={18}
                      value={userData?.phone}
                      onChangeText={(value) => handleFieldChange("Telp", value)}
                      color={activeColors.tint}
                    />
                  ) : (
                    <Text
                      flex={1}
                      mt={1.5}
                      pb={1.5}
                      fontSize={18}
                      color={activeColors.tint}
                    >
                      {loadingData ? (
                        <Spinner size="small" color="blue" />
                      ) : (
                        userData?.phone || ""
                      )}
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box mb={5} backgroundColor={activeColors.secondary}>
          <Box
            p={5}
            rounded={10}
            borderWidth={0.7}
            borderColor={activeColors.tint}
          >
            <Flex direction="column">
              <Box alignItems={"center"}>
                <Flex direction="row">
                  <HStack space={"56"}>
                    <Text mb={1.5} ml={4} color={activeColors.tertiary}>
                      Email
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleEditAndSave("Email")}
                    >
                      <Text color={"#0082F7"} ml={-4} mr={4}>
                        {editingEmail ? "SIMPAN" : "UBAH"}
                      </Text>
                    </TouchableOpacity>
                  </HStack>
                </Flex>
              </Box>
              <Box alignItems={"center"}>
                <Flex direction="row">
                  {editingEmail ? (
                    <Input
                      variant={"unstyled"}
                      flex={1}
                      p={0}
                      mt={1}
                      mb={1}
                      fontSize={18}
                      value={userData?.email}
                      onChangeText={(value) =>
                        handleFieldChange("Email", value)
                      }
                      color={activeColors.tint}
                    />
                  ) : (
                    <Text
                      flex={1}
                      mt={1.5}
                      pb={1.5}
                      fontSize={18}
                      color={activeColors.tint}
                    >
                      {loadingData ? (
                        <Spinner size="small" color="blue" />
                      ) : (
                        userData?.email || ""
                      )}
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box mb={5} backgroundColor={activeColors.secondary}>
          <Box
            p={5}
            rounded={10}
            borderWidth={0.7}
            borderColor={activeColors.tint}
          >
            <Flex direction="column">
              <Box mt={4}>
                <Flex direction="row">
                  <Box mr={32}>
                    <Flex direction="column">
                      <Box>
                        <Text mb={1.5} color={activeColors.tertiary}>
                          Tipe ID
                        </Text>
                      </Box>
                      <Box mr={-6}>
                        <Text
                          flex={1}
                          mt={1.5}
                          pb={1.5}
                          fontSize={18}
                          color={activeColors.tint}
                        >
                          {/* {userRole === "Doctor" ? "Doctor" : "Pasien"} */}
                          {loadingData ? (
                            <Spinner size="small" color="blue" />
                          ) : (
                            userRole || ""
                          )}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Box>
                    <Flex direction="column">
                      <Box>
                        <Text mb={1.5} color={activeColors.tertiary}>
                          No ID
                        </Text>
                      </Box>
                      <Box mr={-16}>
                        <Text
                          flex={1}
                          mt={1.5}
                          pb={1.5}
                          fontSize={18}
                          color={activeColors.tint}
                        >
                          {loadingData ? (
                            <Spinner size="small" color="blue" />
                          ) : (
                            userData?.id || ""
                          )}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box mb={5} backgroundColor={activeColors.secondary}>
          <Box
            p={5}
            rounded={10}
            borderWidth={0.7}
            borderColor={activeColors.tint}
          >
            <Flex direction="column">
              <Box alignItems={"center"}>
                <Flex direction="row">
                  <HStack space={"56"}>
                    <Text mb={1.5} color={activeColors.tertiary} ml={20}>
                      Nama Lengkap
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleEditAndSave("Biodata")}
                    >
                      <Text color={"#0082F7"} mr={20} ml={-20}>
                        {editingNama ? "SIMPAN" : "UBAH"}
                      </Text>
                    </TouchableOpacity>
                  </HStack>
                </Flex>
              </Box>
              <Box alignItems={"center"}>
                <Flex direction="row">
                  {editingNama ? (
                    <Input
                      variant={"unstyled"}
                      flex={1}
                      p={0}
                      mt={1}
                      mb={1}
                      fontSize={18}
                      // textTransform={"uppercase"}
                      value={nama}
                      onChangeText={(value) => setNama(value)}
                      color={activeColors.tint}
                    />
                  ) : (
                    <Text
                      flex={1}
                      mt={1.5}
                      pb={1.5}
                      fontSize={18}
                      textTransform={"uppercase"}
                      color={activeColors.tint}
                    >
                      {loadingData ? (
                        <Spinner size="small" color="blue" />
                      ) : (
                        nama || ""
                      )}
                    </Text>
                  )}
                </Flex>
              </Box>

              <Box mt={4}>
                <Flex direction="row">
                  <Box mr={20}>
                    <Flex direction="column">
                      <Box>
                        <Text mb={1.5} color={activeColors.tertiary}>
                          Jenis Kelamin
                        </Text>
                      </Box>
                      <Box mr={-6}>
                        {editingNama ? (
                          <Input
                            variant={"unstyled"}
                            flex={1}
                            p={0}
                            mt={1}
                            mb={1}
                            fontSize={18}
                            value={gender}
                            onChangeText={(value) => setGender(value)}
                            color={activeColors.tint}
                          />
                        ) : (
                          <Text
                            flex={1}
                            mt={1.5}
                            pb={1.5}
                            fontSize={18}
                            color={activeColors.tint}
                          >
                            {loadingData ? (
                              <Spinner size="small" color="blue" />
                            ) : (
                              gender || ""
                            )}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  <Box>
                    <Flex direction="column">
                      <Box>
                        <Text mb={1.5} color={activeColors.tertiary}>
                          Tanggal Lahir
                        </Text>
                      </Box>
                      <Box mr={-16}>
                        {editingNama ? (
                          <Input
                            variant={"unstyled"}
                            flex={1}
                            p={0}
                            mt={1}
                            mb={1}
                            fontSize={18}
                            value={tglLahir}
                            onChangeText={(value) => setTglLahir(value)}
                            color={activeColors.tint}
                          />
                        ) : (
                          <Text
                            flex={1}
                            mt={1.5}
                            pb={1.5}
                            fontSize={18}
                            color={activeColors.tint}
                          >
                            {loadingData ? (
                              <Spinner size="small" color="blue" />
                            ) : (
                              tglLahir || ""
                            )}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Box>

              <Box mt={4}>
                <Flex direction="row">
                  <Text mb={1.5} color={activeColors.tertiary}>
                    Alamat
                  </Text>
                </Flex>
              </Box>
              <Box>
                <Flex direction="row">
                  {editingNama ? (
                    <Input
                      variant={"unstyled"}
                      flex={1}
                      p={0}
                      mt={1}
                      mb={1}
                      fontSize={18}
                      // textTransform={"uppercase"}
                      value={alamat}
                      onChangeText={(value) => setAlamat(value)}
                      color={activeColors.tint}
                    />
                  ) : (
                    <Text
                      flex={1}
                      mt={1.5}
                      pb={1.5}
                      fontSize={18}
                      textTransform={"uppercase"}
                      color={activeColors.tint}
                    >
                      {loadingData ? (
                        <Spinner size="small" color="blue" />
                      ) : (
                        alamat || ""
                      )}
                    </Text>
                  )}
                </Flex>
              </Box>

              <Box mt={4}>
                <Flex direction="row">
                  <Text mb={1.5} color={activeColors.tertiary}>
                    Kota / Kabupaten
                  </Text>
                </Flex>
              </Box>
              <Box>
                <Flex direction="row">
                  {editingNama ? (
                    <Input
                      variant={"unstyled"}
                      flex={1}
                      p={0}
                      mt={1}
                      mb={1}
                      fontSize={18}
                      // textTransform={"uppercase"}
                      value={city}
                      onChangeText={(value) => setCity(value)}
                      color={activeColors.tint}
                    />
                  ) : (
                    <Text
                      flex={1}
                      mt={1.5}
                      pb={1.5}
                      fontSize={18}
                      textTransform={"uppercase"}
                      color={activeColors.tint}
                    >
                      {loadingData ? (
                        <Spinner size="small" color="blue" />
                      ) : (
                        city || ""
                      )}
                    </Text>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default MyProfileScreen;
