import { useContext } from "react";
import { Box, ScrollView, Text, Center } from "native-base";
import { ThemeContext } from "../../../component/themeContext";
import colors from "../../../component/theme";
// import colors from "../component/theme";
// import { ThemeContext } from "../component/themeContext";

const LocationScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <Box flex={1} backgroundColor={"#f4f4f4"}>
      <ScrollView flex={1} backgroundColor={activeColors.primary}>
        <Box mt={96}>
          <Center>
            <Text color={activeColors.tint}>Ini adalah halaman Location</Text>
          </Center>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default LocationScreen;

