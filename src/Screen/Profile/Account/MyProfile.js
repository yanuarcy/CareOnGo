import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Text, Input, ScrollView, Flex, HStack } from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
// import { ThemeContext } from "../../../components/themeContext";
// import colors from "../../../components/theme";

const MyProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [telp, setTelp] = useState("+628123456789");
  const [email, setEmail] = useState("mathew@gmail.com");
  const [nama, setNama] = useState("Mathew Renandra");
  const [Gender, setGender] = useState("Laki-Laki");
  const [Tgl, setTgl] = useState("17 April 2008");
  const [Alamat, setAlamat] = useState(
    "Jl. Gayungan, Surabaya, Jawa Timur, Indonesia"
  );
  const [City, setCity] = useState("Kabupaten Surabaya");

  const [editingTelp, setEditingTelp] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingNama, setEditingNama] = useState(false);
  const [editingGender, setEditingGender] = useState(false);
  const [editingTgl, setEditingTgl] = useState(false);
  const [editingAlamat, setEditingAlamat] = useState(false);
  const [editingCity, setEditingCity] = useState(false);

  const [newTelp, setNewTelp] = useState(telp);
  const [newEmail, setNewEmail] = useState(email);
  const [newNama, setNewNama] = useState(nama);
  const [newGender, setNewGender] = useState(Gender);
  const [newTgl, setNewTgl] = useState(Tgl);
  const [newAlamat, setNewAlamat] = useState(Alamat);
  const [newCity, setNewCity] = useState(City);

  const handleEditAndSave = (field) => {
    if (field === "Telp") {
      if (editingTelp) {
        setTelp(newTelp);
      }
      setEditingTelp(!editingTelp);
    } else if (field === "Email") {
      if (editingEmail) {
        setEmail(newEmail);
      }
      setEditingEmail(!editingEmail);
    } else if (field === "Biodata") {
      if (editingNama) {
        setNama(newNama);
        setGender(newGender);
        setTgl(newTgl);
        setAlamat(Alamat);
        setCity(City);
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
                      value={newTelp}
                      onChangeText={setNewTelp}
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
                      {telp}
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
                      value={newEmail}
                      onChangeText={setNewEmail}
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
                      {email}
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
                          00521
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
          <Box p={5} rounded={10} borderWidth={0.7} borderColor={activeColors.tint}>
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
                      value={newNama}
                      onChangeText={setNewNama}
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
                      {nama}
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
                            value={newGender}
                            onChangeText={setNewGender}
                            color={activeColors.tint}
                          />
                        ) : (
                          <Text flex={1} mt={1.5} pb={1.5} fontSize={18} color={activeColors.tint}>
                            {Gender}
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
                            value={newTgl}
                            onChangeText={setNewTgl}
                            color={activeColors.tint}
                          />
                        ) : (
                          <Text flex={1} mt={1.5} pb={1.5} fontSize={18} color={activeColors.tint}>
                            {Tgl}
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
                      value={newAlamat}
                      onChangeText={setNewAlamat}
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
                      {Alamat}
                    </Text>
                  )}
                </Flex>
              </Box>

              <Box mt={4}>
                <Flex direction="row">
                  <Text mb={1.5} color={activeColors.tertiary}>Kota / Kabupaten</Text>
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
                      value={newCity}
                      onChangeText={setNewCity}
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
                      {City}
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