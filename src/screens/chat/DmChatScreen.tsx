import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles } from "@/src/styles/themedStyles";
import { ChatBubble } from "@/src/components/chat/ChatBubble";
import { ChatInput } from "@/src/components/chat/ChatInput";
import {
  ChatRestClient,
  ChatWebSocketManager,
  type WsStatus,
} from "@/src/services/chatService";
import {
  loadGroupKey,
  loadKeyPair,
  loadNickname,
  loadToken,
  loadUserId,
  saveGroupKey,
  saveKeyPair,
} from "@/src/utils/storage";
import { decryptGroup, encryptGroup, generateKeyPair } from "@/src/utils/crypto";
import type { ChatMessage, WsEvent } from "@/src/types/chat";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DmChatScreen() {
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyles("chatScreen");
  const router = useRouter();
  const { userId, nickname } = useLocalSearchParams<{ userId: string; nickname: string }>();
  const otherNickname = nickname ? decodeURIComponent(nickname) : "Usuario";

  const [screenState, setScreenState] = useState<"loading" | "connecting" | "connected" | "disconnected" | "error">("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const wsRef = useRef<ChatWebSocketManager | null>(null);
  const restRef = useRef<ChatRestClient | null>(null);
  const tokenRef = useRef<string>("");
  const myUserIdRef = useRef<string>("");
  const myNicknameRef = useRef<string>("");
  const groupKeyRef = useRef<string>("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initDmChat();
    return () => wsRef.current?.disconnect();
  }, []);

  async function initDmChat() {
    try {
      const storedToken = await loadToken();
      const storedNickname = await loadNickname();
      const storedUserId = await loadUserId();

      if (!storedToken || !storedNickname) {
        Alert.alert("Error", "No hay sesión de chat activa");
        router.back();
        return;
      }

      tokenRef.current = storedToken;
      myNicknameRef.current = storedNickname;
      myUserIdRef.current = storedUserId ?? "";

      const storedGroupKey = await loadGroupKey();
      if (storedGroupKey) groupKeyRef.current = storedGroupKey;

      const kp = await loadKeyPair();
      if (!kp.publicKey) {
        const newKp = generateKeyPair();
        await saveKeyPair(newKp);
      }

      const rest = new ChatRestClient();
      restRef.current = rest;

      const history = await rest.getDmHistory(storedToken, userId);
      setMessages(history.map(decryptMsg));

      connectWs(storedToken, storedNickname);
    } catch (error) {
      console.error("Error al iniciar DM:", error);
      setErrorMsg("Error al cargar la conversación");
      setScreenState("error");
    }
  }

  function decryptMsg(msg: ChatMessage): ChatMessage {
    const key = groupKeyRef.current;
    if (!key) return msg;
    try {
      const decrypted = decryptGroup(msg.content, key);
      if (decrypted !== null) return { ...msg, content: decrypted };
    } catch {}
    return msg;
  }

  function connectWs(tok: string, nick: string) {
    setScreenState("connecting");
    const ws = new ChatWebSocketManager(tok);
    wsRef.current = ws;

    ws.statusChanged = (status: WsStatus) => {
      setScreenState(status as any);
    };

    ws.onEvent((event: WsEvent) => {
      switch (event.type) {
        case "group_key":
          groupKeyRef.current = event.key;
          saveGroupKey(event.key);
          break;
        case "dm":
          if (event.message.sender_id === userId || event.message.recipient_id === userId) {
            setMessages((prev) => [...prev, decryptMsg(event.message)]);
          }
          break;
        case "error":
          setErrorMsg(event.message);
          break;
      }
    });

    ws.connect();
  }

  function handleSendMessage(text: string) {
    const key = groupKeyRef.current;
    const content = key ? encryptGroup(text, key) : text;
    wsRef.current?.sendDM(userId, content);
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  function statusColor(): string {
    switch (screenState) {
      case "connected": return "#4CAF50";
      case "connecting": return "#FFC107";
      case "disconnected": return "#FF9800";
      case "error": return "#F44336";
      default: return "#999";
    }
  }

  if (screenState === "loading") {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#40916C" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "android" ? insets.top : 0}
    >
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 22 }}>←</Text>
            </Pressable>
            <View>
              <Text style={styles.headerTitle}>💬 {otherNickname}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusBar}>
          <View style={[styles.statusDot, { backgroundColor: statusColor() }]} />
          <Text style={styles.statusText}>
            {screenState === "connected" ? "Conectado" : screenState === "connecting" ? "Conectando..." : "Desconectado"}
          </Text>
        </View>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay mensajes. ¡Escribí el primero!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              isOwn={item.sender_id === myUserIdRef.current}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      <ChatInput onSend={handleSendMessage} disabled={screenState !== "connected"} />
    </KeyboardAvoidingView>
  );
}
