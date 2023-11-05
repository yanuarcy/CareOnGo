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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";


const RegisterScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

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
                placeholder="Name"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
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
                placeholder="Email"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
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
                placeholder="Phone"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
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
                placeholder="Password"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
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
                placeholder="Confirm Password"
                placeholderTextColor={'black'}
                backgroundColor={"#E4F1FF"}
                borderWidth={0}
                rounded={6}
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