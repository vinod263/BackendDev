import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats,getMessages,deleteChat ,renameChat} from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading,setError, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        const data = await sendMessage({ message, chatId })
        const { chat, aiMessage } = data
        if (!chatId)
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user",
        }))
        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }))
        dispatch(setCurrentChatId(chat._id))
        dispatch(setLoading(false))
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[ chatId ]?.messages.length)

        if (chats[ chatId ]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }
    function handleNewChat() {
    dispatch(setCurrentChatId(null))
}
    async function handleDeleteChat(chatId) {
    try {
        dispatch(setLoading(true))

        await deleteChat(chatId)

        // Redux se chat remove kar
        dispatch({
            type: "chat/deleteChat",
            payload: chatId
        })

        // agar deleted chat current hai → reset
        dispatch(setCurrentChatId(null))

    } catch (error) {
        dispatch(setError("Failed to delete chat",error))
    } finally {
        dispatch(setLoading(false))
    }
}
    async function handleRenameChat(chatId,newTitle) {
    try {
        dispatch(setLoading(true))

        await renameChat({chatId,newTitle})

        // Redux se chat remove kar
        dispatch({
            type: "chat/renameChat",
            payload:{ chatId , title : newTitle}
        })

    } catch (error) {
        dispatch(setError("Failed to rename chat",error))
    } finally {
        dispatch(setLoading(false))
    }
}
    

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleNewChat,
        handleDeleteChat,
        handleRenameChat
    }

}