import { useCallback, useContext, useEffect, useState } from "react";
import { Box, ScrollView, Text, Center, View, Image } from "native-base";
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
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform, TextInput, KeyboardAvoidingView } from "react-native";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const RoomChatScreen = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const route = useRoute();
  const DB = initializeApp(firebaseConfig);
  const firestore = getFirestore(DB);

  const initialUserId = route.params ? route.params.userId : "";
  const initialUserImg = route.params ? route.params.userImg : null;

  const STORAGE_KEY = `chatHistory_${route.params.userName}`;

  const [UserDataa, setUserData] = useState("");
  const [refreshUI, setRefreshUI] = useState(false);
  // const [messages, setMessages] = useState([
  //   {
  //     _id: 2,
  //     text: "heloo world",
  //     createdAt: new Date(),
  //     user: {
  //       _id: 2,
  //       name: "React Native",
  //       avatar: initialUserImg,
  //     },
  //   },
  //   {
  //     _id: 1,
  //     text: "Hello",
  //     createdAt: new Date(),
  //     user: {
  //       _id: 2,
  //       name: "React Native",
  //       avatar: initialUserImg,
  //     },
  //   },
  // ]);
  const [messages, setMessages] = useState([]);

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

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color={"#333"} />;
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    // console.log(currentMessage.user._id);
    return (
      <View flexDirection={"row"} alignItems={"center"}>
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
        <Bubble
          {...props}
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
      // <InputToolbar
      //   {...props}
      //   containerStyle={{
      //     margin: 3,
      //     marginHorizontal: 15,
      //     backgroundColor: "#F8F0E5",
      //     borderRadius: 30,
      //     borderTopWidth: 0,
      //     borderColor: "black",
      //     // borderTopLeftRadius: 20, // Atur radius sesuai keinginan Anda
      //     // borderTopRightRadius: 20, // Atur radius sesuai keinginan Anda
      //   }}
      // />
      <InputToolbar
        {...props}
        containerStyle={{
          margin: 3,
          marginBottom: 10,
          marginHorizontal: 15,
          backgroundColor: "transparent",
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
      messagesContainerStyle={{
        paddingBottom: 80,
        height: 720,
        backgroundColor: activeColors.secondary,
      }}
      renderInputToolbar={renderInputToolbar}
      renderTime={renderTime}
      keyboardShouldPersistTaps="never"
      // onLongPress={onLongPress}
    />
  );
};

export default RoomChatScreen;
