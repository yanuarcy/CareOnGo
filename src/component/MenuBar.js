import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "./theme";
import { ThemeContext } from "./themeContext";
// import ProfileScreen from "../Screen/Profile";
import HomeScreen from "../Screen/Home";
import AppointmentScreen from "../Screen/Appointment";
import PesanScreen from "../Screen/Chat";
import ProfileScreen from "../Screen/Profile/Profile";
import MyProfileScreen from "../Screen/Profile/Account/MyProfile";
import DoctorScreen from "../Screen/Doctor";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StackScreen = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfileScreen}
      />

    </Stack.Navigator>
  );
};

const MenuBar = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            // backgroundColor: "black", // Ubah warna latar belakang header sesuai keinginan
          },
          headerTitleAlign: "center",
          // headerTintColor: "white",
          // headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerShown: false,
            tabBarLabel: "",
            tabBarVisible: false,
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Home")}
              >
                <Icon
                  name="home"
                  size={size}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                />
                <Text
                  fontSize={12}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                >
                  Home
                </Text>
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: activeColors.barStyle, // Ganti 'your_color_here' dengan warna latar belakang yang Anda inginkan
            },
          })}
        />

        <Tab.Screen
          name="Doctor"
          component={DoctorScreen}
          options={({ navigation }) => ({
            headerShown: false,
            tabBarLabel: "",
            tabBarVisible: false,
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Doctor")}
              >
                <Icon
                  name="person"
                  size={size}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                />
                <Text
                  fontSize={12}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                >
                  Doctor
                </Text>
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: activeColors.barStyle, // Ganti 'your_color_here' dengan warna latar belakang yang Anda inginkan
            },
          })}
        />

        <Tab.Screen
          name="Appointment"
          component={AppointmentScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "My Appointment",
            tabBarLabel: "",
            tabBarVisible: false,
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Appointment")}
              >
                <Icon
                  name="calendar"
                  size={size}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                />
                <Text
                  fontSize={12}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                >
                  Appointment
                </Text>
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: activeColors.barStyle, // Ganti 'your_color_here' dengan warna latar belakang yang Anda inginkan
            },
          })}
        />

        <Tab.Screen
          name="Message"
          component={PesanScreen}
          options={({ navigation }) => ({
            headerStyle: {
              backgroundColor: activeColors.primary
            },
            headerTintColor: activeColors.tint,
            tabBarLabel: "",
            tabBarVisible: false,
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Message")}
              >
                <Icon
                  name="chatbubble"
                  size={size}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                />
                <Text
                  fontSize={12}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                >
                  Message
                </Text>
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: activeColors.barStyle, // Ganti 'your_color_here' dengan warna latar belakang yang Anda inginkan
            },
          })}
        />

        <Tab.Screen
          name="Profilee"
          component={StackScreen}
          options={({ navigation }) => ({
            headerShown: false,
            tabBarLabel: "",
            tabBarVisible: false,
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Profilee")}
              >
                <Icon
                  name="person"
                  size={size}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                />
                <Text
                  fontSize={12}
                  color={
                    focused ? activeColors.iconFocus : activeColors.barIcon
                  }
                >
                  Profile
                </Text>
              </TouchableOpacity>
            ),
            tabBarStyle: {
              backgroundColor: activeColors.barStyle, // Ganti 'your_color_here' dengan warna latar belakang yang Anda inginkan
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
};

export default MenuBar;
