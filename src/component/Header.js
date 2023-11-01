import React from "react";
import { View, TouchableOpacity, StatusBar, TextInput } from "react-native";
import { Box, Text, Input, Flex } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";

const Header = (props) => {
  return (
    <Box>
      <Flex direction="row">
        <Input
          value={props.pencarian}
          onChangeText={(text) => props.setPencarian(text)}
          placeholder="Cari informasi tentang kesehatan / dokter"
          backgroundColor={"#FFFFFF"}
          mt={5}
          pl={3}
          rounded={1}
          flex={1}
        />
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0082F7",
            marginTop: 20,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginLeft: 10,
            elevation: 3,
          }}
        >
          <Icon name="search" size={25} color="#FFFFFF" />
        </TouchableOpacity>
      </Flex>
    </Box>
  );
};

export default Header;