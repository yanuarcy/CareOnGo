import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from "react-native";
import { Box, Text, ScrollView, Image, Flex, Modal } from "native-base";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../../component/theme";
import { ThemeContext } from "../../component/themeContext";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { firebaseConfig } from "../../../firebase-config";
import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";

const SECTIONS = [
  {
    header: "Account",
    icon: "user",
    items: [
      {
        id: "MyProfile",
        icon: "user",
        color: "#32c759",
        label: "My Profile",
        type: "link",
      },
      {
        id: "ChangePassword",
        icon: "lock",
        color: "#fd2d54",
        label: "Change Password",
        type: "link",
      },
    ],
  },
  {
    header: "Preferences",
    icon: "settings",
    items: [
      // {
      //   id: "Language",
      //   icon: "globe",
      //   color: "#fe9400",
      //   label: "Language",
      //   type: "link",
      // },
      {
        id: "darkMode",
        icon: "moon",
        color: "#007afe",
        label: "Dark Mode",
        type: "toogle",
      },
      // {
      //   id: "wifi",
      //   icon: "wifi",
      //   color: "#007afe",
      //   label: "Use Wi-Fi",
      //   type: "toogle",
      // },
      // {
      //   id: "Location",
      //   icon: "navigation",
      //   color: "#32c759",
      //   label: "Location",
      //   type: "link",
      // },
      // {
      //   id: "showCollaborators",
      //   icon: "users",
      //   color: "#32c759",
      //   label: "Show collaborators",
      //   type: "toogle",
      // },
      // {
      //   id: "accessbilityMode",
      //   icon: "airplay",
      //   color: "#fd2d54",
      //   label: "Accesbility mode",
      //   type: "toogle",
      // },
    ],
  },
  {
    header: "Content",
    icon: "align-center",
    items: [
      {
        id: "History",
        icon: "save",
        color: "#32c759",
        label: "History Pemeriksaan",
        type: "link",
      },
      // {
      //   icon: "download",
      //   color: "#fd2d54",
      //   label: "Downloads",
      //   type: "link",
      //  },
    ],
  },
  {
    header: "Support",
    icon: "help-circle",
    items: [
      {
        id: "ReportBug",
        icon: "flag",
        color: "#8e8d91",
        label: "Report Bug",
        type: "link",
      },
      {
        id: "ContactUs",
        icon: "mail",
        color: "#007afe",
        label: "Contact Us",
        type: "link",
      },
      // {
      //   id: "AddAccount",
      //   icon: "users",
      //   color: "#32c759",
      //   label: "Add Account",
      //   type: "link",
      // },
      {
        id: "LogOut",
        icon: "log-out",
        color: "#fd2d54",
        label: "Log out",
      },
    ],
  },
];

const ProfileScreen = () => {
  const Stack = createStackNavigator();
  const navigation = useNavigation();
  const auth = getAuth();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);
  const storage = getStorage(DB);

  // const theme = { mode: "light" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [form, setForm] = useState({
    darkMode: false,
    wifi: false,
    showCollaborators: true,
    accessibilityMode: false,
  });

  const [isActive, setIsActive] = useState(theme.mode === "dark");
  const toggleDarkMode = () => {
    updateTheme();
    setIsActive((previousState) => !previousState);
  };

  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onRefresh = async () => {
    // Lakukan proses pembaruan data di sini
    // Contoh: panggil fungsi untuk mengambil data baru
    // dan atur refreshing ke false setelah selesai
    setRefreshing(true);
    await reloadUserData(); // Ganti dengan fungsi yang sesuai untuk memuat ulang data
    setRefreshing(false);
  };

  const reloadUserData = async () => {
    try {
      const credentials = await AsyncStorage.getItem("credentials");
      if (credentials) {
        const user = JSON.parse(credentials);
        // Lakukan sesuatu dengan data pengguna yang sudah dimuat ulang, misalnya:
        setUserData(user);
      }
    } catch (error) {
      console.error("Error reloading user data: ", error);
    }
  };

  // const userId = userData.uid;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    const uploadImage = async () => {
      const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request Failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });
      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, "Profile/" + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);

            const updateFirestore = async (NewPicture) => {
              try {
                const userId = userData.uid;
                console.log(userId);
                const userCollection = collection(firestore, "users");
                const userDocRef = doc(userCollection, userId);
                await updateDoc(userDocRef, { picture: NewPicture });
              } catch (error) {
                console.error("Error: ", error);
              }
            };

            const updateProfile = async (NewPicture) => {
              const credentials = await AsyncStorage.getItem("credentials");
              if (credentials) {
                const updatedCredentials = JSON.parse(credentials);
                updatedCredentials.picture = NewPicture;
                await AsyncStorage.setItem(
                  "credentials",
                  JSON.stringify(updatedCredentials)
                );
                console.log(NewPicture);
              }
              await reloadUserData();
            };
            updateFirestore(downloadURL);
            updateProfile(downloadURL);
          });
        }
      );
    };
    if (image != null) {
      uploadImage();
      setImage(null);
    }

    // Ambil data dari AsyncStorage saat komponen dipasang (mounted)
    // AsyncStorage.getItem("credentials")
    //   .then(async (data) => {
    //     if (data) {
    //       const credentials = JSON.parse(data);
    //       // const userCollection = collection(firestore, "users");
    //       // const userDocRef = doc(userCollection, credentials.uid);
    //       setUserData(credentials);
    //     }
    //   })
    //   .catch((error) => console.log(error));
    reloadUserData();
  }, [image]);

  console.log(userData);
  const handleLogout = async () => {
    try {
      // Lakukan logout dari Firebase Authentication
      await signOut(auth);

      // Hapus informasi pengguna yang disimpan di AsyncStorage jika ada
      await AsyncStorage.removeItem("credentials");
      await AsyncStorage.removeItem("MedicalRecord");

      // Navigasikan pengguna kembali ke halaman login
      navigation.replace("Login");
    } catch (error) {
      console.log(error);
      // Tampilkan pesan error jika diperlukan
    }
  };

  const sectionsHandler = (id, navigation) => {
    if (id === "MyProfile") {
      navigation.navigate("MyProfile");
    } else if (id === "Location") {
      navigation.navigate("Location");
    } else if (id === "History") {
      navigation.navigate("History");
    } else if (id === "ReportBug") {
      navigation.navigate("ReportBug");
    } else if (id === "ContactUs") {
      navigation.navigate("ContactUs");
    } else if (id === "AddAccount") {
      navigation.navigate("Register");
    } else if (id === "ChangePassword") {
      navigation.navigate("ResetPassword");
    } else if (id === "LogOut") {
      if (theme.mode === "dark") {
        updateTheme();
      }
      setIsActive(false);

      handleLogout();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        flex={1}
        backgroundColor={activeColors.primary}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Body>
                <Image
                  alt="Selected Image"
                  source={
                    userData && userData.picture
                      ? { uri: userData.picture }
                      : require("../../../assets/Chat/ProfileDefault.jpeg")
                  }
                  w={"100%"}
                  h={400}
                  resizeMode="contain"
                />
              </Modal.Body>
            </Modal.Content>
          </Modal>
        )}
        <Box paddingY={6}>
          <Box p={6} alignItems={"center"} justifyContent={"center"}>
            <Box position={"relative"}>
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Image
                  alt="Profile Picture"
                  // source={require("../../../assets/Chat/user-2.jpg")}
                  source={
                    userData && userData.picture
                      ? { uri: userData.picture }
                      : require("../../../assets/Chat/ProfileDefault.jpeg")
                  }
                  w={"110"}
                  h={"110"}
                  rounded={99999}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => pickImage()}>
                <Box
                  w={10}
                  h={10}
                  rounded={99999}
                  backgroundColor={"#007bff"}
                  position={"absolute"}
                  right={-1}
                  bottom={-5}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <FeatherIcon name="edit-3" size={15} color="#fff" />
                </Box>
              </TouchableOpacity>
            </Box>

            {userData && (
              <>
                <Text
                  mt={5}
                  fontSize={19}
                  fontWeight={600}
                  color={activeColors.tint}
                  textAlign={"center"}
                >
                  {userData.namaLengkap}
                </Text>
                <Text
                  mt={2}
                  fontSize={14}
                  fontWeight={400}
                  color={activeColors.tertiary}
                  textAlign={"center"}
                >
                  ID : {userData.id}
                </Text>
                <Text
                  mt={1}
                  fontSize={15}
                  fontWeight={600}
                  color={activeColors.tertiary}
                  textAlign={"center"}
                >
                  {userData.email}
                </Text>
              </>
            )}
          </Box>

          {SECTIONS.map(({ header, items }) => (
            <Box px={6} key={header}>
              <Text
                py={3}
                fontSize={12}
                fontWeight={600}
                color={"#9e9e9e"}
                textTransform={"uppercase"}
                letterSpacing={1.1}
              >
                {header}
              </Text>

              {items.map(({ id, label, type, icon, color }) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => sectionsHandler(id, navigation)}
                >
                  <Box
                    alignItems={"center"}
                    justifyContent={"center"}
                    h={12}
                    backgroundColor={activeColors.secondary}
                    rounded={9}
                    mb={3}
                    py={3}
                  >
                    <Flex direction="row" alignItems={"center"} padding={3}>
                      <Box
                        w={8}
                        h={8}
                        rounded={9999}
                        alignItems={"center"}
                        justifyContent={"center"}
                        mr={3}
                        backgroundColor={color}
                      >
                        <FeatherIcon name={icon} color={"#fff"} size={18} />
                      </Box>

                      <Text fontSize={17} color={activeColors.tint}>
                        {label}
                      </Text>

                      <Box flex={1} />

                      {type === "toogle" && (
                        <Switch
                          value={form[id]}
                          onValueChange={(value) => {
                            setForm({ ...form, [id]: value });
                            if (id === "darkMode") {
                              toggleDarkMode();
                            }
                          }}
                        />
                      )}

                      {type === "link" && (
                          <TouchableOpacity
                            onPress={() => {
                              if (id === "MyProfile") {
                                navigation.navigate("MyProfile");
                              } else {
                                // Tindakan lainnya untuk tautan lain
                              }
                            }}
                          >
                            {/* ... */}
                          </TouchableOpacity>
                        ) && (
                          <FeatherIcon
                            name="chevron-right"
                            color={activeColors.tint}
                            size={22}
                          />
                        )}
                    </Flex>
                  </Box>
                </TouchableOpacity>
              ))}
            </Box>
          ))}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
