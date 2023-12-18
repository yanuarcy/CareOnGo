import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Box, ScrollView, Text, Center, Image, Icon } from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import colors from "../component/theme";
// import { ThemeContext } from "../component/themeContext";

const HistoryScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  const currentDate = formatDate(new Date());

  return (
    <ScrollView>
      <Box margin={4}>
        {/* Header bagian tanggal */}
        {/* <Icon as={Ionicons} name="ellipse" size={5} ml="2" color="#65B741" /> */}
        <Box>
          <Box
            position="absolute"
            left={4}
            top={7}
            width={1} // Atur lebar garis
            height="90%" // Panjang garis sesuai tinggi kontainer
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
              <Text>{currentDate}</Text>
            </Box>
          </Box>

          {/* Bagian informasi rekam medis */}
          <Box
            padding={4}
            margin={1}
            marginLeft={10}
            backgroundColor="rgba(211, 211, 211, 0.5)"
            borderRadius={10}
          >
            {/* Row 1 - Nama klinik/RS */}
            <Box flexDirection="row" marginBottom={2}>
              <Text>Maya Clinic Scottsdale AZ</Text>
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
              <Box marginLeft={5}>
                {/* Row 1 di dalam kolom 2 */}
                <TouchableOpacity onPress={() => navigation.navigate("HistoryDetails")}>
                  <Box flexDirection="row" marginBottom={2} alignItems="center">
                    <Box marginRight={5}>
                      <Text>Poli Umum{"\n"}Dr. Ken William</Text>
                    </Box>
                    <Box marginLeft={10}>
                      <Icon
                        as={Ionicons}
                        name="chevron-forward-outline"
                        size={7}
                        ml="2"
                        color="black"
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
                    <Text>Influenza</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            padding={4}
            margin={1}
            marginLeft={10}
            backgroundColor="rgba(211, 211, 211, 0.5)"
            borderRadius={10}
          >
            {/* Row 1 - Nama klinik/RS */}
            <Box flexDirection="row" marginBottom={2}>
              <Text>Klinik Pratama Medika Pradhana</Text>
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
              <Box marginLeft={5}>
                {/* Row 1 di dalam kolom 2 */}
                <TouchableOpacity>
                  <Box flexDirection="row" marginBottom={2} alignItems="center">
                    <Box marginRight={5}>
                      <Text>Poli Umum{"\n"}Dr. Christy Alex</Text>
                    </Box>
                    <Box marginLeft={10}>
                      <Icon
                        as={Ionicons}
                        name="chevron-forward-outline"
                        size={7}
                        ml="2"
                        color="black"
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
                    <Text>Radang Tenggorokan</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            position="absolute"
            left={4}
            top={7}
            width={1} // Atur lebar garis
            height="90%" // Panjang garis sesuai tinggi kontainer
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
              <Text>14 Desember 2023</Text>
            </Box>
          </Box>

          {/* Bagian informasi rekam medis */}
          <Box
            padding={4}
            margin={1}
            marginLeft={10}
            backgroundColor="rgba(211, 211, 211, 0.5)"
            borderRadius={10}
          >
            {/* Row 1 - Nama klinik/RS */}
            <Box flexDirection="row" marginBottom={2}>
              <Text>Klinik Dr. Henny</Text>
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
              <Box marginLeft={5}>
                {/* Row 1 di dalam kolom 2 */}
                <TouchableOpacity>
                  <Box flexDirection="row" marginBottom={2} alignItems="center">
                    <Box marginRight={12}>
                      <Text>Poli THT{"\n"}Dr. Henny</Text>
                    </Box>
                    <Box marginLeft={10}>
                      <Icon
                        as={Ionicons}
                        name="chevron-forward-outline"
                        size={7}
                        ml="2"
                        color="black"
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
                    <Text>Sinusitis</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default HistoryScreen;