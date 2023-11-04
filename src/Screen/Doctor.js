// import { useContext } from "react";
// import { Box, ScrollView, Text, Center } from "native-base";
// import colors from "../component/theme";
// import { ThemeContext } from "../component/themeContext";

// const DoctorScreen = () => {
//   // const theme = { mode: "dark" };
//   const { theme, updateTheme } = useContext(ThemeContext);
//   let activeColors = colors[theme.mode];

//   return (
//     <Box flex={1} backgroundColor={"#f4f4f4"}>
//       <ScrollView flex={1} backgroundColor={activeColors.primary}>
//         <Box mt={96}>
//           <Center>
//             <Text color={activeColors.tint}>Ini adalah halaman List Doctor</Text>
//           </Center>
//         </Box>
//       </ScrollView>
//     </Box>
//   );
// };

// export default DoctorScreen;

import { useContext } from "react";
import { Box, ScrollView, Text, Center, Image, FlatList } from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";

const data = [
  {
    name: 'Dr. John Doe',
    specialty: 'Cardiologist',
    image: 'https://example.com/johndoe.jpg',
  },
  {
    name: 'Dr. Jane Smith',
    specialty: 'Pediatrician',
    image: 'https://example.com/janesmith.jpg',
  },

  // Tambahkan data dokter lainnya jika diperlukan
];

const DoctorScreen = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const renderDoctorItem = ({ item }) => (
    <Box flexDirection="row" alignItems="center" borderBottomWidth={1} borderBottomColor={activeColors.border}>
      <Image
        source={require("../image/2.jpg")}
        alt={item.name}
        size={16}
        rounded="full"
        mr={4}
      />
      <Box>
        <Text color={activeColors.text}>{item.name}</Text>
        <Text color={activeColors.textMuted} fontSize="sm">{item.specialty}</Text>
      </Box>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor={activeColors.background}>
      <ScrollView>
        <Box mt={4} p={4}>
          <FlatList
            data={data}
            renderItem={renderDoctorItem}
            keyExtractor={(item) => item.name}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default DoctorScreen;