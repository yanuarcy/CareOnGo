import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Text, Input, ScrollView, Flex, HStack } from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../../../../firebase-config";
import { initializeApp } from "firebase/app";

const MyProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [editingTelp, setEditingTelp] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingNama, setEditingNama] = useState(false);
  const [editingGender, setEditingGender] = useState(false);
  const [editingTgl, setEditingTgl] = useState(false);
  const [editingAlamat, setEditingAlamat] = useState(false);
  const [editingCity, setEditingCity] = useState(false);

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    // Ambil data dari AsyncStorage saat komponen dipasang (mounted)
    AsyncStorage.getItem("credentials")
      .then((data) => {
        if (data) {
          const credentials = JSON.parse(data);
          setUserData(credentials);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleFieldChange = async (field, newValue) => {
    if (!userData || !userData.uid) {
      console.error("UserData is not defined or does not have a UID");
      return;
    }

    let updatedUserData = { ...userData };

    switch (field) {
      case "Telp":
        updatedUserData = { ...updatedUserData, phone: newValue };
        break;
      case "Email":
        updatedUserData = { ...updatedUserData, email: newValue };
        break;
      case "Biodata":
        if (newValue.nama) {
          updatedUserData = { ...updatedUserData, namaLengkap: newValue.nama };
        }
        if (newValue.gender) {
          updatedUserData = { ...updatedUserData, jenisKelamin: newValue.gender };
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

    setUserData(updatedUserData);

    try {
      await AsyncStorage.setItem(
        "credentials",
        JSON.stringify(updatedUserData)
      );
      const userDoc = doc(firestore, "users", userData.uid);
      await updateDoc(userDoc, updatedUserData);
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
                      {userData?.phone || ""}
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
                      {userData?.email || ""}
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
                          Pasien
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
                          {userData?.id || ""}
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
                      textTransform={"uppercase"}
                      value={userData?.namaLengkap}
                      onChangeText={(value) =>
                        handleFieldChange("Biodata", { nama: value })
                      }
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
                      {userData?.namaLengkap || ""}
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
                            value={userData?.jenisKelamin}
                            onChangeText={(value) =>
                              handleFieldChange("Biodata", { gender: value })
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
                            {userData?.jenisKelamin || ""}
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
                            value={userData?.tglLahir}
                            onChangeText={(value) => handleFieldChange("Biodata", { tgl: value })}
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
                            {userData?.tglLahir || ""}
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
                      textTransform={"uppercase"}
                      value={userData?.alamat}
                      onChangeText={(value) => handleFieldChange("Biodata", { alamat: value })}
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
                      {userData?.alamat || ""}
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
                      textTransform={"uppercase"}
                      value={userData?.cities}
                      onChangeText={(value) => handleFieldChange("Biodata", { city: value })}
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
                      {userData?.cities || ""}
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