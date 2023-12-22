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
import { useNavigation } from "@react-navigation/native";
import DataArticles from "../../DataArticle";
import DataObats from "../../DataObat";
import { format } from "date-fns";
// import { ThemeContext } from "../component/themeContext";

const Home = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();
  const DataArticle = DataArticles;
  const DataObat = DataObats;

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

  const kategoriHandler = (props) => {
    if (props === "Cari Dokter") {
      navigation.navigate("Doctor");
    } else if (props === "Konsultasi") {
      navigation.navigate("Message");
    } else if (props === "Gaya Hidup") {
      setIsDataLifeStyle(true);
    } else if (props === "Obat") {
      setIsDataLifeStyle(false);
    }
  };

  const getNews = () => {
    fetch('https://api-berita-indonesia.vercel.app/cnn/gayaHidup')
      .then((response) => response.json())
      .then((json) => setLifestyle(json.data.posts))
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoadingNews(false);
        // setIsFetching(false);
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
              <Spinner size="lg" color={"black"} />
            </Center>
          ) : (
            <FlatList
              data={isDataLifeStyle ? dataLifestyle : DataObat}
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
