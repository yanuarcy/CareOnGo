import { Box,Text ,Center, Spacer,Stack,Input,Icon,Button,VStack, } from "native-base";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
  const RegisterScreen = () => {
    return (
     <Box flex={1}>
<Center>
    <Spacer mt="39">
    <Text fontSize={32} color={"blue.700"} fontWeight={"bold"}>Create Account</Text>
    </Spacer>
    <Spacer mt="2">
    <Text fontSize={13} maxW={300} textAlign={"center"} fontWeight={"bold"}>Create an account so you can explore all the existing jobs</Text>
    </Spacer>
    <Spacer p="18" mt="5">
    <Stack space={4} w="100%" alignItems="center">
      <Input w={{
      base: "95%",
      md: "25%"
    }}  placeholder="Email"/>
      <Input w={{
      base: "95%",
      md: "25%"
    }}  placeholder="Password" type="password"/>
     <Input w={{
      base: "95%",
      md: "25%"
    }}  placeholder="Confirm Password" type="password"/>
    </Stack>
    </Spacer>
</Center>
    <TouchableOpacity>
    <Box>
    <VStack mt={10} alignItems="center">
        <Button size="lg" w={380} colorScheme="blue">
          Sign up
        </Button>
        </VStack>
    </Box>
    </TouchableOpacity>
    <TouchableOpacity>
    <Center>
    <Button size="lg" variant="link" fontWeight={"bold"}  colorScheme="light">
            Already have an account
          </Button>
    </Center>
    </TouchableOpacity>
    <Center>
    <Spacer mt="39">
    <Text fontSize={16} color={"blue.700"} fontWeight={"bold"}>Or continue with</Text>
    </Spacer>
    </Center>
    <Center>
    <Box>
    <Stack direction={{
    base: "row",
    md: "row"
  }} space={4} mt={5}>
      <Button variant="outline"leftIcon={<Icon as={Ionicons} name="logo-google" size="md"  color="gray" colorScheme="light"/>}>
      </Button>
      <Button variant="outline" endIcon={<Icon as={Ionicons} name="logo-apple" size="md" color="gray" colorScheme="light" />}>
      </Button>
      <Button variant="outline" endIcon={<Icon as={Ionicons} name="logo-facebook" size="md" color="gray" colorScheme="light"/>}>
      </Button>
    </Stack>
    </Box>
    </Center>

     </Box>
    );
  };
export default RegisterScreen;
  
