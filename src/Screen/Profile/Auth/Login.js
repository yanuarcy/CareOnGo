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
} from "native-base";
import {
  TouchableOpacity,
  Pressable,
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
  getDocs,
  collection,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Base64 } from "js-base64";
import moment from "moment";

const DB = initializeApp(firebaseConfig);
const auth = getAuth(DB);
const firestore = getFirestore(DB);

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const encrypt = (text, shift) => {
    let result = "";
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

  const compare = (text, encryptedText, shift) => {
    const decryptedText = decrypt(encryptedText, shift);
    return text === decryptedText;
  };

  const handleSignIn = async () => {
    try {
      // Dapatkan data pengguna dari Firestore
      const usersCollection = collection(firestore, "users");
      const queryByEmail = query(
        usersCollection,
        where("email", "==", emailOrUsername)
      );
      const snapshotByEmail = await getDocs(queryByEmail);

      // Query kedua untuk mencari berdasarkan nama
      const queryByUsername = query(
        usersCollection,
        where("username", "==", emailOrUsername)
      );
      const snapshotByUsername = await getDocs(queryByUsername);

      // Gabungkan hasil kedua query
      const combinedSnapshot = snapshotByEmail.docs.concat(
        snapshotByUsername.docs
      );

      // Periksa apakah ada hasil dari kombinasi query
      if (combinedSnapshot.length > 0) {
        // Lakukan verifikasi data, misalnya verifikasi password
        combinedSnapshot.forEach(async (doc) => {
          const userData = doc.data();
          const hashedPassword = userData.password;

          const DataRekamMedis = collection(firestore, "RekamMedis");
          const DataAppointments = collection(firestore, "Appointments");
          // const querySnapshot = await getDocs(
          //   query(DataRekamMedis, where("PasienID", "==", userData.id))
          // );

          const queryByPatient = query(
            DataRekamMedis,
            where("PasienID", "==", userData.id)
          );
          const queryByDoctor = query(
            DataRekamMedis,
            where("NamaDokter", "==", userData.namaLengkap)
          );

          const snapshotByPatient = await getDocs(queryByPatient);
          const snapshotByDoctor = await getDocs(queryByDoctor);

          const combinedPatientDoc = snapshotByPatient.docs.concat(
            snapshotByDoctor.docs
          );

          const medicalRecords = [];

          combinedPatientDoc.forEach(async (doc) => {
            const DataRekamMedis = doc.data();
            console.log("data Rekam Medis:", DataRekamMedis);

            const convertTimestampToISOString = (timestamp) => {
              const milliseconds =
                timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
              const date = new Date(milliseconds);
              return date.toISOString(); // Mengembalikan tanggal dalam format ISO (misal: "2023-12-29T22:43:04.298Z")
            };

            const convertedDate = convertTimestampToISOString(
              DataRekamMedis.tanggal
            );

            const RekamMedis = {
              RekamMedisID: DataRekamMedis.RekamMedisID,
              PasienID: DataRekamMedis.PasienID,
              JenisPoli: DataRekamMedis.JenisPoli,
              NamaDokter: DataRekamMedis.NamaDokter,
              tanggal: convertedDate,
              Keluhan: DataRekamMedis.Keluhan,
              Diagnosis: DataRekamMedis.Diagnosis,
              SaranPerawatan: DataRekamMedis.SaranPerawatan,
              ResepObat: DataRekamMedis.ResepObat,
              NamaClinic: DataRekamMedis.NamaClinic,
            };

            console.log("RekamMedis: ", RekamMedis);
            medicalRecords.push(RekamMedis);

            console.log("medicalRecords: ", medicalRecords);
            AsyncStorage.setItem(
              "MedicalRecord",
              JSON.stringify(medicalRecords)
            )
              .then(() => {
                console.log(
                  "Data Rekam Medis berhasil di tambahkan ke AsyncStorage"
                );
              })
              .catch((error) => {
                console.log(error);
                // Alert.alert("Error", "Gagal menyimpan kredensial");
              });
          });

          console.log(userData.AppointmentID);

          const queryAppointmentID = query(
            DataAppointments,
            where("PasienID", "==", userData.id)
          );

          const snapshotByAppointmentID = await getDocs(queryAppointmentID);

          const userQuerySnapshot = await getDocs(
            query(usersCollection, where("id", "==", userData.id))
          );

          let appointmentsRecords = [];
           
          // if(userQuerySnapshot.empty) {
          //   AsyncStorage.setItem(
          //       "AppointmentData",
          //       JSON.stringify(appointmentsRecords)
          //     )
          //       .then(() => {
          //         console.log(
          //           "Data Appointment berhasil di tambahkan ke AsyncStorage"
          //         );
          //         console.log(appointmentsRecords);
          //       })
          //       .catch((error) => {
          //         console.log(error);
          //         // Alert.alert("Error", "Gagal menyimpan kredensial");
          //       });
          // }
          if (!userQuerySnapshot.empty) {
            userQuerySnapshot.forEach(async (doc) => { 
              const userData = doc.data();
              console.log("userData: ", userData);
              const appointmentIDs = userData.AppointmentID;
              
              const appointmentQueries = appointmentIDs.map((id) =>
                getDocs(query(DataAppointments, where("AppointmentID", "==", id)))
              );

              const appointmentsSnapshots = await Promise.all(appointmentQueries);
            
              appointmentsSnapshots.forEach((snap) => {
                snap.forEach((doc) => {
                  const appointmentData = doc.data();
                  console.log("Ini appointment after query:", appointmentData);
                  appointmentsRecords.push(appointmentData);
                });
              });
              AsyncStorage.setItem(
                "AppointmentData",
                JSON.stringify(appointmentsRecords)
              )
                .then(() => {
                  console.log(
                    "Data Appointment berhasil di tambahkan ke AsyncStorage"
                  );
                  console.log(appointmentsRecords);
                })
                .catch((error) => {
                  console.log(error);
                  // Alert.alert("Error", "Gagal menyimpan kredensial");
                });
            })
          
          }

          try {
            console.log("From DB: ", hashedPassword);
            const Decodetext = Base64.decode(hashedPassword);
            console.log("After Decode: ", Decodetext);
            const passwordMatch = compare(password, Decodetext, 3);

            if (passwordMatch) {
              // Login berhasil
              const credentials = {
                id: userData.id,
                RekamMedisID: userData.RekamMedisID,
                AppointmentID: userData.AppointmentID,
                email: userData.email,
                username: userData.username,
                namaLengkap: userData.namaLengkap,
                password: userData.password,
                phone: userData.phone,
                jenisKelamin: userData.jenisKelamin,
                tglLahir: userData.tglLahir,
                alamat: userData.alamat,
                cities: userData.cities,
                role: userData.role,
                picture: userData.picture,
                uid: doc.id,
                loginTime: new Date().getTime(),
              };

              AsyncStorage.setItem("credentials", JSON.stringify(credentials))
                .then(() => {
                  // Alert.alert("Success", "Akun anda berhasil login");
                  navigation.replace("Tabs");
                })
                .catch((error) => {
                  console.log(error);
                  Alert.alert("Error", "Gagal menyimpan kredensial");
                });

              return;
            } else {
              Alert.alert("Error", "Email/username atau password salah");
            }
          } catch (error) {
            console.error(error);
            Alert.alert(
              "Error",
              "Terjadi kesalahan saat membandingkan password"
            );
          }
        });
      } else {
        // Jika tidak ditemukan email atau nama yang cocok
        Alert.alert("Error", "Email/username/nama tidak ditemukan");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal login");
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <Box flex={1}>
        <Center>
          <Spacer mt="20">
            <Text fontSize={32} color={"#0082f7"} fontWeight={"bold"}>
              Login here
            </Text>
          </Spacer>
          <Spacer mt="6">
            <Text
              fontSize={20}
              maxW={250}
              textAlign={"center"}
              fontWeight={"bold"}
            >
              Welcome back, you've been missed!
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
                placeholder="Email or Username"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                value={emailOrUsername}
                onChangeText={(emailOrUsername) =>
                  setEmailOrUsername(emailOrUsername)
                }
              />

              <Input
                value={password}
                onChangeText={(password) => setPassword(password)}
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
                placeholder="Password"
                placeholderTextColor={"black"}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
              />
            </Stack>
          </Spacer>
        </Center>
        <Box mt={3} mr={7} alignItems="flex-end">
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPass")}>
            <Text
              fontSize={14}
              variant={"link"}
              fontWeight={"bold"}
              color={"#0082f7"}
            >
              Forgot your password?
            </Text>
          </TouchableOpacity>
        </Box>
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
          // onPress={() => handleLogin(emailOrUsername, password)}
          onPress={() => handleSignIn()}
        >
          <Text
            color={"white"}
            textAlign={"center"}
            fontSize={18}
            fontWeight={"bold"}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        <Center>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text
              fontWeight={"bold"}
              colorScheme={"light"}
              fontSize={16}
              mt={2}
              mb={10}
            >
              Create a new account
            </Text>
          </TouchableOpacity>
        </Center>
        {/* <Center>
          <Spacer mt="36">
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
        </Center> */}
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;
