import { useContext } from "react";
import {
  Box,
  ScrollView,
  Text,
  Center,
  FlatList,
  HStack,
  Image,
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";

const data = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    image: "https://example.com/johndoe.jpg",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialty: "Pediatrician",
    image: "https://example.com/janesmith.jpg",
  },
  {
    id: 3,
    name: "Dr. Serena Gome",
    specialty: "Neurologist",
    image: "https://example.com/janesmith.jpg",
  },
  {
    id: 4,
    name: "Dr. Asma Khan",
    specialty: "Gastroenterologist",
    image: "https://example.com/janesmith.jpg",
  },
  {
    id: 5,
    name: "Dr. Kiran Shakira",
    specialty: "Gynecologist",
    image: "https://example.com/janesmith.jpg",
  },
  {
    id: 6,
    name: "Dr. Kiran",
    specialty: "Gynecologist",
    image: "https://example.com/janesmith.jpg",
  },
  {
    id: 7,
    name: "Dr. Shakira",
    specialty: "Gynecologist",
    image: "https://example.com/janesmith.jpg",
  },
  {
    id: 8,
    name: "Dr. Kiran Sha",
    specialty: "Gynecologist",
    image: "https://example.com/janesmith.jpg",
  },
  // Tambahkan data dokter lainnya jika diperlukan
];

const DoctorScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const renderDoctorItem = ({ item }) => (
    <Box
      flexDirection="row"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor={activeColors.tint}
      mb={6}
      pb={6}
    >
      <Image
        source={require("../image/2.jpg")}
        alt={item.name}
        size={16}
        rounded="full"
        mr={4}
      />
      <Box>
        <Text color={activeColors.tint}>{item.name}</Text>
        <Text color={activeColors.tertiary} fontSize="sm">
          {item.specialty}
        </Text>
      </Box>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor={activeColors.primary}>
      <Box mt={4} p={6}>
        <FlatList
          data={data}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.name}
        />
      </Box>
    </Box>
  );
};

export default DoctorScreen;
