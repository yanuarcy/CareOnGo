import { useCallback, useContext, useEffect, useState } from "react";
import { Box, ScrollView, Text, Center } from "native-base";
import colors from "../component/theme";
import { ThemeContext } from "../component/themeContext";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { GiftedChat } from 'react-native-gifted-chat'

const RoomChatScreen = () => {
  // const theme = { mode: "dark" };
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: require("../../assets/Chat/user-2.jpg"),
        },
      },
      {
        _id: 2,
        text: "Hello It's Work",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "React Native",
          avatar: require("../../assets/Chat/user-2.jpg"),
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

	const scrollToBottomComponent = () => {
		return (
			<FontAwesome name="angle-double-down" size={22} color={'#333'} />
		)
	}

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
					<MaterialCommunityIcons name="send-circle" size={32} color={"#0082F7"} style={{ marginBottom: 5, marginRight: 5 }} />
				</Box>
      </Send>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
			scrollToBottom
			scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default RoomChatScreen;
