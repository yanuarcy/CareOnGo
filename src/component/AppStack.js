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

const Stack = createStackNavigator();


const AppStack = () => {

    const { theme } = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

    return (
        <>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen
                    name="Language"
                    component={LanguageScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Location"
                    component={LocationScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ headerShown: false }}
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
                        headerTitle: 'Contact Us',
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: activeColors.primary,
                        },
                        headerTintColor: activeColors.tint,
                        headerTitleAlign: "center",
                        }}
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
    )
}

export default AppStack;

