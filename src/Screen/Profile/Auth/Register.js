import {
  Box,
  Text,
  Center,
  Spacer,
  Stack,
  Input,
  Icon,
  Button,
  VStack,
  Pressable
} from "native-base";
import {
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";


const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const nama = "Usertest";
  const email = "Usertest@gmail.com";
  const phone = "123456789";
  const password = "Usertest";
  const confirmpassword = "Usertest";

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };


  const handleRegister = (Name, Email, Phone,Password,ConfirmPassword) => {
    if (Name.trim() === "" || Email.trim() === ""|| Phone.trim() === "" || Password.trim() === "" || ConfirmPassword.trim() === "" ) {
      Alert.alert(
        "Error",
        "Mohon isi semua kolom password."
      )
    } 
    else if(Name !== "Usertest") {
      Alert.alert(
        "Error",
        "Nama tidak cocok."
      );
    }
    
    else if(Email !== "Usertest@gmail.com") {
      Alert.alert(
        "Error",
        "Email tidak cocok."
      );
    }
    else if(Phone !== "123456789") {
      Alert.alert(
        "Error",
        "Phone tidak cocok."
      );
    }
    else if(Password !== "Usertest") {
      Alert.alert(
        "Error",
        "Password tidak cocok."
      );
    }
    else if(ConfirmPassword !== "Usertest") {
      Alert.alert(
        "Error",
        "confirmPassword tidak cocok."
      );
    }

    else if(Name === "Usertest" && Email === "Usertest@gmail.com" && Phone === "123456789" && Password === "Usertest" && ConfirmPassword === "Usertest") {
      Alert.alert("Success", "Akun anda berhasil dibuat")
      navigation.replace("Tabs");
    }
    
    else {
      
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <Box flex={1}>
        <Center>
          <Spacer mt="8">
            <Text fontSize={32} color={"#0082f7"} fontWeight={"bold"}>
              Create Account
            </Text>
          </Spacer>
          <Spacer mt="6">
            <Text
              fontSize={16}
              maxW={250}
              textAlign={"center"}
              fontWeight={"bold"}
            >
              Create an Account, Cherish Your Health
            </Text>
          </Spacer>

          <Spacer p="18" mt="5">
            <Stack space={4} w="100%" alignItems="center">
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon
                    as={MaterialIcons}
                    name="person"
                    size={5}
                    ml="2"
                    color="black"
                  />
                }
                value={Name}
                onChangeText={(Name) => setName(Name)}
                placeholder="Name"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() =>
                  setName(!Name)
                }
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon
                    as={Ionicons}
                    name="at-outline"
                    size={5}
                    ml="2"
                    color="black"
                  />
                }
                value={Email}
                onChangeText={(Email) => setEmail(Email)}
                placeholder="Email"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() =>
                  setEmail(!Email)
                }
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                InputLeftElement={
                  <Icon
                    as={Ionicons}
                    name="call-outline"
                    size={5}
                    ml="2"
                    color="black"
                  />
                }
                value={Phone}
                onChangeText={(Phone) => setPhone(Phone)}
                placeholder="Phone"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() =>
                  setPhone(!Phone)
                }
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                type={showPassword ? "text" : "password"}
                InputLeftElement={
                  <Icon 
                    as={MaterialIcons}
                    name="lock"
                    size={5}
                    ml="2"
                    color={"black"}
                  />
                }
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={MaterialIcons}
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={5}
                      mr="2"
                      color="black"
                    />
                  </Pressable>
                }
                value={Password}
                onChangeText={(Password) => setPassword(Password)}
                placeholder="Password"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() =>
                  setPassword(!Password)
                }
              />
              <Input
                w={{
                  base: "95%",
                  md: "25%",
                }}
                type={showPassword ? "text" : "password"}
                InputLeftElement={
                  <Icon 
                    as={MaterialIcons}
                    name="lock"
                    size={5}
                    ml="2"
                    color={"black"}
                  />
                }
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={MaterialIcons}
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={5}
                      mr="2"
                      color="black"
                    />
                  </Pressable>
                }
                value={ConfirmPassword}
                onChangeText={(ConfirmPassword) => setConfirmPassword(ConfirmPassword)}
                placeholder="Confirm Password"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
                onPress={() =>
                  setConfirmPassword(!ConfirmPassword)
                }
              />
            </Stack>
          </Spacer>
        </Center>
        <TouchableOpacity
          style={{
            margin: 26,
            padding: 14,
            backgroundColor: "#0082f7",
            marginVertical: 20,
            borderRadius: 10,
            elevation: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => handleRegister(Name, Email, Phone,Password,ConfirmPassword)}
        >
          <Text
            color={"white"}
            textAlign={"center"}
            fontSize={18}
            fontWeight={"bold"}
          >
            Sign Up
          </Text>
        </TouchableOpacity>

        <Center>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text
              fontWeight={"bold"}
              colorScheme={"light"}
              fontSize={16}
              mt={2}
              mb={6}
            >
              Already have an account
            </Text>
          </TouchableOpacity>
        </Center>
        <Center>
          <Spacer>
            <Text fontSize={16} color={"blue.700"} fontWeight={"bold"}>
              Or continue with
            </Text>
          </Spacer>
        </Center>
        <Center>
          <Box>
            <Stack
              direction={{
                base: "row",
                md: "row",
              }}
              space={4}
              mt={2}
            >
              <Button
                variant="outline"
                leftIcon={
                  <Icon
                    as={Ionicons}
                    name="logo-google"
                    size="md"
                    color="gray"
                    colorScheme="light"
                  />
                }
              ></Button>
              <Button
                variant="outline"
                endIcon={
                  <Icon
                    as={Ionicons}
                    name="logo-apple"
                    size="md"
                    color="gray"
                    colorScheme="light"
                  />
                }
              ></Button>
              <Button
                variant="outline"
                endIcon={
                  <Icon
                    as={Ionicons}
                    name="logo-facebook"
                    size="md"
                    color="gray"
                    colorScheme="light"
                  />
                }
              ></Button>
            </Stack>
          </Box>
        </Center>
      </Box>
    </TouchableWithoutFeedback>
  );
};
export default RegisterScreen;