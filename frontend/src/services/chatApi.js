import API from "./api";

// Start chat (user initiates)
export const startChatSession = (userId, panditId) =>
  API.post("/chat/start", { userId, panditId });

// Create a chat request for pandit to accept
export const createChatRequest = (userId, panditId, roomId = null) =>
  API.post("/chat/request", { userId, panditId, roomId });

// Pandit joins existing chat session
export const joinChatSession = (panditId, roomId) =>
  API.post("/chat/join", { panditId, roomId });

// Load entire chat history
export const getChatHistory = (roomId) =>
  API.get(`/chat/history/${roomId}`);

export const endChatSession = (roomId) =>
  API.post("/chat/end-session", { roomId });
