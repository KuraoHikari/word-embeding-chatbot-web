🎨 Mockup UI pixel-ish (Markdown grid per section + state)

🧠 Flow arsitektur FE (zustand + react-query + socket)

🚀 PROMPT SUPER STRICT untuk agent FE

📦 Struktur folder untuk iframe-ready chatbox

Semua disesuaikan dengan stack kamu:

React

Zustand

Zod

@tanstack/react-query

Socket.io-client

Backend sudah beres ✅

🎨 1️⃣ MOCKUP — Customer Bubble Chat (Pixel-ish Layout)

Format Markdown Grid per section + state detail.

🟦 WIDGET CLOSED (Floating Bubble)
+--------------------------------+
| |
| ( 💬 ) |
| |
+--------------------------------+
Position: fixed bottom-right
Shadow: soft-xl
Shape: circle
🟩 WIDGET OPENED — MAIN LAYOUT
+--------------------------------------------------+
| Header |
+--------------------------------------------------+
| Body |
+--------------------------------------------------+
| Footer |
+--------------------------------------------------+

Grid:

Rows:

- Header (64px)
- Body (flex-1 scroll)
- Footer (auto)
  🟨 STATE 1 — CONTACT FORM (Initial State)
  +--------------------------------------------------+
  | 🤖 Chatbot Name [ X ] |
  +--------------------------------------------------+
  | |
  | 👋 Hi! Please introduce yourself |
  | |
  | Name [________________________] |
  | Email [________________________] |
  | Phone [________________________] |
  | |
  | [ Start Chatting ] |
  | |
  +--------------------------------------------------+
  | 🔒 Secured by YourCompany |
  +--------------------------------------------------+
  States
  Loading
  [ Start Chatting... ⏳ ]
  Button disabled
  Error
  ⚠ Failed to create contact.
  [ Try Again ]
  Validation Error
  Name is required
  Email must be valid
  🟦 STATE 2 — CREATING CONVERSATION (Intermediate)
  +----------------------------------------------+
  | |
  | Connecting you to agent... |
  | ⏳ Spinner |
  | |
  +----------------------------------------------+
  🟩 STATE 3 — ACTIVE CHAT
  +--------------------------------------------------+
  | 🤖 Chatbot Name ● Online |
  +--------------------------------------------------+
  | |
  | (bot) Hello 👋 |
  | |
  | (user) Hi there |
  | |
  | (bot) How can I help you today? |
  | |
  |--------------------------------------------------|
  | [ Type your message... ][ Send ] |
  +--------------------------------------------------+
  🟥 STATE 4 — ERROR STATE (Hard Fail)
  +-----------------------------------------------+
  | ⚠ Connection lost |
  | |
  | Please refresh the page |
  | |
  | [ Reload ] |
  +-----------------------------------------------+
  🧠 2️⃣ FLOW ARCHITECTURE (STRICT)
  Step 1 — User Submit Contact

POST /contacts

Response:

{ access_token }

Save to:

Zustand: auth.token

localStorage (iframe persistence)

Step 2 — Create Conversation

POST /conversations

Response:

{ id: number }

Save:

activeConversationId

Step 3 — Connect Socket
io(BASE_URL, {
auth: { token }
})

Join room:

conversation:{id}
Step 4 — Chat Realtime

message:send

message:new

Optimistic UI:

tempId

replace when confirmed

🟥 NEW UI STATE — NOT PUBLIC
+--------------------------------------------+
| ⚠ This chatbot is not available publicly |
| |
| Please contact administrator |
+--------------------------------------------+

ROUTING STRUCTURE

Kalau pakai React Router:

/chatbot-costumer/:chatbotId

File:

src/pages/chatbot-costumer.tsx

Route wrapper:

<Route path="/chatbot-costumer/:chatbotId" element={<ChatbotCustomerPage />} />

📦 3️⃣ FOLDER STRUCTURE (IFRAME SAFE)
src/features/widget-chat/
├── index.ts
├── types.ts
├── schemas.ts
├── api.ts
├── socket.ts
├── store.ts
├── hooks/
│ ├── useCreateContact.ts
│ ├── useCreateConversation.ts
│ ├── useWidgetSocket.ts
│ └── useWidgetState.ts
├── components/
│ ├── ChatBubble.tsx
│ ├── ChatWidget.tsx
│ ├── ContactForm.tsx
│ ├── ConnectingState.tsx
│ ├── ChatWindow.tsx
│ ├── MessageBubble.tsx
│ ├── ChatInput.tsx
│ └── ErrorState.tsx

Scoped. No global leak.
