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
  Spinner,
  Center,
  View,
} from "native-base";
import {
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// import LinearGradient from "expo-linear-gradient";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import JadwaL from "../component/JadwalPemeriksaan";
import Header from "../component/Header";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useNavigation } from "@react-navigation/native";
import DataArticles from "../../DataArticle";
import DataObats from "../../DataObat";
import { format } from "date-fns";
import LottieView from "lottie-react-native";
// import { ThemeContext } from "../component/themeContext";

const Home = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();
  const DataArticle = DataArticles;
  const DataObat = DataObats;

  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isDataLifeStyle, setIsDataLifeStyle] = useState(true);
  const [dataLifestyle, setLifestyle] = useState([]);
  const [pencarian, setPencarian] = useState("");
  const [kategori, setKategori] = useState([
    { namaKategori: "Gaya Hidup" },
    { namaKategori: "Konsultasi" },
    { namaKategori: "Obat" },
    { namaKategori: "Cari Dokter" },
  ]);
  const [filteredData, setFilteredData] = useState([]);

  console.log("pencarian: ", pencarian);
  // const filterArtikel = (text) => {
  //   const selectedData = isDataLifeStyle ? dataLifestyle : DataObat;

  //   return selectedData.filter((item) =>
  //     item.title.toLowerCase().includes(text.toLowerCase())
  //   );
  // };

  const filterArtikel = (text) => {
    const selectedData = isDataLifeStyle ? dataLifestyle : DataObat;

    const filtered = selectedData.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredData(filtered); // Perbarui state filteredData dengan hasil filter
    setPencarian(text);
  };

  const kategoriHandler = (props) => {
    if (props === "Cari Dokter") {
      navigation.navigate("Doctor");
    } else if (props === "Konsultasi") {
      navigation.navigate("Message");
    } else if (props === "Gaya Hidup") {
      setIsDataLifeStyle(true);
      setPencarian("");
    } else if (props === "Obat") {
      console.log("suda pencet obat");
      setIsDataLifeStyle(false);
      setPencarian("");
    }
    setPencarian("");
  };

  const onRefresh = () => {
    // Lakukan proses pembaruan data di sini
    // Contoh: panggil fungsi untuk mengambil data baru
    // dan atur refreshing ke false setelah selesai
    setRefreshing(true);
    getNews(); // Ganti dengan fungsi yang sesuai untuk memuat ulang data
    setRefreshing(false);
  };

  const getNews = () => {
    fetch("https://api-berita-indonesia.vercel.app/cnn/gayaHidup")
      .then((response) => response.json())
      .then((json) => setLifestyle(json.data.posts))
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoadingNews(false);
      });
  };

  useEffect(() => {
    getNews();
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header pencarian={pencarian} setPencarian={filterArtikel} />
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
              <Text color={"#FDB436"} fontWeight={"bold"}>
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
                onPress={() => kategoriHandler(item.namaKategori)}
              >
                <Text>{item.namaKategori}</Text>
              </TouchableOpacity>
            )}
          />
        </Box>

        <Box>
          {isLoadingNews ? (
            <Center flex={1} justifyContent={"center"}>
              {/* <Spinner size="lg" color={"black"} /> */}
              <LottieView
                style={{
                  width: 70,
                  height: 170,
                  marginTop: 20,
                }}
                source={require("../../assets/LoadingAnimation.json")}
                autoPlay
                loop={true}
                speed={1.5}
              />
            </Center>
          ) : filteredData.length === 0 ? (
            <>
              <Center flex={1} justifyContent={"center"}>
                {/* <Text>Data tidak ditemukan</Text> */}
                <LottieView
                  style={{
                    width: 70,
                    height: 170,
                    marginTop: 10,
                  }}
                  source={require("../../assets/EmptyAnimation.json")}
                  autoPlay
                  loop={true}
                  speed={1.5}
                />
              </Center>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: 18,
                  // marginTop: 280,
                }}
              >
                Data tidak ditemukan
              </Text>
            </>
          ) : (
            <FlatList
              // data={isDataLifeStyle ? dataLifestyle : DataObat}
              // data={
              //   filteredData.length > 0
              //     ? filteredData
              //     : isDataLifeStyle
              //     ? dataLifestyle
              //     : DataObat
              // }
              data={
                pencarian // Jika ada nilai pencarian
                  ? filteredData.length > 0 // Jika ada hasil filter
                    ? filteredData
                    : []
                  : isDataLifeStyle // Jika tidak ada nilai pencarian
                  ? dataLifestyle
                  : DataObat
              }
              mb={5}
              horizontal
              keyExtractor={(item) => item.link}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    marginRight: 10,
                    backgroundColor: activeColors.secondary,
                    borderRadius: 10,
                    elevation: 3,
                    marginBottom: 10,
                    marginTop: 10,
                    paddingBottom: 20,
                  }}
                  onPress={() =>
                    navigation.navigate("ArticleDetails", {
                      link: item.link,
                      image: item.thumbnail,
                      title: item.title,
                      content: item.description,
                    })
                  }
                >
                  <Box h={200} mb={3} roundedTopRight={10} roundedTopLeft={10}>
                    <ImageBackground
                      source={
                        typeof item.thumbnail === "number" // Cek apakah thumbnail berupa URI string
                          ? item.thumbnail
                          : { uri: item.thumbnail } // Jika URI string, gunakan langsung
                      }
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

                  <Box flexDirection={"row"}>
                    <Box>
                      <Image
                        source={
                          typeof item.thumbnail === "number" // Cek apakah thumbnail berupa URI string
                            ? item.thumbnail
                            : { uri: item.thumbnail }
                        }
                        w={10}
                        h={10}
                        rounded={20}
                        borderColor={"white"}
                        borderWidth={2}
                        ml={2.5}
                        mt={1.5}
                        alt="Dokter"
                      />
                    </Box>
                    <Box>
                      <Text mt={4} ml={2} color={activeColors.tertiary}>
                        {isNaN(Date.parse(item.pubDate))
                          ? item.pubDate // Jika format sudah berupa string, gunakan langsung
                          : format(new Date(item.pubDate), "dd MMMM yyyy")}
                      </Text>
                    </Box>
                  </Box>
                  <Text
                    fontWeight={"bold"}
                    fontSize={18}
                    color={activeColors.tint}
                    mx={2.5}
                    numberOfLines={2}
                    mt={1.5}
                  >
                    {item.title.split(" ").map((word, index, array) => (
                      <React.Fragment key={index}>
                        {word} {index === array.length - 1 ? null : " "}
                        {index !== 0 && (index + 1) % 5 === 0 ? "\n" : null}
                      </React.Fragment>
                    ))}
                  </Text>
                  <Text mx={2.5} color={activeColors.tint} numberOfLines={2}>
                    {item.description.split(" ").map((word, index, array) => (
                      <React.Fragment key={index}>
                        {word} {index === array.length - 1 ? null : " "}
                        {index !== 0 && (index + 1) % 5 === 0 ? "\n" : null}
                      </React.Fragment>
                    ))}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const HomeScreen = () => <Home />;

export default Home;
