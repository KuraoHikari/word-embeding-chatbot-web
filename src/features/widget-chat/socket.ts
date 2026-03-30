import { io, type Socket } from "socket.io-client";
import type { WidgetClientToServerEvents, WidgetServerToClientEvents } from "./types";

// ============================================================
// Widget Socket — isolated from admin socket, scoped to widget
// ============================================================

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:9999";

let widgetSocket: Socket<WidgetServerToClientEvents, WidgetClientToServerEvents> | null = null;

export function getWidgetSocket(token: string): Socket<WidgetServerToClientEvents, WidgetClientToServerEvents> {
 if (!widgetSocket) {
  widgetSocket = io(SOCKET_URL, {
   autoConnect: false,
   transports: ["websocket", "polling"],
   auth: { token },
  });
 }
 return widgetSocket;
}

export function connectWidgetSocket(token: string): Socket<WidgetServerToClientEvents, WidgetClientToServerEvents> {
 const s = getWidgetSocket(token);
 if (!s.connected) {
  s.connect();
 }
 return s;
}

export function disconnectWidgetSocket(): void {
 if (widgetSocket?.connected) {
  widgetSocket.disconnect();
 }
 widgetSocket = null;
}
