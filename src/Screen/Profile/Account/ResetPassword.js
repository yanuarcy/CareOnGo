import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  Pressable,
  Input,
  Box,
  Center,
  Image,
  Icon,
  ScrollView,
  KeyboardAvoidingView,
} from "native-base";
import {
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import {
  getDocs,
  collection,
  query,
  where,
  getFirestore,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../../firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base64 } from "js-base64"; 

// import SvgIcon from '../common/assets/images/SvgIcon';

const ResetPasswordScreen = ({ navigation }) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const encrypt = (text, shift) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char.match(/[a-z]/i)) {
        let code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }
      result += char;
    }
    return result;
  };
  
  const decrypt = (text, shift) => {
    return encrypt(text, (26 - shift) % 26);
  };
  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );

  const [userDataa, setUserDataa] = useState(null);
  useEffect(() => {
    // Ambil data dari AsyncStorage saat komponen dipasang (mounted)
    AsyncStorage.getItem("credentials")
      .then((data) => {
        if (data) {
          const credentials = JSON.parse(data);
          setUserDataa(credentials);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleResetButton = async (
    currentPassword,
    newPassword,
    newPassword2
  ) => {
    if (
      currentPassword.trim() === "" ||
      newPassword.trim() === "" ||
      newPassword2.trim() === ""
    ) {
      Alert.alert("Error", "Mohon isi semua kolom password.");
      return;
    }
  
    try {
      console.log(userDataa);
      // 1. Verifikasi Password Saat Ini
      const userId = userDataa.uid;
      const userCollection = collection(firestore, "users");
      const userDocRef = doc(userCollection, userId);
      const hashedPasswordFromDB = userDataa.password;
      const passwordMatch = query(
        userCollection,
        where("password", "==", hashedPasswordFromDB)
      );
      const snapshotByPassword = await getDocs(passwordMatch);
  
      if (snapshotByPassword.empty) {
        Alert.alert("Error", "Password saat ini tidak cocok.");
        return;
      }
  
      // Decode password (mengubah password menjadi enkripsi)
      console.log("From DB: ", hashedPasswordFromDB);
      const Decodetext = Base64.decode(hashedPasswordFromDB);
      console.log("After Decode: ", Decodetext);
  
      // Compare password ( mengcompare password)
      const compare = (text, encryptedText, shift) => {
        const decryptedText = decrypt(encryptedText, shift);
        return text === decryptedText;
      };
  
      const passwordMatch2 = compare(currentPassword, Decodetext, 3);
  
      if (!passwordMatch2) {
        Alert.alert("Error", "Password saat ini tidak cocok.");
        return;
      }
  
      // 2. Simpan Password Baru yang Terenkripsi
      if (newPassword !== newPassword2) {
        Alert.alert(
          "Error",
          "Password baru dan konfirmasi password tidak cocok."
        );
        return;
      }
  
      // Enkripsi password baru
      const shiftAmount = 3;
      const encryptedPassword = encrypt(newPassword, shiftAmount);
      const hashedNewPassword = Base64.encode(encryptedPassword);
  
      // Update password baru yang terenkripsi ke Firestore
      await updateDoc(userDocRef, { password: hashedNewPassword });
  
      Alert.alert("Success", "Password Anda berhasil direset");
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Gagal mereset password. Silakan coba lagi.");
    }
  };
  
  
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions(Dimensions.get("window"));
    };

    // Tambahkan event listener untuk memantau perubahan dimensi layar
    Dimensions.addEventListener("change", updateDimensions);

    return () => {
      // Hapus event listener saat komponen unmount
      // Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);
  return (
    <KeyboardAvoidingView behavior="position" h={{ base: "800" }}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Box flex={1} backgroundColor={activeColors.primary}>
            <Box>
              <Center>
                <Box>
                  <Image
                    source={require("../../../../assets/images/reset.png")}
                    alt="Welcome Image"
                    resizeMode="contain"
                    style={{
                      width: windowDimensions.width * 1,
                      height: windowDimensions.height * 0.3,
                    }}
                  />
                </Box>
              </Center>
              <Box p={4} flexDirection="row" alignItems="center">
                <Text
                  color={activeColors.tint}
                  fontWeight={900}
                  fontSize={45}
                  alignSelf="flex-start"
                >
                  Reset{"\n"}Password
                </Text>
              </Box>
              {/* <Center> */}
              <Box>
                <Box mt={2}>
                  <Center>
                    <Input
                      w={{
                        base: "85%",
                        md: "25%",
                      }}
                      InputLeftElement={
                        <Icon
                          as={MaterialIcons}
                          name="lock"
                          size={7}
                          ml="2"
                          color="black"
                        />
                      }
                      value={currentPassword}
                      onChangeText={(currentPassword) =>
                        setCurrentPassword(currentPassword)
                      }
                      placeholder="Current Password"
                      placeholderTextColor={"gray.600"}
                      backgroundColor={"#E4F1FF"}
                      borderWidth={0}
                      rounded={6}
                      fontSize={16}
                      mb={4}
                    />
                    <Input
                      w={{
                        base: "85%",
                        md: "25%",
                      }}
                      type={showPassword ? "text" : "password"}
                      InputLeftElement={
                        <Icon
                          as={MaterialIcons}
                          name="lock"
                          size={7}
                          ml="2"
                          color="black"
                        />
                      }
                      InputRightElement={
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            as={MaterialIcons}
                            name={
                              showPassword ? "visibility" : "visibility-off"
                            }
                            size={5}
                            mr="2"
                            color="black"
                          />
                        </Pressable>
                      }
                      value={newPassword}
                      onChangeText={(newPassword) =>
                        setNewPassword(newPassword)
                      }
                      placeholder="New Password"
                      placeholderTextColor={"gray.600"}
                      backgroundColor={"#E4F1FF"}
                      borderWidth={0}
                      rounded={6}
                      fontSize={16}
                      mb={4}
                    />
                    <Input
                      w={{
                        base: "85%",
                        md: "25%",
                      }}
                      type={showConfirmPassword ? "text" : "password"}
                      InputLeftElement={
                        <Icon
                          as={MaterialIcons}
                          name="lock"
                          size={7}
                          ml="2"
                          color="black"
                        />
                      }
                      InputRightElement={
                        <Pressable
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <Icon
                            as={MaterialIcons}
                            name={
                              showConfirmPassword
                                ? "visibility"
                                : "visibility-off"
                            }
                            size={5}
                            mr="2"
                            color="black"
                          />
                        </Pressable>
                      }
                      value={newPassword2}
                      onChangeText={(newPassword2) =>
                        setNewPassword2(newPassword2)
                      }
                      placeholder="Confirm Password"
                      placeholderTextColor={"gray.600"}
                      backgroundColor={"#E4F1FF"}
                      borderWidth={0}
                      rounded={6}
                      fontSize={16}
                    />
                  </Center>
                </Box>
                <Box paddingTop={16} mb={16}>
                  <Center>
                    <TouchableOpacity
                      style={{
                        width: "85%",
                        backgroundColor: "#0082f7",
                        borderRadius: 12,
                      }}
                      onPress={() =>
                        handleResetButton(
                          currentPassword,
                          newPassword,
                          newPassword2
                        )
                      }
                    >
                      <Text
                        textAlign="center"
                        fontSize={16}
                        // fontFamily="NotoSansBlack"
                        color="#fff"
                        py={3}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </Center>
                </Box>
              </Box>
              {/* </Center> */}
            </Box>
          </Box>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;