import React, { useContext, useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Box, Text, ScrollView, Input } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "../../../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
// Import komponen lain yang diperlukan

const MedicalRecordForm = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const navigation = useNavigation();

  const [medicalRecord, setMedicalRecord] = useState({
    RekamMedisID: "",
    PasienID: "",
    JenisPoli: "",
    NamaDokter: "",
    tanggal: "",
    Keluhan: "",
    Diagnosis: "",
    SaranPerawatan: "",
    ResepObat: [{ name: "", usage: "" }],
    NamaClinic: "",
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Ambil data dari AsyncStorage saat komponen dipasang (mounted)
    AsyncStorage.getItem("credentials")
      .then((data) => {
        if (data) {
          const credentials = JSON.parse(data);
          setUserData(credentials);
        }
        // setLoadingData(false);
      })
      .catch((error) => console.log(error));
  }, []);

  console.log(userData);

  const generateRandomID = () => {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const createCustomID = () => {
    const prefix = "215";
    const randomNumber = generateRandomID();
    const customID = `${prefix}${randomNumber}`;
    return customID;
  };

  const handleInputChange = (key, value) => {
    setMedicalRecord({
      ...medicalRecord,
      [key]: value,
    });
  };

  const addNewMedicine = () => {
    setMedicalRecord({
      ...medicalRecord,
      ResepObat: [...medicalRecord.ResepObat, { name: "", usage: "" }],
    });
  };

  const handleMedicineChange = (index, key, value) => {
    const updatedMedicineList = [...medicalRecord.ResepObat];
    updatedMedicineList[index][key] = value;

    setMedicalRecord({
      ...medicalRecord,
      ResepObat: updatedMedicineList,
    });
  };

  const saveMedicalRecord = async () => {
    // Simpan medicalRecord ke AsyncStorage dan Firebase di sini
    console.log("Data yang akan disimpan:", medicalRecord);
    // Lakukan proses penyimpanan ke AsyncStorage dan Firebase
    // ...

    const getMonthName = (month) => {
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      return monthNames[month - 1];
    };

    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthName = getMonthName(month);
      return `${day} ${monthName} ${year}`;
    };

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    try {
      // Mendapatkan koleksi user dari Firestore
      const usersCollection = collection(firestore, "users");

      const userRef = doc(firestore, "users", userData.uid);

      // Mengecek apakah ada dokumen pengguna dengan PasienID yang sama
      const querySnapshot = await getDocs(
        query(usersCollection, where("id", "==", medicalRecord.PasienID))
      );

      if (querySnapshot.empty) {
        Alert.alert("Error", "Tidak ada data dengan ID Pasien tersebut !");
      }

      // Jika PasienID ditemukan di dokumen pengguna yang sudah ada
      else if (!querySnapshot.empty) {
        const userCollectionn = collection(firestore, "RekamMedis");

        const newMedicalRecord = {
          RekamMedisID: createCustomID(),
          PasienID: medicalRecord.PasienID,
          JenisPoli: medicalRecord.JenisPoli,
          NamaDokter: userData.namaLengkap,
          tanggal: currentDate,
          Keluhan: medicalRecord.Keluhan,
          Diagnosis: medicalRecord.Diagnosis,
          SaranPerawatan: medicalRecord.SaranPerawatan,
          ResepObat: medicalRecord.ResepObat,
          NamaClinic: medicalRecord.NamaClinic,
        };

        const newDoc = await addDoc(userCollectionn, newMedicalRecord);
        console.log("Berhasil menambahkan data ke Firebase: ", newDoc.id);

        const RekamMedisID = newMedicalRecord.RekamMedisID;

        // Update dokumen user dengan RekamMedisID baru jika user sedang login
        await updateDoc(userRef, {
          RekamMedisID: arrayUnion(RekamMedisID),
        });

        // Update dokumen user dengan RekamMedisID baru jika PasienID cocok
        const userQuerySnapshot = await getDocs(
          query(usersCollection, where("id", "==", medicalRecord.PasienID))
        );

        userQuerySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            RekamMedisID: arrayUnion(RekamMedisID),
          });
        });

        const medicalRecords = await AsyncStorage.getItem("MedicalRecord");
        let existingRecords = [];

        console.log("Medical Records :", medicalRecords);
        console.log("Existing Records :", existingRecords);

        if (medicalRecords !== null) {
          existingRecords = JSON.parse(medicalRecords);
        }

        existingRecords.push(newMedicalRecord);
        console.log("Existing Records :", existingRecords);
        await AsyncStorage.setItem(
          "MedicalRecord",
          JSON.stringify(existingRecords)
        );

        const getNewMedicalRecords = await AsyncStorage.getItem(
          "MedicalRecord"
        );
        console.log("New AsyncStorage Medical Records :", getNewMedicalRecords);
        console.log("Berhasil menambahkan data: ", existingRecords);
        Alert.alert(
          "Success",
          "Berhasil menambahkan data ke dalam AsyncStorage"
        );
        navigation.navigate("History");

        console.log("Berhasil menambahkan RekamMedisID ke data pengguna");
      } else {
        console.log("PasienID sudah ada dalam dokumen pengguna yang ada");
      }
    } catch (error) {
      console.error("Error saving to AsyncStorage:", error);
    }
  };

  return (
    <ScrollView>
      <Box padding={4}>
        {/* Input untuk Jenis Poli */}
        <Text fontWeight="bold" color={activeColors.tint}>
          Pasien ID
        </Text>
        <Input
          my={4}
          placeholder="12012345"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          value={medicalRecord.PasienID}
          onChangeText={(value) => handleInputChange("PasienID", value)}
        />
        <Text fontWeight="bold" color={activeColors.tint}>
          Jenis Poli
        </Text>
        <Input
          my={4}
          placeholder="Poli Umum"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          value={medicalRecord.JenisPoli}
          onChangeText={(value) => handleInputChange("JenisPoli", value)}
        />
        {/* Input untuk Keluhan */}
        <Text fontWeight="bold" color={activeColors.tint}>
          Keluhan Pasien
        </Text>
        <Input
          my={4}
          placeholder="Flu, Headache"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          value={medicalRecord.Keluhan}
          onChangeText={(value) => handleInputChange("Keluhan", value)}
        />
        {/* Input untuk Diagnosis */}
        <Text fontWeight="bold" color={activeColors.tint}>
          Diagnosis
        </Text>
        <Input
          my={4}
          placeholder="Influenza"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          value={medicalRecord.Diagnosis}
          onChangeText={(value) => handleInputChange("Diagnosis", value)}
        />
        {/* Input untuk Saran Perawatan */}
        <Text fontWeight="bold" color={activeColors.tint}>
          Saran Perawatan
        </Text>
        <Input
          my={4}
          placeholder="Saran Perawatan"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          multiline
          numberOfLines={5}
          value={medicalRecord.SaranPerawatan}
          onChangeText={(value) => handleInputChange("SaranPerawatan", value)}
        />
        <Box
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {/* Input untuk Resep Obat */}
          <Text fontWeight="bold" color={activeColors.tint}>
            Resep Obat
          </Text>
          <TouchableOpacity
            onPress={addNewMedicine}
            style={{ padding: 2, borderRadius: 30, backgroundColor: "#0082f7" }}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Box>
        {/* Icon tambah obat */}
        {/* <TouchableOpacity onPress={addNewMedicine}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity> */}
        {/* <Input
          my={4}
          placeholder="Resep Obat"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          multiline
          numberOfLines={5}
          value={medicalRecord.ResepObat}
          onChangeText={(value) => handleInputChange("ResepObat", value)}
        /> */}
        {medicalRecord.ResepObat.map((medicine, index) => (
          <Box key={index}>
            <Input
              my={4}
              placeholder="Nama Obat"
              backgroundColor={"#E4F1FF"}
              placeholderTextColor={"muted"}
              rounded={6}
              value={medicine.name}
              onChangeText={(value) =>
                handleMedicineChange(index, "name", value)
              }
            />
            <Input
              my={4}
              placeholder="Pemakaian: Setelah makan, 3x Sehari"
              backgroundColor={"#E4F1FF"}
              placeholderTextColor={"muted"}
              rounded={6}
              value={medicine.usage}
              onChangeText={(value) =>
                handleMedicineChange(index, "usage", value)
              }
            />
          </Box>
        ))}
        {/* Input untuk Nama Clinic */}
        <Text fontWeight="bold" color={activeColors.tint}>
          Nama Klinik
        </Text>
        <Input
          my={4}
          placeholder="Nama Klinik"
          backgroundColor={"#E4F1FF"}
          placeholderTextColor={"muted"}
          rounded={6}
          value={medicalRecord.NamaClinic}
          onChangeText={(value) => handleInputChange("NamaClinic", value)}
        />
        <TouchableOpacity onPress={saveMedicalRecord}>
          <Box
            backgroundColor={"#0082f7"}
            padding={2}
            borderRadius={12}
            alignItems="center"
            marginTop={2}
          >
            <Text color="white">Simpan</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </ScrollView>
  );
};

export default MedicalRecordForm;
