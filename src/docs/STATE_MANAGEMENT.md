# Zustand Store Pattern

conversationStore:

- conversations[]
- activeConversationId
- messagesByConversation
- typingUsers
- onlineUsers

Rules:

- React Query = fetch initial data
- Zustand = realtime mutation
