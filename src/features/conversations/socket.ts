import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

// ============================================================
// Singleton typed socket — lazy connection, never auto-connect
// ============================================================

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:9999";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
 if (!socket) {
  socket = io(SOCKET_URL, {
   autoConnect: false,
   transports: ["websocket", "polling"],
   auth: (cb: (data: Record<string, unknown>) => void) => {
    cb({ token: localStorage.getItem("auth-token") });
   },
  });
 }
 return socket;
}

export function connectSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
 const s = getSocket();
 if (!s.connected) {
  s.connect();
 }
 return s;
}

export function disconnectSocket(): void {
 if (socket?.connected) {
  socket.disconnect();
 }
}
