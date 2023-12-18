import React, { useState, useEffect, useContext } from "react";

import { Icon, NativeBaseProvider } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import MenuBar from "./MenuBar";
import WelcomeScreen from "../Screen/Welcome";
import LoginScreen from "../Screen/Profile/Auth/Login";
import RegisterScreen from "../Screen/Profile/Auth/Register";
import ForgotPasswordScreen from "../Screen/Profile/Auth/Forgot";
import MyProfileScreen from "../Screen/Profile/Account/MyProfile";
import ResetPasswordScreen from "../Screen/Profile/Account/ResetPassword";
import RoomChatScreen from "../Screen/RoomChat";
import colors from "./theme";
import { ThemeContext } from "./themeContext";
import LanguageScreen from "../Screen/Profile/Preferences/Language";
import LocationScreen from "../Screen/Profile/Preferences/Location";
import HistoryScreen from "../Screen/Profile/Content/History";
import ReportScreen from "../Screen/Profile/Actions/ReportBug";
import ContactScreen from "../Screen/Profile/Actions/ContactUs";
import DoctorDetailsScreen from "../Screen/DoctorDetail";
import BookAppointmentScreen from "../Screen/BookAppointment";
import AppointmentBookedScreen from "../Screen/AppointmentBooked";
import AppointmentDetailsScreen from "../Screen/AppointmentDetails";
import ArticleDetails from "../Screen/ArtikelDetails";
import SplashScreen from "../Splash";
import HistoryDetailsScreen from "../Screen/Profile/Content/HistoryDetails";

const Stack = createStackNavigator();

const AppStack = () => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetailsScreen}
          options={({ route }) => ({
            headerShown: true,
						headerTintColor: activeColors.tint,
						headerStyle: {
							backgroundColor: activeColors.primary
						},
            title: route.params.userName,
          })}
          initialParams={{
            userName: "",
            userImg: null,
            // star: "",
            text: "",
            specialty: "",
            patients: "",
            exp: "",
            reviews: "",
          }}
        />

        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={({ route }) => ({
            title: route.params.userName,
            headerShown: true,
            headerTitle: "Select Date & Time",
            headerTitleAlign: "center",
						headerTintColor: activeColors.tint,
						headerStyle: {
							backgroundColor: activeColors.primary
						}
          })}
          initialParams={{
            userName: "",
            userImg: null,
            text: "",
            specialty: "",
          }}
        />

        <Stack.Screen
          name="BookedAppointment"
          component={AppointmentBookedScreen}
          options={{
            headerShown: true,
            headerTitle: "Appointment Booked",
            headerTitleAlign: "center",
						headerTintColor: activeColors.tint,
						headerStyle: {
							backgroundColor: activeColors.primary
						}
          }}
        />

        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: "Appointment Details",
            headerTitleAlign: "center",
						headerTintColor: activeColors.tint,
						headerStyle: {
							backgroundColor: activeColors.primary
						}
          }}
        />

        <Stack.Screen
          name="ArticleDetails"
          component={ArticleDetails}
          options={({ route }) => ({
            title: route.params.title,
            headerShown: true,
            headerTitle: "Article Details", // Menggunakan judul dari parameter rute
            headerTitleAlign: "center",
						headerTintColor: activeColors.tint,
						headerStyle: {
							backgroundColor: activeColors.primary
						}
          })}
					initialParams={{
            image: null,
            title: "",
            content: "",
          }}
        />

        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ 
            headerShown: true,
            headerTitle: "History Pemeriksaan",
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
            }}
        />
        
        <Stack.Screen
          name="HistoryDetails"
          component={HistoryDetailsScreen}
          options={{ 
            headerShown: true,
            headerTitle: "Detail Informasi",
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
            }}
        />

        <Stack.Screen
          name="ReportBug"
          component={ReportScreen}
          options={{
            headerTitle: "Report Bug",
            headerShown: true,
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="ContactUs"
          component={ContactScreen}
          options={{
            headerTitle: "Contact Us",
            headerShown: true,
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ForgotPass"
          component={ForgotPasswordScreen}
          options={({ navigation }) => ({
            headerTitle: "",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  as={Ionicons}
                  name="chevron-back-outline"
                  size={7}
                  ml={3}
                  color="black"
                />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Tabs"
          component={MenuBar}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
          }}
          name="MyProfile"
          component={MyProfileScreen}
        />

        <Stack.Screen
          options={{
            headerTitle: "Reset Password",
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
          }}
          name="ResetPassword"
          component={ResetPasswordScreen}
        />

        <Stack.Screen
          name="RoomChat"
          component={RoomChatScreen}
          options={({ route }) => ({
            title: route.params.userName,
            headerStyle: {
              backgroundColor: activeColors.primary,
            },
            headerTintColor: activeColors.tint,
            headerTitleAlign: "center",
          })}
          initialParams={{ messageText: "", userImg: null }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStack;
