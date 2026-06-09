// ── Models ─────────────────────────────────────────
export interface ChatUser {
  id: string;
  nickname: string;
  joined_at: string;
  is_online: boolean;
  public_key?: string;
}

export interface MediaAttachment {
  url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  format: string;
  size_bytes: number;
  original_filename: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_nickname: string;
  content: string;
  type: "group" | "dm";
  recipient_id?: string;
  timestamp: string;
  ttl?: number;
  expires_at?: string;
  allow_read_receipt: boolean;
  media?: MediaAttachment;
}

// ── REST Payloads ──────────────────────────────────
export interface JoinRequest {
  nickname: string;
}

export interface JoinResponse {
  user: ChatUser;
  token: string;
}

export interface CreateMessagePayload {
  type: "group" | "dm";
  content: string;
  recipient_id?: string;
  ttl?: number;
  allow_read_receipt?: boolean;
}

// ── WebSocket Events (server → client) ─────────────
export type WsEvent =
  | { type: "group_message"; message: ChatMessage }
  | { type: "dm"; message: ChatMessage }
  | { type: "message_seen"; message_id: string; seen_by: string; seen_at: string }
  | { type: "message_expired"; message_id: string }
  | { type: "typing"; user_id: string; nickname: string }
  | { type: "stop_typing"; user_id: string }
  | { type: "user_joined"; user: ChatUser }
  | { type: "user_left"; user_id: string }
  | { type: "users_list"; users: ChatUser[] }
  | { type: "group_history"; messages: ChatMessage[] }
  | { type: "group_key"; key: string }
  | { type: "pong" }
  | { type: "error"; message: string };

// ── WebSocket Events (client → server) ────────────
export type WsOutgoingEvent =
  | { type: "group_message"; content: string; ttl?: number; allow_read_receipt?: boolean }
  | { type: "dm"; to: string; content: string; ttl?: number; allow_read_receipt?: boolean }
  | { type: "mark_read"; message_id: string }
  | { type: "typing"; to?: string }
  | { type: "stop_typing" }
  | { type: "ping" };
