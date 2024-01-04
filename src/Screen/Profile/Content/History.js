import { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Box,
  ScrollView,
  Text,
  Center,
  Image,
  Icon,
  FlatList,
} from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "../../../../firebase-config";
import { initializeApp } from "firebase/app";
import LottieView from "lottie-react-native";

// import colors from "../component/theme";
// import { ThemeContext } from "../component/themeContext";

const HistoryScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [groupedMedicalRecords, setGroupedMedicalRecords] = useState([]);

  const fetchDataMedical = async () => {
    try {
      const credentials = await AsyncStorage.getItem("credentials");
      const user = JSON.parse(credentials);
      setUserData(user);
      setUserRole(user.role);

      const medicalRecords = await AsyncStorage.getItem("MedicalRecord");
      console.log("Medical Records : ", medicalRecords);
      if (medicalRecords !== null) {
        const parsedRecords = JSON.parse(medicalRecords);

        // console.log("UserRole: ", user.role);
        if (user.role === "Doctor") {
          const usersCollection = collection(firestore, "users");
          const updatedRecords = await Promise.all(
            parsedRecords.map(async (record) => {
              const PasienId = record.PasienID;
              console.log("Data Record nih : ", record);
              console.log("Apakah ini ebetul Pasien Id ?", PasienId);

              const querySnapshot = await getDocs(
                query(usersCollection, where("id", "==", PasienId))
              );

              querySnapshot.forEach((doc) => {
                const DataPasien = doc.data();
                console.log("Ini Data Pasien : ", DataPasien);
                if (record.PasienID === DataPasien.id) {
                  record.PasienData = DataPasien;
                }
              });

              return record;
            })
          );

          // console.log("Ini UpdatedRecords: ", updatedRecords)
          const sortedRecords = updatedRecords.sort((a, b) => {
            const dateA = new Date(a.tanggal.split(" ").reverse().join("-"));
            const dateB = new Date(b.tanggal.split(" ").reverse().join("-"));
            return dateB - dateA; // Urutkan dari tanggal terbaru ke yang lebih lama
          });

          const groupedRecords = groupMedicalRecordsByDate(sortedRecords);
          // groupedRecords.sort(compareDates);
          // const sortedRecords = sortRecordsByDate(groupedRecords);
          setGroupedMedicalRecords(groupedRecords);
        } else {
          const recordsArray = Array.isArray(parsedRecords)
            ? parsedRecords
            : [parsedRecords];
          const groupedRecords = groupMedicalRecordsByDate(recordsArray);
          setGroupedMedicalRecords(groupedRecords);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }

      // await AsyncStorage.removeItem("MedicalRecord");
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDataMedical();
    }
  }, [isFocused]);

  const groupMedicalRecordsByDate = (records) => {
    const grouped = records.reduce((result, record) => {
      const date = formatDate(record.tanggal);
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(record);
      console.log("Ini data record: ", record);
      return result;
    }, {});

    const groupedArray = Object.keys(grouped).map((date) => ({
      date,
      records: grouped[date],
    }));

    return groupedArray;
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  return (
    <Box margin={4} position={"relative"}>
      {/* Header bagian tanggal */}
      {/* <Icon as={Ionicons} name="ellipse" size={5} ml="2" color="#65B741" /> */}
      {userRole === "Doctor" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("RecordForm")}
          style={{
            position: "absolute",
            top: -5,
            right: 5,
            zIndex: 1,
          }}
        >
          <Box backgroundColor={"#0082f7"} p={2} rounded={20}>
            <Icon as={Ionicons} name="add" size={6} color={"white"} />
          </Box>
        </TouchableOpacity>
      )}
      {isLoading ? (
        <Center flex={1} justifyContent={"center"}>
          {/* <Spinner size="lg" color={"black"} /> */}
          <LottieView
            style={{
              width: 70,
              height: 170,
              marginTop: 200,
            }}
            source={require("../../../../assets/LoadingAnimation.json")}
            autoPlay
            loop={true}
            speed={1.5}
          />
        </Center>
      ) : groupedMedicalRecords.length === 0 ? (
        <>
          <Center flex={1} justifyContent={"center"}>
            {/* <Spinner size="lg" color={"black"} /> */}
            <LottieView
              style={{
                width: 70,
                height: 170,
                marginTop: 200,
              }}
              source={require("../../../../assets/EmptyAnimation.json")}
              autoPlay
              loop={true}
              speed={1.3}
            />
          </Center>
          <Text style={{ textAlign: "center", fontSize: 18, marginTop: 400 }}>
            Maaf, tidak ada data riwayat
          </Text>
        </>
      ) : (
        <FlatList
          data={groupedMedicalRecords}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Box mb={4}>
              {/* Tampilan untuk tanggal */}
              <Box
                position="absolute"
                left={4}
                top={7}
                width={1} // Atur lebar garis
                height="90%" // Panjang garis sesuai tinggi kontainer
                // mb={16}
                borderStyle="dashed"
                borderWidth={2} // Atur lebar border sesuai kebutuhan
                borderColor="black" // Warna border (dapat disesuaikan)
              />

              <Box flexDirection="row" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="ellipse"
                  size={5}
                  ml="2"
                  color="#65B741"
                />
                <Box
                  flex={1}
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  padding={2}
                >
                  <Text>{item.date}</Text>
                </Box>
              </Box>
              {/* Tampilan untuk setiap rekam medis */}
              {item.records.map((record, index) => (
                <Box
                  key={index.toString()}
                  // p={4}
                  // borderWidth={1}
                  // borderColor="gray.300"
                  // borderRadius={8}
                  mb={2}
                >
                  {/* Ganti dengan komponen untuk menampilkan detail rekam medis */}
                  <Box
                    padding={4}
                    margin={1}
                    marginLeft={10}
                    backgroundColor="rgba(211, 211, 211, 0.5)"
                    borderRadius={10}
                  >
                    {/* Row 1 - Nama klinik/RS */}
                    <Box flexDirection="row" marginBottom={2}>
                      <Text>{record.NamaClinic}</Text>
                    </Box>

                    {/* Row 2 - Detail informasi */}
                    <Box flexDirection="row" alignItems="center">
                      {/* Kolom 1 - Gambar */}
                      <Box>
                        <Image
                          source={require("../../../../assets/images/DocMedic.png")}
                          alt="DocRekamMedis"
                          resizeMode="contain"
                          width={12}
                          height={12}
                        />
                      </Box>

                      {/* Kolom 2 - Informasi dokter dan diagnosis */}
                      <Box marginLeft={4}>
                        {/* Row 1 di dalam kolom 2 */}
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("HistoryDetails", {
                              selectedRecord: record,
                              userData: userData,
                            })
                          }
                        >
                          <Box
                            flexDirection="row"
                            marginBottom={2}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box marginRight={12}>
                              <Text>
                                {record.JenisPoli}
                                {"\n"}
                                {/* {record.PasienData.namaLengkap} */}
                                {userRole === "Doctor"
                                  ? record.PasienData.namaLengkap
                                  : record.NamaDokter}
                              </Text>
                            </Box>
                            <Box
                              ml={
                                (record.PasienData?.namaLengkap?.length ||
                                  record.NamaDokter?.length) > 10
                                  ? 12
                                  : 24
                              }
                              position="relative"
                            >
                              <Icon
                                as={Ionicons}
                                name="chevron-forward-outline"
                                size={7}
                                ml="2"
                                color="black"
                                style={{ position: "absolute", right: 0 }}
                              />
                            </Box>
                          </Box>
                        </TouchableOpacity>

                        {/* Row 2 di dalam kolom 2 */}
                        <Box flexDirection="row">
                          <Box
                            flex={1}
                            backgroundColor="rgba(211, 211, 211, 0.2)" // Warna dengan opasitas
                            padding={2}
                            marginRight={2}
                            borderStyle="dashed" // Mengatur jenis border menjadi putus-putus
                            borderWidth={1} // Atur lebar border sesuai kebutuhan
                            borderRadius={4}
                          >
                            <Text>{record.Diagnosis}</Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        />
      )}
    </Box>
  );
};

export default HistoryScreen;
