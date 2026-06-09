import { Text, View } from "react-native";
import { useThemedStyles } from "@/src/styles/themedStyles";
import type { ChatMessage } from "@/src/types/chat";

interface Props {
  message: ChatMessage;
  isOwn: boolean;
}

export function ChatBubble({ message, isOwn }: Props) {
  const { styles } = useThemedStyles("chatBubble");

  const time = new Date(message.timestamp).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
      >
        <Text style={[styles.senderName, isOwn && styles.ownSenderName]}>
          {message.sender_nickname}
        </Text>
        <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
          {message.content}
        </Text>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    </View>
  );
}
