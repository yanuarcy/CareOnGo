import { useCallback, useContext, useEffect, useState } from "react";
import { Box, ScrollView, Text, Center } from "native-base";
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
import { Alert } from "react-native";

const RoomChatScreen = () => {
  // const theme = { mode: "dark" };
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const route = useRoute();
  const initialMessageText = route.params ? route.params.messageText : "";
  const initialUserImg = route.params ? route.params.userImg : null;

	const STORAGE_KEY = `chatHistory_${route.params.userName}`;

  const [messages, setMessages] = useState([
    {
      _id: 2,
      text: initialMessageText,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: initialUserImg,
      },
    },
    {
      _id: 1,
      text: "Hello",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: initialUserImg,
      },
    },
  ]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);


	// Menggunakan useEffect untuk mendapatkan riwayat pesan saat komponen dimuat
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const storedChatHistory = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedChatHistory) {
          setMessages(JSON.parse(storedChatHistory));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []); // Eksekusi hanya saat komponen pertama kali dimuat

  // Menggunakan useEffect untuk menyimpan riwayat pesan setiap kali pesan berubah
  useEffect(() => {
    const saveChatHistory = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    };

    saveChatHistory();
  }, [messages]);


	const onLongPress = (context, message) => {
    Alert.alert(
      'Hapus Pesan',
      'Apakah Anda yakin ingin menghapus pesan ini?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteMessage(message._id) },
      ],
      { cancelable: true }
    );
  };

	const deleteMessage = (messageId) => {
    // Mendapatkan indeks pesan yang dipilih
    const selectedMessageIndex = messages.findIndex((msg) => msg._id === messageId);

    if (selectedMessageIndex !== -1) {
      // Menghapus pesan dari state
      const updatedMessages = [...messages];
      updatedMessages.splice(selectedMessageIndex, 1);
      setMessages(updatedMessages);

      // Menghapus pesan dari AsyncStorage
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages))
        .then(() => {
          console.log('Pesan berhasil dihapus dari AsyncStorage.');
        })
        .catch((error) => {
          console.error('Gagal menghapus pesan dari AsyncStorage:', error);
        });
    }
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color={"#333"} />;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#0082F7",
						marginRight: 10,
						paddingRight: 6
          },
          left: {
            backgroundColor: "#0082F7",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
          left: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <Box>
          <MaterialCommunityIcons
            name="send-circle"
            size={32}
            color={"#0082F7"}
            style={{ marginBottom: 5, marginRight: 5 }}
          />
        </Box>
      </Send>
    );
  };

  const sortedMessages = messages.sort((a, b) => b._id - a._id);

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          margin: 3,
          marginHorizontal: 15,
          backgroundColor: "#F8F0E5",
          borderRadius: 30,
          borderTopWidth: 0,
          borderColor: "black",
          // borderTopLeftRadius: 20, // Atur radius sesuai keinginan Anda
          // borderTopRightRadius: 20, // Atur radius sesuai keinginan Anda
        }}
      />
    );
  };

	const renderTime = (timeProps) => {
		const createdAt = new Date(timeProps.currentMessage.createdAt);
		const hours = createdAt.getHours();
		const minutes = createdAt.getMinutes();
		const amOrPm = hours >= 12 ? 'PM' : 'AM';
		const formattedTime = `${hours % 12}:${minutes} ${amOrPm}`;
	
		return (
			<Text
				style={{
					paddingLeft: 8,
					paddingBottom: 4,
					fontSize: 10,
					color: '#fff', // Atur warna teks waktu menjadi putih
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
      renderBubble={renderBubble}
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
			onLongPress={onLongPress}
    />
  );
};

export default RoomChatScreen;
