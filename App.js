import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import MenuBar from "./src/component/MenuBar";
import { ThemeContext } from "./src/component/themeContext";

const App = () => {
  const [theme, setTheme] = useState({ mode: "light" });

  return (
    <NativeBaseProvider>
      <ThemeContext.Provider value={{ theme }}>
        <NavigationContainer>
          <MenuBar />
        </NavigationContainer>
      </ThemeContext.Provider>
    </NativeBaseProvider>
  );
};

export default App;
