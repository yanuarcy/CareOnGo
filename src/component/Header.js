import React from "react";
import { View, TouchableOpacity, StatusBar, TextInput } from "react-native";
import { Box, Text, Input, Flex, Icon } from "native-base";
// import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


const Header = (props) => {
  return (
    <Box>
      <Flex direction="row">
        {/* <Input
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
        </TouchableOpacity> */}
        <Input
          w={{
            base: "100%",
            md: "25%",
          }}
          InputLeftElement={
            <Icon as={Ionicons} name="search" size={7} ml="2" color="black" />
          }
          value={props.pencarian}
          onChangeText={(text) => props.setPencarian(text)}
          placeholder="Search Artikel..."
          placeholderTextColor={"black"}
          backgroundColor={"#E4F1FF"}
          borderWidth={0}
          rounded={24}
          fontSize={16}
          mt={6}
        />
      </Flex>
    </Box>
  );
};

export default Header;
