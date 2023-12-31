import { useContext, useEffect, useState } from "react";
import {
  Box,
  ScrollView,
  Text,
  Center,
  Button,
  FlatList,
  Flex,
  Image,
  HStack,
  Input,
  Icon,
  Modal,
  InputGroup,
  InputLeftAddon,
} from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  Alert,
  Keyboard,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

const Messages = [
  {
    id: "1",
    userName: "Jenny Doe",
    userImg: require("../../assets/Chat/Doctor-1.jpg"),
    messageTime: "3:41",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    userImg: require("../../assets/Chat/Doctor-3.png"),
    messageTime: "0:48",
    messageText:
      "The doctor's reassuring words were a soothing balm, easing the patient's worries with each gentle explanation.",
  },
  {
    id: "3",
    userName: "Ken William",
    userImg: require("../../assets/Chat/Doctor-2.png"),
    messageTime: "21:42",
    messageText:
      "As the doctor discussed treatment options, a sense of hope painted the patient's outlook with a newfound sense of possibilities.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    userImg: require("../../assets/Chat/Doctor-5.jpg"),
    messageTime: "18:37",
    messageText:
      "Within the quiet confines of the clinic, the doctor's guidance flowed like a refreshing stream of knowledge, providing comfort to the patient..",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: require("../../assets/Chat/Doctor-4.jpg"),
    messageTime: "18:02",
    messageText:
      "Sitting in the doctor's office, the patient found solace in the expert's advice, as it lit a path toward better health and well-being.",
  },
];

const PesanScreen = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const isFocused = useIsFocused();
  const [refreshChat, setRefreshChat] = useState(false);

  const navigation = useNavigation();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const [isLoading, setLoading] = useState(true);
  const [pencarian, setPencarian] = useState("");
  const [Friend, setFriend] = useState("");
  const [retrievedUid, setRetrievedUid] = useState("");
  const [userDataChat, setUserDataChat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const filterChatByName = (userName) => {
    return userDataChat.filter((chat) =>
      chat.namaLengkap.toLowerCase().includes(userName.toLowerCase())
    );
  };

  const onRefresh = async () => {
    // Lakukan proses pembaruan data di sini
    // Contoh: panggil fungsi untuk mengambil data baru
    // dan atur refreshing ke false setelah selesai
    setRefreshing(true);
    await retrieveUidFromStorage(); // Ganti dengan fungsi yang sesuai untuk memuat ulang data
    setRefreshing(false);
  };

  const getLastMessage = async (userId, friendId) => {
    try {
      const sortedIds = [userId, friendId].sort(); // Membuat string dari id yang diurutkan

      const chatRef = collection(firestore, "chats");
      const chatQuery = query(chatRef, where("members", "==", sortedIds));

      const chatSnapshot = await getDocs(chatQuery);

      let latestMessage = "";
      let latestcreateAt = null;

      if (!chatSnapshot.empty) {
        for (const doc of chatSnapshot.docs) {
          const chatID = doc.id;
          const messageRef = collection(firestore, "chats", chatID, "messages");
          const messagesSnapshot = await getDocs(messageRef);

          if (!messagesSnapshot.empty) {
            let allMessages = [];
            messagesSnapshot.forEach((messageDoc) => {
              const messageData = messageDoc.data();
              if (messageData.content && messageData.content.length > 0) {
                allMessages = [...allMessages, ...messageData.content];
              }
            });

            allMessages.sort((a, b) => {
              return a.createdAt.toDate() - b.createdAt.toDate();
            });

            const lastMessage = allMessages[allMessages.length - 1];
            // console.log("Last Message:", lastMessage);

            if (lastMessage && lastMessage.text && lastMessage.createdAt) {
              const messageCreatedAt = lastMessage.createdAt.toDate();

              // Membandingkan dengan pesan terbaru yang ditemukan
              if (
                !latestMessage.createdAt ||
                messageCreatedAt > latestMessage.createdAt
              ) {
                latestMessage = lastMessage.text;
                latestcreateAt = messageCreatedAt;
              }
            }
          } else {
            // console.log("No messages found.");
          }
        }

        // console.log("Lates Messages Fix: ", latestMessage);
      } else {
        // console.log("No chat found.");
      }

      return [latestMessage, latestcreateAt];
    } catch (error) {
      console.error("Error getting last message:", error);
      return "";
    }
  };

  const retrieveUidFromStorage = async () => {
    try {
      const credentials = await AsyncStorage.getItem("credentials");
      const user = JSON.parse(credentials);
      setRetrievedUid(user);

      const doctorRef = collection(firestore, "users");
      const friendQuery = query(
        doctorRef,
        where("friends", "array-contains", user.namaLengkap)
      );
      const querySnapshot = await getDocs(friendQuery);

      const DataUsers = [];
      const promises = [];

      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const promise = getLastMessage(user.id, userData.id)
          .then(([latestMessage, latestCreatedAt]) => {
            DataUsers.push({
              id: doc.id,
              ...userData,
              lastMessage: latestMessage,
              lastCreatedAt: latestCreatedAt,
            });
          })
          .catch((error) => {
            console.error("Error retrieving message:", error);
          });

        promises.push(promise);
      }

      await Promise.all(promises);
      const sortedData = DataUsers.sort(
        (a, b) => b.lastCreatedAt - a.lastCreatedAt
      );
      setUserDataChat(sortedData);
      // setUserDataChat(DataUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving uid:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      // Lakukan sesuatu saat halaman fokus, misalnya refresh chat
      // setRefreshChat(prevState => !prevState); // Trigger refresh dengan mengubah state
      retrieveUidFromStorage();
      // const sortedData = [...userDataChat].sort((a, b) => {
      //   return b.lastCreatedAt - a.lastCreatedAt;
      // });
      // setUserDataChat(sortedData);
    }
  }, [isFocused]);

  // useEffect(() => {
  //   if (!isLoading) {
  //     // Urutkan userDataChat berdasarkan lastCreatedAt dari yang terbaru ke yang terlama
  //     const sortedData = [...userDataChat].sort((a, b) => {
  //       return b.lastCreatedAt - a.lastCreatedAt;
  //     });
  //     setUserDataChat(sortedData);
  //   }
  // }, [isLoading]);

  // useEffect(() => {
  //   // setUserDataChat(DataUsers);
  //   retrieveUidFromStorage();
  // }, []);

  console.log("Data ini kerefresh", userDataChat);
  const addFriend = async () => {
    try {
      const DataUsers = [];

      if (retrievedUid) {
        const userRef = doc(firestore, "users", retrievedUid.uid);

        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const friendToAdd = Friend;

          const doctorRef = collection(firestore, "users");
          const friendQueryByName = query(
            doctorRef,
            where("namaLengkap", "==", friendToAdd)
          );
          const querySnapshotByName = await getDocs(friendQueryByName);

          const friendQueryById = query(
            doctorRef,
            where("id", "==", friendToAdd)
          );
          const querySnapshotById = await getDocs(friendQueryById);

          const combinedSnapshot = querySnapshotByName.docs.concat(
            querySnapshotById.docs
          );

          if (combinedSnapshot.length == 0) {
            Alert.alert(
              "Error",
              "Tidak ada teman dengan ID atau nama lengkap tersebut."
            );
          } else if (friendToAdd == retrievedUid.namaLengkap || friendToAdd == retrievedUid.id) {
            Alert.alert(
              "Error",
              "Anda tidak bisa menambahkan diri anda sendiri!"
            );
          } else if (
            friendToAdd !== retrievedUid.namaLengkap &&
            (!userData.friends ||
              !userData.friends.includes ||
              !userData.friends.includes(friendToAdd))
          ) {
            await updateDoc(userRef, {
              friends: arrayUnion(friendToAdd),
            });
            console.log("Berhasil menambahkan Teman: ", friendToAdd);
            setFriend("");
            setShowModal(false);

            if (combinedSnapshot.length > 0) {
              combinedSnapshot.forEach(async (doc) => {
                DataUsers.push({ id: doc.id, ...doc.data() });
                const friendDocRef = doc.ref;

                // Mendapatkan data teman untuk mendapatkan friends saat ini
                const friendData = doc.data();
                const currentFriends = friendData.friends || [];

                // Pastikan retrievedUid.namaLengkap belum ada dalam currentFriends
                if (!currentFriends.includes(retrievedUid.namaLengkap)) {
                  // Tambahkan retrievedUid.namaLengkap ke dalam array currentFriends
                  currentFriends.push(retrievedUid.namaLengkap);

                  // Update field 'friends' dengan array yang telah diperbarui
                  await updateDoc(friendDocRef, { friends: currentFriends });
                  console.log("Anda sudah berhasil ditambahkan sebagai Teman");
                } else {
                  console.log("Anda sudah berteman dengan orang ini.");
                }
              });
              setUserDataChat(DataUsers);
            } else {
              console.log("Tidak ada teman dengan nama lengkap tersebut.");
            }
          } else {
            Alert.alert("Info", "Teman sudah ada dalam daftar teman Anda");
          }
        } else {
          console.log("Pengguna tidak ditemukan.");
        }
      } else {
        console.log("Tidak ada uid yang ditemukan di AsyncStorage.");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const deleteFriendAlert = (friendName, friendUid) => {
    Alert.alert(
      "Hapus Obrolan",
      "Apakah Anda yakin ingin menghapus obrolan ini?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteFriend(friendName, friendUid) }, // Panggil fungsi untuk menghapus teman saat ditekan
      ],
      { cancelable: true }
    );
  };

  const deleteFriend = async (friendName, friendUid) => {
    try {
      // Menghapus teman dari koleksi 'users' Anda
      const userRef = doc(firestore, "users", retrievedUid.uid);
      await updateDoc(userRef, {
        friends: arrayRemove(friendName),
      });
      console.log("Anda telah berhasil menghapus teman anda");

      // Hapus diri Anda dari daftar teman temanId
      const friendRef = doc(firestore, "users", friendUid);
      const friendSnapshot = await getDoc(friendRef);
      if (friendSnapshot.exists()) {
        const friendData = friendSnapshot.data();
        const FriendId = friendData.id;
        const updatedFriends = friendData.friends.filter(
          (friend) => friend !== retrievedUid.namaLengkap
        );

        // Update daftar teman temanId
        await updateDoc(friendRef, {
          friends: updatedFriends,
        });

        console.log("Diri anda telah berhasil dihapus dari daftar teman dia");

        const sortedIds = [retrievedUid.id, FriendId].sort();
        const chatQuery = query(
          collection(firestore, "chats"),
          where("members", "==", sortedIds)
        );

        const chatSnapshot = await getDocs(chatQuery);

        chatSnapshot.forEach(async (doc) => {
          // Hapus dokumen chat yang memiliki kedua ID dalam array 'members'
          await deleteDoc(doc.ref);
          console.log("Dokumen chat telah berhasil dihapus");
        });
      }

      // Hapus teman dari state userDataChat
      const updatedData = userDataChat.filter(
        (friend) => friend.namaLengkap !== friendName
      );
      setUserDataChat(updatedData);

      // Kirim notifikasi ke teman Anda
      // sendNotificationToFriend(friendId, friendName);
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  const formatDate = (date) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(date).toLocaleTimeString([], options);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Box flex={1}>
        <Box flex={1} pl={5} pr={5} backgroundColor={activeColors.primary}>
          <Center>
            <Box mt={4}>
              <HStack alignItems="center" space={2} p={2} rounded="md">
                <Input
                  w={{
                    base: "87%",
                    md: "25%",
                  }}
                  InputLeftElement={
                    <Icon
                      as={Ionicons}
                      name="search"
                      size={7}
                      ml="2"
                      color="black"
                    />
                  }
                  value={pencarian}
                  onChangeText={(pencarian) => setPencarian(pencarian)}
                  placeholder="Search Name.."
                  placeholderTextColor={"black"}
                  backgroundColor={"#E4F1FF"}
                  borderWidth={0}
                  rounded={24}
                  fontSize={16}
                />
                {showModal && (
                  <Modal
                    isOpen={showModal}
                    onClose={() => {
                      setShowModal(false);
                    }}
                  >
                    <Modal.Content>
                      <Modal.CloseButton />
                      <Modal.Body>
                        <Input
                          value={Friend}
                          onChangeText={(Friend) => setFriend(Friend)}
                          placeholder="ID or Username"
                          color={activeColors.tint}
                          placeholderTextColor={activeColors.tint}
                          size="sm"
                          w={"87%"}
                          rounded={24}
                        />
                        <Button onPress={addFriend} mt={4} borderRadius={10}>
                          Add
                        </Button>
                      </Modal.Body>
                    </Modal.Content>
                  </Modal>
                )}
                <TouchableOpacity onPress={() => setShowModal(true)}>
                  <Box backgroundColor={"#0082f7"} p={2} rounded={12}>
                    <Icon as={Ionicons} name="add" size={6} color={"white"} />
                  </Box>
                </TouchableOpacity>
              </HStack>
            </Box>
            {isLoading ? (
              <Center flex={1} justifyContent={"center"}>
                {/* <Spinner size="lg" color={"black"} /> */}
                <LottieView
                  style={{
                    width: 70,
                    height: 170,
                    marginTop: 150,
                  }}
                  source={require("../../assets/LoadingAnimation.json")}
                  autoPlay
                  loop={true}
                  speed={1.5}
                />
              </Center>
            ) : userDataChat.length === 0 ? (
              <>
                <Center flex={1} justifyContent={"center"}>
                  {/* <Spinner size="lg" color={"black"} /> */}
                  <LottieView
                    style={{
                      width: 70,
                      height: 170,
                      marginTop: 120,
                    }}
                    source={require("../../assets/EmptyAnimation.json")}
                    autoPlay
                    loop={true}
                    speed={1}
                  />
                </Center>
                <Text
                  textAlign= "center"
                  fontWeight= {500}
                  fontSize= {18}
                  marginTop= {280}
                  color={activeColors.tint}
                >
                  Chat Masih Kosong
                </Text>
                {retrievedUid.role === "Doctor" ? (
                  <Text textAlign= "center" fontSize= {14} color={activeColors.tertiary}>
                    Semua chat akan tersimpan di sini.
                  </Text>
                ) : (
                  <>
                    <Text textAlign= "center" fontSize= {14} color={activeColors.tertiary}>
                      Semua chat akan tersimpan di sini. Ayo mulai chat gratis
                      dengan Dokterku, dokter spesialis, dan psikolog
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Doctor")}
                      style={{
                        marginTop: 20,
                        backgroundColor: "#0082f7",
                        borderRadius: 8,
                      }}
                    >
                      <Text color={"white"} p={3} px={6}>
                        Chat Sekarang
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <FlatList
                data={filterChatByName(pencarian)}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() =>
                  // Menampilkan LottieView jika pencarian kosong
                  pencarian.trim() === "" && doctorData.length === 0 ? (
                    ""
                  ) : (
                    <>
                      <Center flex={1} justifyContent={"center"}>
                        <LottieView
                          style={{
                            width: 70,
                            height: 170,
                            marginTop: 50,
                          }}
                          source={require("../../assets/EmptyAnimation.json")}
                          autoPlay
                          loop={true}
                          speed={1.5}
                        />
                      </Center>
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: 500,
                          fontSize: 18,
                          marginTop: 50,
                        }}
                      >
                        Data tidak ditemukan
                      </Text>
                    </>
                  )
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ width: "100%" }}
                    onPress={() =>
                      navigation.navigate("RoomChat", {
                        userName: item.namaLengkap,
                        userId: item.id,
                        userImg: item.picture,
                        userEmail: item.email,
                      })
                    }
                    onLongPress={() =>
                      deleteFriendAlert(item.namaLengkap, item.uid)
                    }
                  >
                    <Box justifyContent={"space-between"}>
                      <Flex direction="row">
                        <Box pt={4} pb={2}>
                          {showModal2 && (
                            <Modal
                              isOpen={showModal2}
                              onClose={() => {
                                setShowModal2(false);
                                setSelectedData(null);
                              }}
                            >
                              <Modal.Content>
                                <Modal.CloseButton />
                                <Modal.Body backgroundColor={activeColors.secondary}>
                                  <Image
                                    alt="Selected Image"
                                    source={
                                      selectedData.picture
                                        ? { uri: selectedData.picture }
                                        : require("../../assets/Chat/ProfileDefault.jpeg")
                                    }
                                    w={"100%"}
                                    h={400}
                                    resizeMode="contain"
                                  />
                                  <Text
                                    mt={2}
                                    fontSize={14}
                                    fontWeight={400}
                                    color={activeColors.tertiary}
                                    textAlign={"center"}
                                  >
                                    ID : {selectedData.id}
                                  </Text>
                                  <Text
                                    mt={1}
                                    fontSize={15}
                                    fontWeight={600}
                                    mb={4}
                                    color={activeColors.tint}
                                    textAlign={"center"}
                                  >
                                    {selectedData.email}
                                  </Text>
                                </Modal.Body>
                              </Modal.Content>
                            </Modal>
                          )}
                          <TouchableOpacity
                            onPress={() => {
                              setShowModal2(true);
                              setSelectedData(item);
                            }}
                          >
                            <Image
                              w={"60"}
                              h={"60"}
                              rounded={"35"}
                              source={
                                item.picture
                                  ? { uri: item.picture }
                                  : require("../../assets/Chat/ProfileDefault.jpeg")
                              }
                              alt="ProfileUserChat"
                            />
                          </TouchableOpacity>
                        </Box>

                        <Box
                          justifyContent={"center"}
                          p={"15"}
                          pl={0}
                          ml={"3"}
                          w={"300"}
                          // borderBottomWidth={"1"}
                          // borderBottomColor={"#cccccc"}
                        >
                          <Flex direction="column">
                            <Box mb={"1"}>
                              <Flex direction="row">
                                <HStack space={40}>
                                  <Text
                                    fontSize={"14"}
                                    fontWeight={"bold"}
                                    color={activeColors.tint}
                                  >
                                    {item.namaLengkap}
                                  </Text>
                                  <Box
                                    ml={(() => {
                                      if (item.namaLengkap.length > 11) {
                                        return -12;
                                      } else if (item.namaLengkap.length > 10) {
                                        return -8;
                                      } else if (item.namaLengkap.length > 6) {
                                        return 1;
                                      } else if (item.namaLengkap.length > 5) {
                                        return -2;
                                      }
                                    })()}
                                  >
                                    <Text
                                      fontSize={12}
                                      color={activeColors.tint}
                                    >
                                      {formatDate(item.lastCreatedAt)}
                                    </Text>
                                  </Box>
                                </HStack>
                              </Flex>
                            </Box>
                            {/* <Text fontSize={"14"} mr={10} color={activeColors.tertiary}>
                          {item.messageText}
                        </Text> */}
                            <Text fontSize={"14"} color={activeColors.tertiary}>
                              {item.lastMessage
                                ? item.lastMessage.length > 33
                                  ? item.lastMessage.slice(0, 33) + "..."
                                  : item.lastMessage
                                : "No message available"}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  </TouchableOpacity>
                )}
              />
            )}
          </Center>
        </Box>
        {/* </ScrollView> */}
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default PesanScreen;
