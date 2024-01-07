import { useCallback, useContext, useEffect, useState } from "react";
import { Box, ScrollView, Text, Center, View, Image, Modal } from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const RoomChatScreen = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  const route = useRoute();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const initialUserId = route.params ? route.params.userId : "";
  const initialUserImg = route.params ? route.params.userImg : null;
  const initialUserName = route.params ? route.params.userName : null;
  const initialUserEmail = route.params ? route.params.userEmail : null;

  const STORAGE_KEY = `chatHistory_${route.params.userName}`;

  const [UserDataa, setUserData] = useState("");
  const [refreshUI, setRefreshUI] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const onSend = useCallback(
    async (messages = []) => {
      try {
        // Menambahkan pesan ke daftar pesan yang ditampilkan di layar
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );

        // Mengirim pesan ke Firestore
        await sendMessageToFirestore(messages);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [setMessages]
  );

  const generateMessageId = () => {
    return uuidv4(); // Menggunakan uuidv4 untuk membuat ID unik
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      navigation.navigate("Message"); // Ganti 'Chat' dengan nama rute halaman Chat Anda
    });

    return unsubscribe;
  }, [navigation]);

  // const messageToSend = [{ text: 'Contoh pesan' }];
  const sendMessageToFirestore = async (messageText) => {
    try {
      const credentials = await AsyncStorage.getItem("credentials");
      const user = JSON.parse(credentials);

      const user1Id = user.id; // Ganti dengan ID pengguna pertama
      console.log("user1ID: ", user1Id);
      const user2Id = initialUserId;
      console.log("user2ID: ", user2Id);
      const chatRef = collection(firestore, "chats");

      const sortedIds = [user1Id, user2Id].sort();

      // Query untuk mendapatkan obrolan yang memiliki kedua user
      const membersArray = [user1Id, user2Id];
      const chatQuery = query(chatRef, where("members", "==", sortedIds));

      const chatQuerySnapshot = await getDocs(chatQuery);

      let chatID;

      if (!chatQuerySnapshot.empty) {
        // Jika obrolan sudah ada, gunakan chatId yang sudah ada
        chatQuerySnapshot.forEach((doc) => {
          chatID = doc.id;
        });
        console.log("Chat ID di messages:", chatID);
      } else {
        const newChatDocRef = await addDoc(chatRef, {
          members: sortedIds, // Daftar ID pengguna dalam obrolan
          createdAt: serverTimestamp(),
          // Field lain dalam obrolan
          // Misalnya: 'members', 'createdAt', dll.
        });

        const chatID = newChatDocRef.id;
        console.log("Chat ID chats:", chatID);
      }

      const messageRef = collection(firestore, "chats", chatID, "messages");

      const newMessage = {
        messageId: generateMessageId(), // Misalnya, menggunakan UUID untuk ID pesan
        senderId: user.id,
        content: messageText,
        timestamp: serverTimestamp(),
      };

      await addDoc(messageRef, newMessage);
      fetchMessages();
      console.log("Pesan berhasil dikirim ke Firestore!");
    } catch (error) {
      console.error("Error sending message to Firestore:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const credentials = await AsyncStorage.getItem("credentials");
      const user = JSON.parse(credentials);
      // setUserData(user);
      // console.log(user);

      const userRef = doc(firestore, "users", user.uid);

      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const friendToAdd = initialUserName;

        const doctorRef = collection(firestore, "users");
        const friendQuery = query(
          doctorRef,
          where("namaLengkap", "==", friendToAdd)
        );

        if (
          friendToAdd !== user.namaLengkap &&
          (!userData.friends ||
            !userData.friends.includes ||
            !userData.friends.includes(friendToAdd))
        ) {
          await updateDoc(userRef, {
            friends: arrayUnion(friendToAdd),
          });
          console.log("Berhasil menambahkan Teman: ", friendToAdd);
          // setFriend("");
          // setShowModal(false);

          // Tambahkan diri Anda ke field friends teman yang baru saja Anda tambahkan
          const doctorRef = collection(firestore, "users");
          const friendQuery = query(
            doctorRef,
            where("namaLengkap", "==", friendToAdd)
          );
          const querySnapshot = await getDocs(friendQuery);

          if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
              const friendDocRef = doc.ref;

              // Mendapatkan data teman untuk mendapatkan friends saat ini
              const friendData = doc.data();
              const currentFriends = friendData.friends || [];

              // Pastikan retrievedUid.namaLengkap belum ada dalam currentFriends
              if (!currentFriends.includes(user.namaLengkap)) {
                // Tambahkan retrievedUid.namaLengkap ke dalam array currentFriends
                currentFriends.push(user.namaLengkap);

                // Update field 'friends' dengan array yang telah diperbarui
                await updateDoc(friendDocRef, { friends: currentFriends });
                console.log("Anda sudah berhasil ditambahkan sebagai Teman");
              } else {
                console.log("Anda sudah berteman dengan orang ini.");
              }
            });
          } else {
            console.log("Tidak ada teman dengan nama lengkap tersebut.");
          }
        } else {
          // Alert.alert("Info", "Teman sudah ada dalam daftar teman Anda");
          console.log("Teman sudah ada dalam daftar teman Anda");
        }
      } else {
        console.log("Pengguna tidak ditemukan.");
      }

      const user1Id = user.id; // Ganti dengan ID pengguna pertama
      console.log("user1ID: ", user1Id);
      const user2Id = initialUserId;
      console.log("user2ID: ", user2Id);
      const chatRef = collection(firestore, "chats");

      const sortedIds = [user1Id, user2Id].sort();

      // Query untuk mendapatkan obrolan yang memiliki kedua user
      const membersArray = [user2Id, user1Id];
      const chatQuery = query(
        chatRef,
        where("members", "==", sortedIds)
        // where("members", "array-contains-any", membersArray)
      );

      const chatQuerySnapshot = await getDocs(chatQuery);

      let chatID;

      if (!chatQuerySnapshot.empty) {
        // Jika obrolan sudah ada, gunakan chatId yang sudah ada
        chatQuerySnapshot.forEach((doc) => {
          chatID = doc.id;
        });
        console.log("Chat ID di messages:", chatID);
      } else {
        // Jika room chat belum ada, buat room chat baru
        const newChatDocRef = await addDoc(chatRef, {
          members: sortedIds, // Membuat room chat baru dengan member dari kedua user
          createdAt: serverTimestamp(),
        });

        chatID = newChatDocRef.id;
        console.log("Chat ID chats:", chatID);
      }

      const messageRef = collection(firestore, "chats", chatID, "messages");
      const unsubscribe = onSnapshot(messageRef, (snapshot) => {
        const updatedMessages = [];
        snapshot.forEach((doc) => {
          const messageData = doc.data();
          if (messageData.content) {
            messageData.content.forEach((contentItem) => {
              if (contentItem.text) {
                const isCurrentUser = user.id === messageData.senderId;
                updatedMessages.push({
                  _id: contentItem._id,
                  text: contentItem.text,
                  createdAt: contentItem.createdAt.toDate(),
                  user: {
                    _id: isCurrentUser ? 1 : 2,
                    SenderID: messageData.senderId,
                    avatar: initialUserImg,
                  },
                });
              }
            });
          }
        });
        setMessages(updatedMessages);
      });

      return () => {
        unsubscribe(); // Membersihkan langganan saat komponen unmount
      };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return []; // Kembalikan array kosong jika terjadi kesalahan
    }
  };

  // Menggunakan useEffect untuk mendapatkan riwayat pesan saat komponen dimuat
  useEffect(() => {
    fetchMessages();
    // ReloadData();
  }, []); // Eksekusi hanya saat komponen pertama kali dimuat

  const DeleteMessageAlert = (context, message) => {
    Alert.alert(
      "Hapus Pesan",
      "Apakah Anda yakin ingin menghapus pesan ini?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => DeleteMessage(context, message) }, // Panggil fungsi untuk menghapus teman saat ditekan
      ],
      { cancelable: true }
    );
  };

  const DeleteMessage = async (context, message) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("credentials"));
      const chatRef = collection(firestore, "chats");

      const user1Id = user.id;
      const user2Id = initialUserId;

      const sortedIds = [user1Id, user2Id].sort();
      const membersArray = [user1Id, user2Id];

      const chatQuery = query(chatRef, where("members", "==", sortedIds));
      const chatQuerySnapshot = await getDocs(chatQuery);

      let chatID;

      if (!chatQuerySnapshot.empty) {
        chatQuerySnapshot.forEach((doc) => {
          chatID = doc.id;
        });
      } else {
        // Create a new chat room if it doesn't exist
        const newChatDocRef = await addDoc(chatRef, {
          members: sortedIds,
          createdAt: serverTimestamp(),
        });

        chatID = newChatDocRef.id;
      }

      const messageRef = collection(firestore, "chats", chatID, "messages");
      const querySnapshot = await getDocs(messageRef);

      let messageIdToDelete = null;

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          if (messageData.content) {
            messageData.content.forEach((contentItem) => {
              if (
                contentItem._id === message._id &&
                messageData.senderId === user.id
              ) {
                messageIdToDelete = doc.id; // Get the ID of the message document to delete
              }
            });
          }
        });

        if (messageIdToDelete) {
          // Delete the message document
          await deleteDoc(doc(messageRef, messageIdToDelete));

          // Fetch updated messages after deletion
          fetchMessages();
          console.log("Message deleted successfully!");
        } else {
          Alert.alert("Error", "You can't delete this message.");
          console.log("You can't delete this message.");
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color={"#333"} />;
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    // console.log(currentMessage.user._id);
    return (
      <View flexDirection={"row"} alignItems={"center"}>
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
            }}
          >
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Body backgroundColor={activeColors.secondary}>
                <Image
                  alt="Selected Image"
                  source={
                    currentMessage.user.avatar
                      ? { uri: currentMessage.user.avatar }
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
                  ID : {initialUserId}
                </Text>
                <Text
                  mt={1}
                  fontSize={15}
                  fontWeight={600}
                  mb={4}
                  color={activeColors.tint}
                  textAlign={"center"}
                >
                  {initialUserEmail}
                </Text>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        )}
        <TouchableOpacity onPress={() => setShowModal(true)}>
          {currentMessage.user._id === 2 && ( // Menampilkan gambar profil hanya di sebelah kiri
            <Image
              source={
                currentMessage.user.avatar
                  ? { uri: currentMessage.user.avatar }
                  : require("../../assets/Chat/ProfileDefault.jpeg")
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 4,
                marginLeft: 8,
              }}
              alt="AvatarUser"
            />
          )}
        </TouchableOpacity>
        <Bubble
          {...props}
          onLongPress={DeleteMessageAlert}
          wrapperStyle={{
            right: {
              backgroundColor:
                currentMessage.user._id === 1 ? "#0082F7" : "#EEE", // Ubah warna untuk pesan Anda
              marginRight: 20,
              marginVertical: 2,
              paddingRight: 6,
            },
            left: {
              marginLeft: 5,
              marginVertical: 2,
              paddingRight: 6,
              backgroundColor:
                currentMessage.user._id === 2 ? "#525252" : "#0082F7", // Ubah warna untuk pesan teman
            },
          }}
          textStyle={{
            right: {
              color: currentMessage.user._id === 1 ? "#fff" : "#000", // Ubah warna teks untuk pesan Anda
            },
            left: {
              color: currentMessage.user._id === 2 ? "#fff" : "#fff", // Ubah warna teks untuk pesan teman
            },
          }}
        />
      </View>
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <Box>
          <MaterialCommunityIcons
            name="send-circle"
            size={40}
            color={"#0082F7"}
            style={{ marginRight: -10, margin: -10 }}
          />
        </Box>
      </Send>
    );
  };

  const sortedMessages = messages.sort((a, b) => b.createdAt - a.createdAt);

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          padding: 2,
          // padding: 6,
          paddingTop: height * 0.014,
          paddingBottom: height * 0.014,
          paddingHorizontal: 15,
          // backgroundColor: "transparent",
          backgroundColor: activeColors.secondary,
          borderTopWidth: 0,
        }}
        renderComposer={(composerProps) => (
          <ScrollView
            style={{
              maxHeight: 100, // Atur tinggi maksimum sebelum scroll
              backgroundColor: "#F8F0E5",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
              marginHorizontal: 5,
            }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TextInput
              {...composerProps}
              style={{ margin: 5 }}
              placeholder="Type a message..."
              multiline // Aktifkan mode multiline
              maxHeight={100} // Atur tinggi maksimum sebelum scroll
              onChangeText={(text) => composerProps.onTextChanged(text)} // Pastikan properti onChangeText diproses dengan benar
              value={composerProps.text}
            />
          </ScrollView>
        )}
      />
    );
  };

  const renderTime = (timeProps) => {
    // const createdAt = new Date(timeProps.currentMessage.createdAt);
    // const hours = createdAt.getHours();
    // const minutes = createdAt.getMinutes();
    // const amOrPm = hours >= 12 ? 'PM' : 'AM';
    // const formattedTime = `${hours % 12}:${minutes} ${amOrPm}`;

    // return (
    // 	<Text
    // 		style={{
    // 			paddingLeft: 8,
    // 			paddingBottom: 4,
    // 			fontSize: 10,
    // 			color: '#fff', // Atur warna teks waktu menjadi putih
    // 		}}
    // 	>
    // 		{formattedTime}
    // 	</Text>
    // );
    const createdAt = new Date(timeProps.currentMessage.createdAt);
    const formattedTime = `${createdAt.getHours()}:${createdAt.getMinutes()}`;
    return (
      <Text
        style={{
          paddingRight: 6,
          paddingLeft: 10,
          paddingBottom: 4,
          fontSize: 10,
          color: "#fff",
        }}
      >
        {formattedTime}
      </Text>
    );
  };

  const [containerStyle, setContainerStyle] = useState({
    // paddingBottom: 0,
    paddingBottom: height * 0.012,
    height: height * 0.85,
    backgroundColor: activeColors.secondary,
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setContainerStyle({
          ...containerStyle,
          // paddingBottom: Platform.OS === "ios" ? 60 : 0,
          paddingBottom: height * 0.3,
        });
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setContainerStyle({
          ...containerStyle,
          paddingBottom: height * 0,
        });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [containerStyle, height]);

  return (
    <GiftedChat
      messages={sortedMessages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderMessage={renderMessage}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      // messagesContainerStyle={{
      //   // paddingBottom: 80,
      //   // paddingBottom: Platform.OS === 'ios' ? 60 : 0,
      //   paddingBottom: height * 0.012,
      //   // marginBottom: height * 1,
      //   // height: 710,
      //   height: height * 0.85,
      //   backgroundColor: activeColors.secondary,
      // }}
      messagesContainerStyle={containerStyle}
      renderInputToolbar={renderInputToolbar}
      renderTime={renderTime}
      keyboardShouldPersistTaps="never"
      // bottomOffset={Platform.select({ ios: 40, android: 60 })}
      // onLongPress={DeleteMessageAlert}
    />
  );
};

export default RoomChatScreen;
