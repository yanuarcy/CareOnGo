import React, { useContext } from "react";
// import { ScrollView } from "react-native";
import { Box, Text, Image, ScrollView } from "native-base";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../component/themeContext";
import colors from "../component/theme";
import { TouchableOpacity } from "react-native";

const ArticleDetails = () => {
  //   const { title, content, image } = route.params;

  const route = useRoute();
  const navigation = useNavigation();

  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const initialImage = route.params ? route.params.image : null;
  const initialTitle = route.params ? route.params.title : "";
  const initialContent = route.params ? route.params.content : "";
  const initialLink = route.params ? route.params.link : "";

  return (
    <ScrollView backgroundColor={activeColors.primary}>
      <Box>
        <Image
          source={
            typeof initialImage === "number" // Cek apakah thumbnail berupa URI string
              ? initialImage
              : { uri: initialImage }
          }
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

      <Box p={4} mt={4}>
        <Text color={activeColors.tint}>{initialContent}</Text>
      </Box>

      <TouchableOpacity
        style={{
          backgroundColor: "#0082F7",
          paddingVertical: 10,
          paddingHorizontal: 25,
          borderRadius: 8,
          alignSelf: "center",
          marginTop: 40,
        }}
        onPress={() => navigation.navigate("WebView", { link: initialLink })}
      >
        <Text style={{ color: "white" }}>Read More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ArticleDetails;
