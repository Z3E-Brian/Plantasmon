import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemedStyles } from "@/src/styles/themedStyles";
import {
  ChatRestClient,
  ChatWebSocketManager,
  type WsStatus,
} from "@/src/services/chatService";
import {
  clearChatSession,
  loadGroupKey,
  loadKeyPair,
  loadNickname,
  loadToken,
  loadUserId,
  saveGroupKey,
  saveKeyPair,
  saveNickname,
  saveToken,
  saveUserId,
} from "@/src/utils/storage";
import { generateKeyPair } from "@/src/utils/crypto";
import { auth } from "@/src/config/firebase";
import type { ChatMessage, ChatUser, WsEvent } from "@/src/types/chat";
import { useRouter } from "expo-router";

type Conversation = {
  id: string;
  label: string;
  type: "group" | "dm";
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  user?: ChatUser;
};

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyles("chatScreen");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [token, setToken] = useState("");
  const [wsStatus, setWsStatus] = useState<WsStatus>("disconnected");
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [lastGroupMsg, setLastGroupMsg] = useState<string>("");
  const [dmConversations, setDmConversations] = useState<Conversation[]>([]);
  const [hasSession, setHasSession] = useState(false);

  const wsRef = useRef<ChatWebSocketManager | null>(null);
  const groupKeyRef = useRef<string>("");

  useEffect(() => {
    initChat();
    return () => wsRef.current?.disconnect();
  }, []);

  async function initChat() {
    setLoading(true);
    try {
      const storedToken = await loadToken();
      const storedNickname = await loadNickname();
      const storedUserId = await loadUserId();

      if (storedToken && storedNickname) {
        setToken(storedToken);
        setNickname(storedNickname);
        setHasSession(true);

        const storedGroupKey = await loadGroupKey();
        if (storedGroupKey) groupKeyRef.current = storedGroupKey;

        const kp = await loadKeyPair();
        if (kp.publicKey) {
          const rest = new ChatRestClient();
          await rest.registerPublicKey(storedToken, kp.publicKey);
        }

        connectWs(storedToken, storedNickname);
        await fetchUsers(storedToken);
      } else {
        await autoJoin();
      }
    } catch (error) {
      console.error("Error al iniciar chat:", error);
      setLoading(false);
    }
  }

  async function autoJoin() {
    try {
      const firebaseUser = auth.currentUser;
      const name =
        firebaseUser?.displayName ||
        firebaseUser?.email?.split("@")[0] ||
        "Usuario";

      setNickname(name);
      const rest = new ChatRestClient();
      const result = await rest.join(name);
      const { token: newToken, user } = result;

      const kp = generateKeyPair();
      await saveKeyPair(kp);
      await rest.registerPublicKey(newToken, kp.publicKey);

      setToken(newToken);
      setHasSession(true);
      await saveToken(newToken);
      await saveNickname(user.nickname);
      await saveUserId(user.id);

      connectWs(newToken, user.nickname);
      await fetchUsers(newToken);
    } catch (error) {
      console.error("Error al unirse al chat:", error);
      setLoading(false);
    }
  }

  function connectWs(tok: string, nick: string) {
    const ws = new ChatWebSocketManager(tok);
    wsRef.current = ws;

    ws.statusChanged = (status: WsStatus) => {
      setWsStatus(status);
    };

    ws.onReconnectFailed = async () => {
      wsRef.current?.disconnect();
      await clearChatSession();
      setHasSession(false);
      setToken("");
      setNickname("");
      setOnlineUsers([]);
      setDmConversations([]);
      router.replace("/chat-list");
    };

    ws.onEvent((event: WsEvent) => {
      switch (event.type) {
        case "group_key":
          groupKeyRef.current = event.key;
          saveGroupKey(event.key);
          break;
        case "group_message":
          setLastGroupMsg(event.message.content.slice(0, 60));
          break;
        case "dm":
          updateDmConversation(event.message);
          break;
        case "users_list":
          setOnlineUsers(event.users.filter((u) => u.is_online));
          break;
        case "user_joined":
          setOnlineUsers((prev) => {
            if (prev.some((u) => u.id === event.user.id)) return prev;
            return [...prev, event.user];
          });
          break;
        case "user_left":
          setOnlineUsers((prev) =>
            prev.map((u) =>
              u.id === event.user_id ? { ...u, is_online: false } : u
            )
          );
          break;
      }
    });

    ws.connect();
  }

  async function fetchUsers(tok: string) {
    const rest = new ChatRestClient();
    const users = await rest.getOnlineUsers(tok);
    setOnlineUsers(users.filter((u) => u.nickname !== nickname));
  }

  function updateDmConversation(msg: ChatMessage) {
    const otherName = msg.sender_nickname;
    setDmConversations((prev) => {
      const existing = prev.find((c) => c.label === otherName);
      if (existing) {
        return prev.map((c) =>
          c.label === otherName
            ? { ...c, lastMessage: msg.content.slice(0, 60), timestamp: msg.timestamp }
            : c
        );
      }
      return [
        ...prev,
        {
          id: msg.sender_id,
          label: otherName,
          type: "dm" as const,
          lastMessage: msg.content.slice(0, 60),
          timestamp: msg.timestamp,
        },
      ];
    });
  }

  async function handleLeaveChat() {
    wsRef.current?.disconnect();
    if (token) {
      try {
        const rest = new ChatRestClient();
        await rest.logout(token);
      } catch {}
    }
    await clearChatSession();
    setHasSession(false);
    setToken("");
    setNickname("");
    setOnlineUsers([]);
    setDmConversations([]);
    setLastGroupMsg("");
    router.replace("/chat-list");
  }

  const conversations: Conversation[] = [
    {
      id: "group",
      label: "Chat grupal",
      type: "group",
      lastMessage: lastGroupMsg || "Toca para abrir el chat grupal",
    },
    ...dmConversations,
  ];

  function statusColor(): string {
    switch (wsStatus) {
      case "connected": return "#4CAF50";
      case "connecting": return "#FFC107";
      case "disconnected": return "#FF9800";
      case "error": return "#F44336";
      default: return "#999";
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#40916C" />
      </View>
    );
  }

  if (!hasSession) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.joinContainer}>
          <Text style={styles.joinTitle}>💬 Chat</Text>
          <Text style={{ color: "#667A6A", textAlign: "center", marginBottom: 12 }}>
            No se pudo conectar. Revisá tu conexión e intentá de nuevo.
          </Text>
          <Pressable
            style={styles.joinButton}
            onPress={() => { setLoading(true); initChat(); }}
          >
            <Text style={styles.joinButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💬 Chat</Text>
          <Text style={styles.onlineCount}>
            {nickname} •{" "}
            {wsStatus === "connected"
              ? `${onlineUsers.length + 1} en línea`
              : "Desconectado"}
          </Text>
        </View>
        <Pressable onPress={handleLeaveChat}>
          <Text style={{ fontSize: 14, color: "#F44336", fontWeight: "600" }}>
            Salir
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 8 }}>
        <View style={[styles.statusDot, { backgroundColor: statusColor() }]} />
        <Text style={{ fontSize: 12, color: "#667A6A", marginLeft: 6 }}>
          {wsStatus === "connected" ? "Conectado" : wsStatus === "connecting" ? "Conectando..." : "Desconectado"}
        </Text>
      </View>

      {/* Online users horizontal scroll */}
      {onlineUsers.length > 0 && (
        <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#EEE" }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#667A6A", paddingHorizontal: 16, marginBottom: 8 }}>
            EN LÍNEA
          </Text>
          <FlatList
            horizontal
            data={onlineUsers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/chat-dm?userId=${item.id}&nickname=${encodeURIComponent(item.nickname)}`)}
                style={{ alignItems: "center", marginHorizontal: 6, width: 64 }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#2E5739",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "#FFF" }}>
                    {item.nickname.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 11, color: "#1D3426", marginTop: 4, textAlign: "center" }}
                  numberOfLines={1}
                >
                  {item.nickname}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Conversations list */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
        ListHeaderComponent={
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#667A6A", paddingHorizontal: 16, marginBottom: 4 }}>
            CHATS
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.type === "group") {
                router.push("/chat");
              } else {
                router.push(
                  `/chat-dm?userId=${item.id}&nickname=${encodeURIComponent(item.label)}`
                );
              }
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderBottomWidth: 0.5,
              borderBottomColor: "#EEE",
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: item.type === "group" ? "#40916C" : "#C9A468",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 22 }}>
                {item.type === "group" ? "👥" : item.label.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#1D3426" }}>
                {item.label}
              </Text>
              <Text
                style={{ fontSize: 13, color: "#667A6A", marginTop: 2 }}
                numberOfLines={1}
              >
                {item.lastMessage || "Sin mensajes"}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#95A796", marginTop: 40, fontSize: 14 }}>
            No hay conversaciones todavía
          </Text>
        }
      />
    </View>
  );
}
