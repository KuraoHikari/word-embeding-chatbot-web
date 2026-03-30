import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "../schemas";
import { createContact, createConversation } from "../api";
import { useWidgetChatStore } from "../store";

export function ContactForm() {
 const { chatbot, setToken, setActiveConversation, setWidgetState, setErrorMessage } = useWidgetChatStore();

 const {
  register,
  handleSubmit,
  formState: { errors },
 } = useForm<ContactFormData>({
  resolver: zodResolver(contactFormSchema),
  defaultValues: { name: "", email: "", phone: "" },
 });

 // Step 1 — Create contact
 const contactMutation = useMutation({
  mutationFn: (data: ContactFormData) =>
   createContact({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    chatbotId: chatbot!.id,
   }),
  onSuccess: async (response) => {
   const token = response.access_token;
   setToken(token);

   // Step 2 — Create conversation
   conversationMutation.mutate({ token });
  },
  onError: () => {
   setErrorMessage("Failed to create contact. Please try again.");
  },
 });

 // Step 2 — Create conversation
 const conversationMutation = useMutation({
  mutationFn: ({ token }: { token: string }) => createConversation({ chatbotId: chatbot!.id, autoReply: true }, token),
  onSuccess: (response) => {
   setActiveConversation(response.id);
   setWidgetState("CONNECTING");
  },
  onError: () => {
   setErrorMessage("Failed to start conversation. Please try again.");
   setWidgetState("ERROR");
  },
 });

 const isLoading = contactMutation.isPending || conversationMutation.isPending;

 const onSubmit = (data: ContactFormData) => {
  contactMutation.mutate(data);
 };

 return (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
   <div className="mx-4 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
    {/* Header */}
    <div className="flex h-16 items-center gap-3 border-b border-gray-100 bg-blue-600 px-5">
     <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">🤖</div>
     <span className="font-semibold text-white">{chatbot?.title ?? "Chat"}</span>
    </div>

    {/* Body */}
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
     <p className="text-center text-sm text-gray-600">👋 Hi! Please introduce yourself to start chatting.</p>

     {/* Name */}
     <div>
      <label htmlFor="widget-name" className="mb-1 block text-sm font-medium text-gray-700">
       Name
      </label>
      <input
       id="widget-name"
       type="text"
       {...register("name")}
       className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
       placeholder="Your name"
       disabled={isLoading}
      />
      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
     </div>

     {/* Email */}
     <div>
      <label htmlFor="widget-email" className="mb-1 block text-sm font-medium text-gray-700">
       Email
      </label>
      <input
       id="widget-email"
       type="email"
       {...register("email")}
       className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
       placeholder="you@email.com"
       disabled={isLoading}
      />
      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
     </div>

     {/* Phone */}
     <div>
      <label htmlFor="widget-phone" className="mb-1 block text-sm font-medium text-gray-700">
       Phone <span className="font-normal text-gray-400">(optional)</span>
      </label>
      <input
       id="widget-phone"
       type="tel"
       {...register("phone")}
       className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
       placeholder="+62 812 ..."
       disabled={isLoading}
      />
     </div>

     {/* Error */}
     {contactMutation.isError && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">⚠ Failed to create contact. Please try again.</p>}

     {/* Submit */}
     <button
      type="submit"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
     >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? "Starting…" : "Start Chatting"}
     </button>
    </form>

    {/* Footer */}
    <div className="border-t border-gray-100 bg-gray-50 py-2 text-center text-xs text-gray-400">🔒 Secured connection</div>
   </div>
  </div>
 );
}
