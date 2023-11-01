import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, Switch } from "react-native";
import { Box, Text, ScrollView, Image, Flex } from "native-base";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../../component/theme";
import { ThemeContext } from "../../component/themeContext";

const SECTIONS = [
  {
    header: "Account",
    icon: "user",
    items: [
      {
        id: "MyProfile",
        icon: "user",
        color: "#32c759",
        label: "My Profile",
        type: "link",
      },
      {
        icon: "lock",
        color: "#fd2d54",
        label: "Change Password",
        type: "link",
      },
    ],
  },
  {
    header: "Preferences",
    icon: "settings",
    items: [
      {
        icon: "globe",
        color: "#fe9400",
        label: "Language",
        type: "link",
      },
      {
        id: "darkMode",
        icon: "moon",
        color: "#007afe",
        label: "Dark Mode",
        type: "toogle",
      },
      {
        id: "wifi",
        icon: "wifi",
        color: "#007afe",
        label: "Use Wi-Fi",
        type: "toogle",
      },
      {
        icon: "navigation",
        color: "#32c759",
        label: "Location",
        type: "link",
      },
      // {
      //   id: "showCollaborators",
      //   icon: "users",
      //   color: "#32c759",
      //   label: "Show collaborators",
      //   type: "toogle",
      // },
      // {
      //   id: "accessbilityMode",
      //   icon: "airplay",
      //   color: "#fd2d54",
      //   label: "Accesbility mode",
      //   type: "toogle",
      // },
    ],
  },
  {
    header: "Content",
    icon: "align-center",
    items: [
      {
        icon: "save",
        color: "#32c759",
        label: "History Pemeriksaan",
        type: "link",
      },
      { icon: "download", color: "#fd2d54", label: "Downloads", type: "link" },
    ],
  },
  {
    header: "Actions",
    icon: "help-circle",
    items: [
      {
        icon: "flag",
        color: "#8e8d91",
        label: "Report Bug",
        type: "link",
      },
      {
        icon: "mail",
        color: "#007afe",
        label: "Contact Us",
        type: "link",
      },
      {
        icon: "users",
        color: "#32c759",
        label: "Add Account",
        type: "link",
      },
      {
        icon: "log-out",
        color: "#fd2d54",
        label: "Log out",
      },
    ],
  },
];

const sectionsHandler = (id, navigation) => {
  if (id === "MyProfile") {
    navigation.navigate("MyProfile");
  } else {

  }
}

const ProfileScreen = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();

  // const theme = { mode: "light" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [form, setForm] = useState({
    darkMode: false,
    wifi: false,
    showCollaborators: true,
    accessibilityMode: false,
  });

  const [isActive, setIsActive] = useState(theme.mode === "dark");
  const toggleDarkMode = () => {
    updateTheme();
    setIsActive((previousState) => !previousState);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView flex={1} backgroundColor={activeColors.primary}>
        <Box paddingY={6}>
          <Box p={6} alignItems={"center"} justifyContent={"center"}>
            <TouchableOpacity onPress={() => {}}>
              <Box position={"relative"}>
                <Image
                  alt="Profile Picture"
                  source={require("../../image/UserProfile1.jpg")}
                  w={"110"}
                  h={"110"}
                  rounded={99999}
                />

                <Box
                  w={10}
                  h={10}
                  rounded={99999}
                  backgroundColor={"#007bff"}
                  position={"absolute"}
                  right={-1}
                  bottom={-5}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <FeatherIcon name="edit-3" size={15} color="#fff" />
                </Box>
              </Box>
            </TouchableOpacity>

            <Text
              mt={5}
              fontSize={19}
              fontWeight={600}
              color={activeColors.tint}
              textAlign={"center"}
            >
              Mathew Renandra
            </Text>
            <Text
              mt={3}
              fontSize={15}
              fontWeight={600}
              color={activeColors.tertiary}
              textAlign={"center"}
            >
              mathew@gmail.com
            </Text>
          </Box>

          {SECTIONS.map(({ header, items }) => (
            <Box px={6} key={header}>
              <Text
                py={3}
                fontSize={12}
                fontWeight={600}
                color={"#9e9e9e"}
                textTransform={"uppercase"}
                letterSpacing={1.1}
              >
                {header}
              </Text>

              {items.map(({ id, label, type, icon, color }) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => sectionsHandler(id, navigation)}
                >
                  <Box
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={12}
                    backgroundColor={activeColors.secondary}
                    rounded={9}
                    mb={3}
                    py={3}
                  >
                    <Flex direction="row" alignItems={"center"} padding={3}>
                      <Box
                        w={8}
                        h={8}
                        rounded={9999}
                        alignItems={"center"}
                        justifyContent={"center"}
                        mr={3}
                        backgroundColor={color}
                      >
                        <FeatherIcon name={icon} color={"#fff"} size={18} />
                      </Box>

                      <Text fontSize={17} color={activeColors.tint}>
                        {label}
                      </Text>

                      <Box flex={1} />

                      {type === "toogle" && (
                        <Switch
                          value={form[id]}
                          onValueChange={(value) => {
                            setForm({ ...form, [id]: value });
                            if (id === "darkMode") {
                              toggleDarkMode();
                            }
                          }}
                        />
                      )}

                      {type === "link" && (
                          <TouchableOpacity
                            onPress={() => {
                              if (id === "MyProfile") {
                                navigation.navigate("MyProfile");
                              } else {
                                // Tindakan lainnya untuk tautan lain
                              }
                            }}
                          >
                            {/* ... */}
                          </TouchableOpacity>
                        ) && (
                          <FeatherIcon
                            name="chevron-right"
                            color={activeColors.tint}
                            size={22}
                          />
                        )}
                    </Flex>
                  </Box>
                </TouchableOpacity>
              ))}
            </Box>
          ))}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;