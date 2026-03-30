Siap 👍 aku akan buatkan **mockup pixel-ish dalam Markdown** dengan layout grid per section + state lengkap (default / empty / loading / error) untuk fitur:

- Realtime conversation
- List conversation (sidebar)
- Chat panel (message thread)
- Header dengan toggle AutoReply bot
- Status online + unread badge
- Input + attachment
- State lengkap per section

---

# 🧩 1️⃣ Layout Utama – Conversations Page

```md
┌──────────────────────────────────────────────────────────────────────────────┐
│ Sidebar │
│ (Chatbot Menu) │
│ ──────────────────────────────────────────────────────────────────────────── │
│ Home │
│ My Chatbots │
│ Create Chatbot │
│ Compare Results │
│ │
│ ⚙ Settings │
│ │
│ │
├──────────────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT │
│ │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Header │ │
│ │ ← Back 🤖 Omni Hottillier Chat [AutoReply ON]│ │
│ │ Status: ● Live | 3 Active Conversations │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ │
│ ┌──────────────────────────────┬───────────────────────────────────────────┐ │
│ │ Conversation List (30%) │ Chat Panel (70%) │ │
│ ├──────────────────────────────┼───────────────────────────────────────────┤ │
│ │ 🔍 Search conversations... │ │ │
│ │ │ │ │
│ │ ┌──────────────────────────┐ │ │ │
│ │ │ ● Andi Saputra │ │ │ │
│ │ │ Last: Harga kamar? │ │ │ │
│ │ │ 2m ago (2) │ │ │ │
│ │ └──────────────────────────┘ │ │ │
│ │ │ │ │
│ │ ┌──────────────────────────┐ │ │ │
│ │ │ ○ Maria Tan │ │ │ │
│ │ │ Last: Terima kasih │ │ │ │
│ │ │ 1h ago │ │ │ │
│ │ └──────────────────────────┘ │ │ │
│ │ │ │ │
│ └──────────────────────────────┴───────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 🗂 2️⃣ Conversation List Section (Detailed States)

## ✅ Default State

```md
┌────────────────────────────────────────────┐
│ 🔍 Search conversations... │
├────────────────────────────────────────────┤
│ ● Andi Saputra │
│ Harga kamar deluxe? │
│ 2m ago (2 unread) │
├────────────────────────────────────────────┤
│ ○ Maria Tan │
│ Terima kasih │
│ 1h ago │
└────────────────────────────────────────────┘
```

### Indicators:

- ● = Online
- ○ = Offline
- (2 unread) = badge
- Bold if unread
- Background highlight if selected

---

## 💤 Empty State

```md
┌────────────────────────────────────────────┐
│ 🔍 Search conversations... │
├────────────────────────────────────────────┤
│ │
│ 💬 No Conversations Yet │
│ Conversations will appear when users │
│ start chatting with your bot. │
│ │
└────────────────────────────────────────────┘
```

---

## ⏳ Loading State

```md
┌────────────────────────────────────────────┐
│ 🔍 Search conversations... │
├────────────────────────────────────────────┤
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
└────────────────────────────────────────────┘
```

---

## ❌ Error State

```md
┌────────────────────────────────────────────┐
│ ⚠ Failed to load conversations │
│ │
│ Please check your connection │
│ │
│ [ Retry ] │
└────────────────────────────────────────────┘
```

---

# 💬 3️⃣ Chat Panel – Default State

```md
┌──────────────────────────────────────────────────────────────┐
│ 👤 Andi Saputra ● Online │
│ Joined: 2 Mar 2026 │
├──────────────────────────────────────────────────────────────┤
│ │
│ Customer: │
│ ┌──────────────────────────────┐ │
│ │ Halo, harga kamar deluxe? │ │
│ └──────────────────────────────┘ │
│ │
│ Bot: │
│ ┌──────────────────────────────┐ │
│ │ Harga kamar deluxe mulai │ │
│ │ dari Rp 850.000 / malam │ │
│ └──────────────────────────────┘ │
│ │
│ Customer typing... │
│ │
├──────────────────────────────────────────────────────────────┤
│ 📎 Type your message... [Send ➤] │
└──────────────────────────────────────────────────────────────┘
```

---

# 💤 Chat Panel – Empty (No Selected Conversation)

```md
┌──────────────────────────────────────────────────────────────┐
│ │
│ 💬 Select a Conversation │
│ │
│ Choose a conversation from the left panel │
│ to start chatting with your customer. │
│ │
└──────────────────────────────────────────────────────────────┘
```

---

# ⏳ Chat Panel – Loading Messages

```md
┌──────────────────────────────────────────────────────────────┐
│ Loading messages... │
│ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
└──────────────────────────────────────────────────────────────┘
```

---

# ❌ Chat Panel – Error

```md
┌──────────────────────────────────────────────────────────────┐
│ ⚠ Failed to load messages │
│ │
│ [ Retry ] │
└──────────────────────────────────────────────────────────────┘
```

---

# 🤖 4️⃣ Header AutoReply Toggle (Detailed)

```md
┌──────────────────────────────────────────────────────────────┐
│ 🤖 Omni Hottillier Chat │
│ │
│ AutoReply: [ ON ] ← Green │
│ [ OFF ] ← Red │
│ │
│ When OFF: │
│ - Bot stops responding automatically │
│ - Only manual admin replies allowed │
└──────────────────────────────────────────────────────────────┘
```

---

# 🔄 Realtime Indicators

Tambahkan indikator berikut untuk realtime UX:

### Typing Indicator

```md
Andi is typing...
```

### New Message Toast

```md
🔔 New message from Maria Tan
[ View ]
```

### Connection Status

```md
● Connected (WebSocket)
○ Reconnecting...
✖ Disconnected
```

---

# 🎨 Suggested Grid System (For Dev Implementation)

| Section           | Grid             |
| ----------------- | ---------------- |
| Header            | 12 cols full     |
| Conversation List | 4 cols           |
| Chat Panel        | 8 cols           |
| Mobile Breakpoint | Stack vertically |
| Tablet            | 5 / 7 split      |

---

# ⚙ Recommended UX Enhancements

- Infinite scroll messages
- Sticky date separator
- Delivery status:
  - ✓ Sent
  - ✓✓ Delivered
  - ✓✓ Blue = Read

- Manual takeover indicator:
  - 🧑 Admin Mode Active

- Conversation tag:
  - New Lead
  - Booking Intent
  - Complaint

---

Kalau kamu mau, aku bisa lanjut buat:

- 🧠 Realtime architecture diagram (WebSocket + event flow)
- 🗃️ State management flow (Zustand / Redux)
- 🔥 Detailed component breakdown (React-based)
- 🧩 Vibe-coding agent prompt untuk generate semua ini otomatis

Kamu pakai stack apa? Next.js + Zustand? Atau pure React?
