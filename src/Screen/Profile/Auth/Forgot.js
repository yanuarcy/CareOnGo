import React, { useEffect, useState } from "react";
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
// import * as firebase from "firebase";
import * as MailComposer from "expo-mail-composer";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../../firebase-config";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { Base64 } from "js-base64"; 


// ...

// import SvgIcon from '../common/assets/images/SvgIcon';

const ForgotPasswordScreen = ({ navigation }) => {
  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );

  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [email, setEmail] = useState("");

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
  
  // Fungsi Dekripsi untuk metode penggeseran karakter (caesar cipher)
  const decrypt = (text, shift) => {
    return encrypt(text, (26 - shift) % 26);
  };

  // function generateNewPassword() {
  //   const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //   const symbols = "@#";
  //   const numbers = "0123456789";

  //   const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  //   const letterLength = Math.random() > 0.5 ? 5 : 6;
  //   const numLength = letterLength === 5 ? 2 : 1;

  //   let newPassword = symbol;

  //   for (let i = 0; i < letterLength; i++) {
  //     const randomIndex = Math.floor(Math.random() * letters.length);
  //     newPassword += letters[randomIndex];
  //   }

  //   for (let i = 0; i < numLength; i++) {
  //     const randomIndex = Math.floor(Math.random() * numbers.length);
  //     newPassword += numbers[randomIndex];
  //   }

  //   return newPassword;
  // }

  const handleForgotButton = async (email) => {
    if (email.trim() === "") {
      Alert.alert("Error", "Mohon isi Email terlebih dahulu");
    } else {
      try {

        const usersCollection = collection(firestore, "users");
        const queryByEmail = query(
          usersCollection,
          where("email", "==", email)
        );
        const snapshotByEmail = await getDocs(queryByEmail);

        if (snapshotByEmail.empty) {
          Alert.alert("Error", "Email tidak terdaftar");
        }

        let password = "";

        snapshotByEmail.forEach((doc) => {
          const userData = doc.data();
          // console.log(userData);
          const decodePass = Base64.decode(userData.password);
          const decryptedPass = decrypt(decodePass, 3);

          // 2. Kirim email dengan password yang ditemukan
          // await MailComposer.composeAsync({
          //   recipients: [email],
          //   subject: "Forgot Password CareOnGo",
          //   body: `Terimakasih sudah mengirimkan request forgot password kepada kami dan sabar menunggu respon dari kami. ini adalah password baru kamu, Password : ${password} dimohon untuk berhati-hati terhadap password anda karena ini merupakan privasi, dan untuk lebih di ingat-ingat lagi untuk kedepannya. Terimakasih`,
          // });

          const serviceId = "service_ngo3tdh";
          const templateId = "template_m29j3ql";
          const publicKey = "j00igohsXtNjDq6rv";

          const templateParams = {
            from_name: "CareOnGo Team",
            from_email: "yanuarcahyo567@gmail.com",
            to_name: userData.name,
            to_email: email,
            message: `Password lama kamu: ${decryptedPass}`,
          };

          emailjs
            .send(serviceId, templateId, templateParams, publicKey)
            .then((response) => {
              console.log("Email sent successfully !", response);
              console.log(userData);
              Alert.alert("Success", "Email berhasil dikirim");
              navigation.navigate("Login");
            })
            .catch((error) => {
              console.log("Error sending email: ", error);
            });

        });
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Gagal mengirim email. Silakan coba lagi.");
      }
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
          <Box flex={1} backgroundColor="#fff">
            <Box>
              <Center>
                <Box>
                  <Image
                    source={require("../../../../assets/images/forgot.png")}
                    alt="Welcome Image"
                    resizeMode="contain"
                    style={{
                      width: windowDimensions.width * 1,
                      height: windowDimensions.height * 0.4,
                    }}
                  />
                </Box>
                <Box paddingHorizontal={20}>
                  <Box mb={15}>
                    <Text color="#000" fontWeight={900} fontSize={45}>
                      Forgot Password?
                    </Text>
                  </Box>
                  <Box mb>
                    <Text color="#000">
                      Don't worry! It happens, please enter the address
                      associated with your account
                    </Text>
                  </Box>
                  <Box mt={6}>
                    <Input
                      w={{
                        base: "95%",
                        md: "25%",
                      }}
                      InputLeftElement={
                        <Icon
                          as={Ionicons}
                          name="at-outline"
                          size={7}
                          ml="2"
                          color="black"
                        />
                      }
                      value={email}
                      onChangeText={(email) => setEmail(email)}
                      placeholder="Email"
                      placeholderTextColor={"black"}
                      backgroundColor={"#E4F1FF"}
                      borderWidth={0}
                      rounded={6}
                      fontSize={16}
                    />
                  </Box>
                  <Box paddingTop={20} mb={16}>
                    <TouchableOpacity
                      style={{
                        width: "95%",
                        backgroundColor: "#0082f7",
                        borderRadius: 12,
                      }}
                      onPress={() => handleForgotButton(email)}
                      // onPress={() => sendEmail()}
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
                  </Box>
                </Box>
              </Center>
            </Box>
          </Box>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
