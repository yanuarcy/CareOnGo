import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  HStack,
  Button,
  Text,
  FlatList,
  Box,
  Image,
  Flex,
  Pressable,
} from "native-base";
import { TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// import LinearGradient from "expo-linear-gradient";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import JadwaL from "../component/JadwalPemeriksaan";
import Header from "../component/Header";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
// import { ThemeContext } from "../component/themeContext";

const Home = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [pencarian, setPencarian] = useState("");
  const [kategori, setKategori] = useState([
    { namaKategori: "Artikel" },
    { namaKategori: "Konsultasi" },
    { namaKategori: "Obat" },
    { namaKategori: "Cari Dokter" },
    { namaKategori: "Klinik Terdekat" },
    { namaKategori: "Rumah Sakit" },
  ]);

  const [artikel, setArtikel] = useState([
    {
      judul: "Resep Rahasia Agar Tetap Sehat",
      deskripsi: "inilah resep rahasia agar anda tetap sehat di umur 60an",
      image: require("../image/2.jpg"),
    },
    {
      judul: "Resep Rahasia Agar Tetap Sehat",
      deskripsi: "inilah resep rahasia agar anda tetap sehat di umur 60an",
      image: require("../image/2.jpg"),
    },
    {
      judul: "Resep Rahasia Agar Tetap Sehat",
      deskripsi: "inilah resep rahasia agar anda tetap sehat di umur 60an",
      image: require("../image/2.jpg"),
    },
  ]);

  return (
    <SafeAreaView flex={1}>
      <StatusBar
        style={theme.mode === "dark" ? "light" : "dark"}
        backgroundColor={activeColors.primary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        flex={1}
        mx={0}
        paddingX={5}
        mt={0}
        backgroundColor={activeColors.primary}
      >
        <Header pencarian={pencarian} setPencarian={setPencarian} />
        <JadwaL />
        <Box>
          <Flex direction="row" mt={30}>
            <Text color={"#0082F7"} fontWeight={"bold"}>
              Kategori
            </Text>
            <TouchableOpacity
              style={{
                alignItems: "flex-end",
                flex: 1,
              }}
            >
              <Text
              color={"#FDB436"}
              fontWeight={"bold"}
              >
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </Flex>
        </Box>

        <Box>
          <FlatList
            data={kategori}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  marginRight: 10,
                  paddingHorizontal: 10,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 25,
                  elevation: 3,
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                <Text>{item.namaKategori}</Text>
              </TouchableOpacity>
            )}
          />
        </Box>

        <Box>
          <FlatList
            data={artikel}
            mb={5}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  marginRight: 10,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  elevation: 3,
                  marginBottom: 10,
                  marginTop: 10,
                  paddingBottom: 20,
                }}
              >
                <Box
                  h={200}
                  mb={3}
                  roundedTopRight={10}
                  roundedTopLeft={10}
                >
                  <ImageBackground
                    source={item.image}
                    style={{
                      flex: 1,
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    }}
                    imageStyle={{
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    }}
                  />
                </Box>

                <Box>
                  <Image
                    source={item.image}
                    w={10}
                    h={10}
                    rounded={20}
                    borderColor={"white"}
                    borderWidth={2}
                    ml={2.5}
                    mt={1.5}
                    alt="Dokter"
                  />
                  <Text
                    fontWeight={"bold"}
                    fontSize={18}
                    mx={2.5}
                    mt={1.5}
                  >
                    {item.judul}
                  </Text>
                  <Text
                  mx={2.5}
                  >
                    {item.deskripsi}
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const HomeScreen = () => <Home />;

export default Home;