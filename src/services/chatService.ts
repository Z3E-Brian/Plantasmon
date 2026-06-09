import type {
  ChatMessage,
  ChatUser,
  CreateMessagePayload,
  JoinResponse,
  WsEvent,
  WsOutgoingEvent,
} from "@/src/types/chat";

const CHAT_API_URL = "https://chat-backend-4nzg.onrender.com";

// ─── REST Client ─────────────────────────────────────────────────────────────

export class ChatRestClient {
  private baseUrl: string;

  constructor(baseUrl: string = CHAT_API_URL) {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<{ status: string }> {
    const res = await fetch(`${this.baseUrl}/health`);
    if (!res.ok) throw new Error("Backend de chat no disponible");
    return res.json() as Promise<{ status: string }>;
  }

  async join(nickname: string): Promise<JoinResponse> {
    const res = await fetch(`${this.baseUrl}/api/chat/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { detail?: { message?: string } }).detail?.message ||
          "Error al unirse al chat"
      );
    }
    return res.json() as Promise<JoinResponse>;
  }

  async logout(token: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/chat/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error al cerrar sesión de chat:", error);
    }
  }

  async getOnlineUsers(token: string): Promise<ChatUser[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/chat/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return res.json() as Promise<ChatUser[]>;
    } catch (error) {
      console.error("Error al obtener usuarios en línea:", error);
      return [];
    }
  }

  async getGroupMessages(token: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/chat/messages?limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return [];
      return res.json() as Promise<ChatMessage[]>;
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return [];
    }
  }

  async getDmHistory(
    token: string,
    otherId: string
  ): Promise<ChatMessage[]> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/chat/messages/dm/${otherId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return [];
      return res.json() as Promise<ChatMessage[]>;
    } catch (error) {
      console.error("Error al obtener historial DM:", error);
      return [];
    }
  }

  async sendMessage(
    token: string,
    payload: CreateMessagePayload
  ): Promise<ChatMessage | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return res.json() as Promise<ChatMessage>;
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      return null;
    }
  }

  async registerPublicKey(
    token: string,
    publicKey: string
  ): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/chat/users/me/public-key`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ public_key: publicKey }),
        }
      );
      return res.ok;
    } catch (error) {
      console.error("Error al registrar clave pública:", error);
      return false;
    }
  }
}

// ─── WebSocket Manager ────────────────────────────────────────────────────────

export type WsEventHandler = (event: WsEvent) => void;
export type WsStatus = "disconnected" | "connecting" | "connected" | "error";

export class ChatWebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private handlers: Set<WsEventHandler> = new Set();
  private _status: WsStatus = "disconnected";
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  statusChanged?: (status: WsStatus) => void;
  onReconnectFailed?: () => void;

  constructor(token: string, baseUrl: string = CHAT_API_URL) {
    this.token = token;
    this.url = baseUrl.replace(/^http/, "ws") + `/ws/${token}`;
  }

  get status(): WsStatus {
    return this._status;
  }

  onEvent(handler: WsEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this._status = "connecting";
    this.statusChanged?.(this._status);

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[ChatWS] Conectado");
      this._status = "connected";
      this.reconnectAttempts = 0;
      this.statusChanged?.(this._status);
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data: WsEvent = JSON.parse(event.data as string);
        this.handlers.forEach((h) => h(data));
      } catch (e) {
        console.warn("[ChatWS] Error al analizar mensaje:", e);
      }
    };

    this.ws.onerror = () => {
      console.warn("[ChatWS] Error de conexión");
      this._status = "error";
      this.statusChanged?.(this._status);
    };

    this.ws.onclose = () => {
      console.log("[ChatWS] Desconectado");
      this._status = "disconnected";
      this.statusChanged?.(this._status);
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.onReconnectFailed?.();
      return;
    }
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      15000
    );
    this.reconnectAttempts++;
    console.log(
      `[ChatWS] Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  send(event: WsOutgoingEvent): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn("[ChatWS] No conectado, no se puede enviar");
    }
  }

  sendGroupMessage(content: string, ttl?: number): void {
    this.send({ type: "group_message", content, ttl });
  }

  sendDM(to: string, content: string, ttl?: number): void {
    this.send({ type: "dm", to, content, ttl });
  }

  sendTyping(to?: string): void {
    this.send({ type: "typing", to });
  }

  sendStopTyping(): void {
    this.send({ type: "stop_typing" });
  }

  markRead(messageId: string): void {
    this.send({ type: "mark_read", message_id: messageId });
  }

  ping(): void {
    this.send({ type: "ping" });
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.ws?.close();
    this.ws = null;
    this._status = "disconnected";
    this.statusChanged?.(this._status);
  }
}
