import { useState, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
 onSend: (text: string) => void;
 disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
 const [text, setText] = useState("");

 const handleSend = () => {
  const trimmed = text.trim();
  if (!trimmed || disabled) return;
  onSend(trimmed);
  setText("");
 };

 const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  handleSend();
 };

 const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
   e.preventDefault();
   handleSend();
  }
 };

 return (
  <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-gray-100 bg-white px-4 py-3">
   <textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    onKeyDown={handleKeyDown}
    rows={1}
    placeholder="Type your message…"
    disabled={disabled}
    className="max-h-24 min-h-[36px] flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
   />
   <button
    type="submit"
    disabled={disabled || !text.trim()}
    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
   >
    <SendHorizonal className="h-4 w-4" />
   </button>
  </form>
 );
}
