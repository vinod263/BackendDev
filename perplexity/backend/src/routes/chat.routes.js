import { Router} from 'express';
import {sendMessage,getChats,getChatMessages,deleteChat,renameChat,shareChat} from '../controllers/chat.controller.js'
import { authUser } from '../middleware/auth.middleware.js';
const chatRouter = Router();

chatRouter.post("/message",authUser,sendMessage)

chatRouter.get("/",authUser,getChats)

chatRouter.get("/:chatId/messages",authUser,getChatMessages)

chatRouter.delete("/:chatId",authUser,deleteChat)

chatRouter.put("/:chatId/rename",authUser,renameChat)

chatRouter.put("/:chatId/share",authUser,shareChat)


export default chatRouter;
 