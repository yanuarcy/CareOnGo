import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
// import MenuBar from "./src/component/MenuBar";
import { ThemeContext } from "./src/component/themeContext";
import MenuBar from "./src/component/MenuBar";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "./src/component/theme";
import MyProfileScreen from "./src/Screen/Profile/Account/MyProfile";

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
          <Stack.Navigator>
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
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeContext.Provider>
    </NativeBaseProvider>
  );
};

export default App;
