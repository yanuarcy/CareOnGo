import {
  Box,
  Text,
  Center,
  Spacer,
  Stack,
  Input,
  Icon,
  Button,
  VStack,
  Pressable,
} from "native-base";
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../../firebase-config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from 'bcryptjs';

const DB = initializeApp(firebaseConfig);
const auth = getAuth(DB);
const firestore = getFirestore(DB);

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  // const handleCreateAccount = () => {
  //   createUserWithEmailAndPassword( auth, Email, Password)
  //   .then((userCredential) => {
  //     console.log("Account created!")
  //     const user = userCredential.user;
  //     console.log(user)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //   })
  // }

  const generateRandomID = () => {
    const min = 10000; // Minimal angka acak (4 digit)
    const max = 99999; // Maksimal angka acak (5 digit)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const createCustomID = () => {
    const prefix = "120"; // Angka yang akan disisipkan di depan ID
    const randomNumber = generateRandomID();
    const customID = `${prefix}${randomNumber}`;
    return customID;
  };
  const customID = createCustomID();

  const handleCreateAccount = async () => {
    try {
      // Simpan data pengguna ke AsyncStorage
      bcrypt.setRandomFallback((len) => {
        // Menghasilkan nilai acak (bisa menggunakan metode lain yang tersedia)
        const randomBytes = new Array(len);
        for (let i = 0; i < len; i++) {
          randomBytes[i] = Math.floor(Math.random() * 256);
        }
        return randomBytes;
      });

      // const saltRounds = 10; // Jumlah putaran enkripsi
      const salt = bcrypt.genSaltSync(10);

      // Enkripsi password sebelum menyimpannya
      const hashedPassword = bcrypt.hashSync(Password, salt);

      // Simpan data pengguna ke Firebase Authentication
      await createUserWithEmailAndPassword(auth, Email, hashedPassword);

      // Simpan informasi tambahan ke Firestore
      const userCollection = collection(firestore, "users");
      const newUser = {
        id: customID.toString(),
        name: Name,
        email: Email,
        phone: Phone,
        password: hashedPassword,
        namaLengkap: Name,
        jenisKelamin: "",
        tglLahir: "",
        alamat: "",
        cities: "",
      };

      const newDoc = await addDoc(userCollection, newUser);
      const uid = newDoc.id;
      console.log(uid);

      const userDocRef = doc(userCollection, uid);
      await setDoc(userDocRef, { ...newUser, uid: uid });

      const userData = {
        id: customID.toString(),
        name: Name,
        email: Email,
        phone: Phone,
        password: Password,
        namaLengkap: Name,
        jenisKelamin: "",
        tglLahir: "",
        alamat: "",
        cities: "",
        uid: uid,
      };

      AsyncStorage.setItem("credentials", JSON.stringify(userData))
        .then(() => {
          Alert.alert("Success", "Akun anda berhasil login");
          navigation.replace("Tabs");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Error", "Gagal menyimpan kredensial");
        });

      return;
      // return user;
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal membuat akun");
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <Box flex={1}>
        <Center>
          <Spacer mt="8">
            <Text fontSize={32} color={"#0082f7"} fontWeight={"bold"}>
              Create Account
            </Text>
          </Spacer>
          <Spacer mt="6">
            <Text
              fontSize={16}
              maxW={250}
              textAlign={"center"}
              fontWeight={"bold"}
            >
              Create an Account, Cherish Your Health
            </Text>
          </Spacer>

          <Spacer p="18" mt="5">
            <Stack space={4} w="100%" alignItems="center">
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon
                    as={MaterialIcons}
                    name="person"
                    size={5}
                    ml="2"
                    color="black"
                  />
                }
                value={Name}
                onChangeText={(Name) => setName(Name)}
                placeholder="Name"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() => setName(!Name)}
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon
                    as={Ionicons}
                    name="at-outline"
                    size={5}
                    ml="2"
                    color="black"
                  />
                }
                value={Email}
                onChangeText={(Email) => setEmail(Email)}
                placeholder="Email"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() => setEmail(!Email)}
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon
                    as={Ionicons}
                    name="call-outline"
                    size={5}
                    ml="2"
                    color="black"
                  />
                }
                value={Phone}
                onChangeText={(Phone) => setPhone(Phone)}
                placeholder="Phone"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() => setPhone(!Phone)}
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                type={showPassword ? "text" : "password"}
                InputLeftElement={
                  <Icon
                    as={MaterialIcons}
                    name="lock"
                    size={5}
                    ml="2"
                    color={"black"}
                  />
                }
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={MaterialIcons}
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={5}
                      mr="2"
                      color="black"
                    />
                  </Pressable>
                }
                value={Password}
                onChangeText={(Password) => setPassword(Password)}
                placeholder="Password"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() => setPassword(!Password)}
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                type={showPassword ? "text" : "password"}
                InputLeftElement={
                  <Icon
                    as={MaterialIcons}
                    name="lock"
                    size={5}
                    ml="2"
                    color={"black"}
                  />
                }
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={MaterialIcons}
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={5}
                      mr="2"
                      color="black"
                    />
                  </Pressable>
                }
                value={ConfirmPassword}
                onChangeText={(ConfirmPassword) =>
                  setConfirmPassword(ConfirmPassword)
                }
                placeholder="Confirm Password"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() => setConfirmPassword(!ConfirmPassword)}
              />
            </Stack>
          </Spacer>
        </Center>
        <TouchableOpacity
          style={{
            margin: 26,
            padding: 14,
            backgroundColor: "#0082f7",
            marginVertical: 20,
            borderRadius: 10,
            elevation: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
          // onPress={() => handleRegister(Name, Email, Phone,Password,ConfirmPassword)}
          onPress={() => handleCreateAccount()}
        >
          <Text
            color={"white"}
            textAlign={"center"}
            fontSize={18}
            fontWeight={"bold"}
          >
            Sign Up
          </Text>
        </TouchableOpacity>

        <Center>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text
              fontWeight={"bold"}
              colorScheme={"light"}
              fontSize={16}
              mt={2}
              mb={6}
            >
              Already have an account
            </Text>
          </TouchableOpacity>
        </Center>
        <Center>
          <Spacer>
            <Text fontSize={16} color={"blue.700"} fontWeight={"bold"}>
              Or continue with
            </Text>
          </Spacer>
        </Center>
        <Center>
          <Box>
            <Stack
              direction={{
                base: "row",
                md: "row",
              }}
              space={4}
              mt={2}
            >
              <Button
                variant="outline"
                leftIcon={
                  <Icon
                    as={Ionicons}
                    name="logo-google"
                    size="md"
                    color="gray"
                    colorScheme="light"
                  />
                }
              ></Button>
              <Button
                variant="outline"
                endIcon={
                  <Icon
                    as={Ionicons}
                    name="logo-apple"
                    size="md"
                    color="gray"
                    colorScheme="light"
                  />
                }
              ></Button>
              <Button
                variant="outline"
                endIcon={
                  <Icon
                    as={Ionicons}
                    name="logo-facebook"
                    size="md"
                    color="gray"
                    colorScheme="light"
                  />
                }
              ></Button>
            </Stack>
          </Box>
        </Center>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default RegisterScreen;
