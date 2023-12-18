import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  Box,
  Button,
  Input,
  HStack,
  Center,
  ScrollView,
  Image,
  FlatList,
  Icon,
} from "native-base";
import moment from "moment";
import Swiper from "react-native-swiper";
import {
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Fontisto,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
// import { ThemeContext } from "../component/themeContext";
// import colors from "../component/theme";

const { width } = Dimensions.get("window");

const HistoryDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const initialName = route.params ? route.params.userName : "";
  const initialUserImg = route.params ? route.params.userImg : null;
  const initialText = route.params ? route.params.text : "";
  const initialSpecialty = route.params ? route.params.specialty : "";

  return (
    <ScrollView backgroundColor={activeColors.primary}>
      <Box bg={activeColors.secondary} p={4} mb={2} mt={3}>
        <Box flexDirection="row" alignItems="center">
          <Image
            source={require("../../../../assets/images/DocDetails.png")} // Ganti dengan URL gambar profil dokter
            alt="Doctor Profile"
            size="50"
            borderRadius="50px"
          />
          <Box ml={4}>
            <Text fontSize={18} color={activeColors.tint}>
              Poli Umum
            </Text>
            <Text fontSize={16} color={activeColors.tertiary}>
              Dr. Ken William
            </Text>
            <Text fontSize={14} marginTop={2} color={activeColors.tertiary}>
              17 Desember 2023
            </Text>
          </Box>
        </Box>
      </Box>

      <Box
        bg={activeColors.secondary}
        p="4"
        mt="2"
        borderRadius="md"
        shadow={2}
      >
        <Text fontSize={20} color={activeColors.tint} fontWeight={600}>
          Catatan Dokter
        </Text>
        <Box ml={4}>
          <Box py={2}>
            <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
              Rekam Medis ID
            </Text>
            <Text fontSize="16" py={2} color={activeColors.tertiary}>
              215612661
            </Text>
          </Box>

          <Box py={2}>
            <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
              Keluhan
            </Text>
            <Text fontSize="16" py={2} color={activeColors.tertiary}>
              Demam sejak 2 hari lalu, disertai batuk dan pilek
            </Text>
          </Box>

          <Box py={2}>
            <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
              Diagnosis
            </Text>
            <Text fontSize="16" py={2} color={activeColors.tertiary}>
              Influenza
            </Text>
          </Box>

          <Box py={2}>
            <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
              Saran Perawatan
            </Text>
            <Text fontSize="16" py={2} color={activeColors.tertiary}>
              Paracetamol{"\n"}Istirahat Cukup
            </Text>
          </Box>

          <Box py={2} mb={10}>
            <Text fontSize="16" color={activeColors.tint} fontWeight={600}>
              Resep Obat
            </Text>
            <Box flexDirection={"column"}>
              <Box pt={2}>
                <Text
                  fontSize="16"
                  fontWeight={600}
                  color={activeColors.tertiary}
                >
                  <Icon as={Ionicons} name="ellipse" size={5} color={"#65B741"} />
                  Loratadine 200 mg
                </Text>
                <Text fontSize="16" ml={5} color={activeColors.tertiary}>
                  Sebelum makan, 3x sehari
                </Text>
              </Box>
              <Box pt={2}>
                <Text
                  fontSize="16"
                  fontWeight={600}
                  color={activeColors.tertiary}
                >
                  <Icon as={Ionicons} name="ellipse" size={5} color={"#65B741"} />
                  Dexteem 200 mg
                </Text>
                <Text fontSize="16" ml={5} color={activeColors.tertiary}>
                  Sesudah makan, 3x sehari
                </Text>
              </Box>
              <Box pt={2}>
                <Text
                  fontSize="16"
                  fontWeight={600}
                  color={activeColors.tertiary}
                >
                  <Icon as={Ionicons} name="ellipse" size={5} color={"#65B741"} />
                  Sanmol 20 mg
                </Text>
                <Text fontSize="16" ml={5} color={activeColors.tertiary}>
                  Sesudah makan, 3x sehari
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default HistoryDetailsScreen;