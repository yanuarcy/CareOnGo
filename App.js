import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import { ThemeContext } from "./src/component/themeContext";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "./src/component/theme";
import AppStack from "./src/component/AppStack";

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
          <AppStack />
        </NavigationContainer>
      </ThemeContext.Provider>
    </NativeBaseProvider>
  );
};

export default App;
