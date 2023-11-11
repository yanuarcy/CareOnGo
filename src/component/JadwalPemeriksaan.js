import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Box, Text, Image, Flex } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import colors from "./theme";
import { useNavigation } from "@react-navigation/native";

const JadwaL = () => {

  const navigation = useNavigation();

  return (
    <Box>
      <Box mt={5}>
        <Flex direction="row">
          <Text color={"#0082F7"} fontWeight={"bold"}>
            Appointment
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              flex: 1,
            }}
          >
            <Text color={"#FDB436"} fontWeight={"bold"}>
              Lihat Semua
            </Text>
          </TouchableOpacity>
        </Flex>
      </Box>
      <Box>
        <Box rounded={3} mt={3}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 10 }}
            colors={["#018BF7", "#00BAF7"]}
          >
            <TouchableOpacity style={{ padding: 20, borderRadius: 10 }} onPress={() => navigation.navigate('Appointment') }>
              <Box style={{ flexDirection: "row" }}>
                <Image
                  source={require("../image/2.jpg")}
                  alt="Profil Doktor"
                  w={12}
                  h={12}
                  rounded={25}
                  backgroundColor={"#FFFFFF"}
                />
                <Box flex={1} ml={3} justifyContent={"center"}>
                  <Text color={"#FFFFFF"} fontWeight={"bold"}>
                    Dr. Yanu Renandra
                  </Text>
                  <Text color={"#f4f4f4"}>Dokter Umum</Text>
                </Box>
              </Box>

              <Box mt={5}>
                <Box>
                  <Flex direction="row">
                    <Icon name="time" size={25} color="#FFFFFF" />
                    <Box justifyContent={"center"} alignItems={"center"}>
                      <Text color={"#FFFFFF"} ml={2.5}>
                        16 Nov 2023
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Box style={{ flexDirection: "row" }}>
                  <Flex direction="row">
                    <Icon name="compass" size={25} color="#FFFFFF" />
                    <Box
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Text
                      color={"#FFFFFF"}
                      ml={2.5}>
                        Maya Clinic Scottsdale AZ
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Box
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                >
                  <Icon
                    name="chevron-forward-circle"
                    size={35}
                    color="#FFFFFF"
                  />
                </Box>
              </Box>
            </TouchableOpacity>
          </LinearGradient>
        </Box>
      </Box>
    </Box>
  );
};

export default JadwaL;