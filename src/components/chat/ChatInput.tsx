import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useThemedStyles } from "@/src/styles/themedStyles";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const { styles } = useThemedStyles("chatInput");
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Escribe un mensaje..."
        placeholderTextColor="#999"
        multiline
        onSubmitEditing={handleSend}
        editable={!disabled}
      />
      <Pressable
        style={[
          styles.sendButton,
          (!text.trim() || disabled) && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Text style={styles.sendButtonText}>➤</Text>
      </Pressable>
    </View>
  );
}
