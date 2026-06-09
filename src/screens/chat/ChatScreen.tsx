import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
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
  clearChatSession,
  loadNickname,
  loadToken,
  loadUserId,
  saveNickname,
  saveToken,
  saveUserId,
} from "@/src/utils/storage";
import type { ChatMessage, WsEvent } from "@/src/types/chat";

type ScreenState =
  | "loading"
  | "join"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyles("chatScreen");

  // ── State ─────────────────────────────────────────
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // ── Refs (non-state, keeps across renders) ─────────
  const restRef = useRef<ChatRestClient | null>(null);
  const wsRef = useRef<ChatWebSocketManager | null>(null);
  const tokenRef = useRef<string>("");
  const myNicknameRef = useRef<string>("");
  const myUserIdRef = useRef<string>("");

  const flatListRef = useRef<FlatList>(null);

  // ── Check for existing session on mount ────────────
  useEffect(() => {
    initSession();
    return () => {
      // Cleanup WebSocket on unmount
      wsRef.current?.disconnect();
    };
  }, []);

  async function initSession() {
    try {
      const storedToken = await loadToken();
      const storedNickname = await loadNickname();
      const storedUserId = await loadUserId();

      if (storedToken && storedNickname) {
        tokenRef.current = storedToken;
        myNicknameRef.current = storedNickname;
        myUserIdRef.current = storedUserId ?? "";
        setNickname(storedNickname);
        connectWebSocket(storedToken, storedNickname);
      } else {
        setScreenState("join");
      }
    } catch (error) {
      console.error("Error al cargar sesión de chat:", error);
      setScreenState("join");
    }
  }

  // ── Connect WebSocket ─────────────────────────────
  function connectWebSocket(token: string, nick: string) {
    setScreenState("connecting");

    const ws = new ChatWebSocketManager(token);
    wsRef.current = ws;

    ws.statusChanged = (status: WsStatus) => {
      switch (status) {
        case "connected":
          setScreenState("connected");
          break;
        case "disconnected":
          setScreenState("disconnected");
          break;
        case "error":
          setScreenState("error");
          break;
        case "connecting":
          setScreenState("connecting");
          break;
      }
    };

    ws.onEvent(handleWsEvent);
    ws.connect();
  }

  // ── WebSocket Event Handler ───────────────────────
  const handleWsEvent = useCallback((event: WsEvent) => {
    switch (event.type) {
      case "group_history":
        setMessages(event.messages);
        break;

      case "group_message":
        setMessages((prev) => [...prev, event.message]);
        break;

      case "users_list":
        setOnlineCount(event.users.filter((u) => u.is_online).length);
        break;

      case "user_joined":
        setOnlineCount((prev) => prev + 1);
        break;

      case "user_left":
        setOnlineCount((prev) => Math.max(0, prev - 1));
        break;

      case "error":
        setErrorMsg(event.message);
        Alert.alert("Error del chat", event.message);
        break;

      default:
        break;
    }
  }, []);

  // ── Join Chat ─────────────────────────────────────
  async function handleJoin() {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      Alert.alert("Error", "Ingresá un apodo para unirte al chat");
      return;
    }

    try {
      setScreenState("connecting");
      const rest = restRef.current ?? new ChatRestClient();
      restRef.current = rest;

      const result = await rest.join(trimmed);
      const { token, user } = result;

      tokenRef.current = token;
      myNicknameRef.current = user.nickname;
      myUserIdRef.current = user.id;
      setNickname(user.nickname);

      // Persist session
      await saveToken(token);
      await saveNickname(user.nickname);
      await saveUserId(user.id);

      connectWebSocket(token, user.nickname);
    } catch (error) {
      console.error("Error al unirse al chat:", error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Error al conectar con el chat"
      );
      setScreenState("error");
    }
  }

  // ── Send Message ─────────────────────────────────
  function handleSendMessage(text: string) {
    wsRef.current?.sendGroupMessage(text);
  }

  // ── Refresh messages (pull-to-refresh) ────────────
  async function handleRefresh() {
    if (!tokenRef.current) return;
    setRefreshing(true);
    try {
      const rest = restRef.current ?? new ChatRestClient();
      restRef.current = rest;
      const history = await rest.getGroupMessages(tokenRef.current, 50);
      setMessages(history);
    } catch (error) {
      console.error("Error al refrescar mensajes:", error);
    } finally {
      setRefreshing(false);
    }
  }

  // ── Leave Chat ────────────────────────────────────
  async function handleLeave() {
    wsRef.current?.disconnect();
    if (tokenRef.current) {
      try {
        const rest = restRef.current ?? new ChatRestClient();
        await rest.logout(tokenRef.current);
      } catch {
        // Ignorar errores al salir
      }
    }
    await clearChatSession();
    tokenRef.current = "";
    myNicknameRef.current = "";
    myUserIdRef.current = "";
    setNickname("");
    setMessages([]);
    setOnlineCount(0);
    setErrorMsg("");
    setScreenState("join");
  }

  // ── Auto-scroll to bottom on new messages ─────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // ── Status indicator color ────────────────────────
  function statusColor(): string {
    switch (screenState) {
      case "connected":
        return "#4CAF50";
      case "connecting":
        return "#FFC107";
      case "disconnected":
        return "#FF9800";
      case "error":
        return "#F44336";
      default:
        return "#999";
    }
  }

  function statusLabel(): string {
    switch (screenState) {
      case "connected":
        return "Conectado";
      case "connecting":
        return "Conectando...";
      case "disconnected":
        return "Desconectado";
      case "error":
        return "Error de conexión";
      default:
        return "";
    }
  }

  // ── Loading State ─────────────────────────────────
  if (screenState === "loading") {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#40916C" />
      </View>
    );
  }

  // ── Join State ────────────────────────────────────
  if (screenState === "join") {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.joinContainer}>
            <Text style={styles.joinTitle}>💬 Chat grupal</Text>
            <TextInput
              style={styles.joinInput}
              value={nicknameInput}
              onChangeText={setNicknameInput}
              placeholder="Tu apodo..."
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleJoin}
            />
            <Pressable style={styles.joinButton} onPress={handleJoin}>
              <Text style={styles.joinButtonText}>Unirse al chat</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // ── Error State ───────────────────────────────────
  if (screenState === "error" && messages.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Pressable
            style={[styles.joinButton, { marginTop: 16 }]}
            onPress={handleLeave}
          >
            <Text style={styles.joinButtonText}>Volver a intentar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Chat UI ───────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💬 Chat grupal</Text>
          <Text style={styles.onlineCount}>
            {onlineCount > 0
              ? `${onlineCount} online`
              : "Sin conexión"}
          </Text>
        </View>
        <Pressable onPress={handleLeave}>
          <Text style={{ fontSize: 14, color: "#F44336", fontWeight: "600" }}>
            Salir
          </Text>
        </Pressable>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View
          style={[styles.statusDot, { backgroundColor: statusColor() }]}
        />
        <Text style={styles.statusText}>{statusLabel()}</Text>
      </View>

      {/* Messages List */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay mensajes aún. ¡Escribí el primero!
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#40916C"
              />
            }
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        {/* Input Bar */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={screenState !== "connected"}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
