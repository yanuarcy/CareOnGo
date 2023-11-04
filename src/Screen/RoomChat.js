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
import { View } from "react-native";
// import { GiftedChat } from 'react-native-gifted-chat'

const RoomChatScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: "Hello developer",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: "React Native",
  //         avatar: require("../../assets/Chat/user-2.jpg"),
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: "Hello It's Work",
  //       createdAt: new Date(),
  //       user: {
  //         _id: 1,
  //         name: "React Native",
  //         avatar: require("../../assets/Chat/user-2.jpg"),
  //       },
  //     },
  //   ]);
  // }, []);

  const route = useRoute();
  const initialMessageText = route.params ? route.params.messageText : "";
  const initialUserImg = route.params ? route.params.userImg : null;

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
    />
  );
};

export default RoomChatScreen;
