import { Router} from 'express';
import {sendMessage,getChats,getMessages,deleteChat,renameChat,shareChat} from '../controllers/chat.controller.js'
import { authUser } from '../middleware/auth.middleware.js';
const chatRouter = Router();
/**
 * @route /api/chats/message
 * @body { message, chatId }
 * @description : send message to a chat
 * @access : private
 */
chatRouter.post("/message",authUser,sendMessage)
/**
 * @route /api/chats/ 
 * @description : get all chats of a user
 * @access : private
 */
chatRouter.get("/",authUser,getChats)

chatRouter.get("/:chatId/messages",authUser,getMessages)

chatRouter.delete("/delete/:chatId",authUser,deleteChat)

chatRouter.put("/:chatId/rename",authUser,renameChat)

chatRouter.put("/:chatId/share",authUser,shareChat)


export default chatRouter;
 