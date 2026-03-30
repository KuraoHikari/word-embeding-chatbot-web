# Socket Contract

## message:send

payload:
{
text: string
conversationId: number
chatbotId: number
}

## message:new

payload:
{
id: number
text: string
conversationId: number
isBot: boolean
createdAt: string
}

## conversation:autoReplyUpdated

payload:
{
conversationId: number
autoReply: boolean
}
