import React, { useContext } from "react";
// import { ScrollView } from "react-native";
import { Box, Text, Image, ScrollView } from "native-base";
import { useRoute } from "@react-navigation/core";
import { ThemeContext } from "../component/themeContext";
import colors from "../component/theme";

const ArticleDetails = () => {
  //   const { title, content, image } = route.params;

	const route = useRoute();

	const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const initialImage = route.params ? route.params.image : null;
  const initialTitle = route.params ? route.params.title : "";
  const initialContent = route.params ? route.params.content : "";

  return (
    <ScrollView backgroundColor={activeColors.primary}>
      <Box>
        <Image
          source={initialImage}
          alt="Article Image"
          resizeMode="cover"
          height={200}
          width="100%"
        />
      </Box>
      
      <Box p={4} mb={-10}>
        <Text fontSize="xl" color={activeColors.tint} fontWeight="bold">
          {initialTitle}
        </Text>
      </Box>
      
      <Box p={4}>
        <Text color={activeColors.tint}>{initialContent}</Text>
      </Box>
    </ScrollView>
  );
};

export default ArticleDetails;
