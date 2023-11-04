import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
// import MenuBar from "./src/component/MenuBar";
import { ThemeContext } from "./src/component/themeContext";
import MenuBar from "./src/component/MenuBar";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "./src/component/theme";
import MyProfileScreen from "./src/Screen/Profile/Account/MyProfile";
import RoomChatScreen from "./src/Screen/RoomChat";
import WelcomeScreen from "./src/Screen/Welcome";
import LoginScreen from "./src/Screen/Profile/Auth/Login";
import RegisterScreen from "./src/Screen/Profile/Auth/Register";

const Stack = createStackNavigator();

const App = () => {
  const [theme, setTheme] = useState({ mode: "light" });

  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    setTheme(newTheme);
  };

  // const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  return (
    <NativeBaseProvider>
      <ThemeContext.Provider value={{ theme, updateTheme }}>
        <NavigationContainer>
          {/* <MenuBar /> */}
          <Stack.Navigator initialRouteName="Welcome">

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
              name="RoomChat"
              component={RoomChatScreen}
              options={({route}) => ({
                title: route.params.userName,
                headerStyle: {
                  backgroundColor: activeColors.primary,
                },
                headerTintColor: activeColors.tint,
                headerTitleAlign: "center",
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeContext.Provider>
    </NativeBaseProvider>
  );
};

export default App;