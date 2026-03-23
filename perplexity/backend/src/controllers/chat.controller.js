import { Result } from "express-validator";
import { generteResponse, generteChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";



export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let chat = null, title = null;

  if (!chatId) {
    title = await generteChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const chatRef = chatId || chat._id;

  const userMessage = await messageModel.create({
    chat: chatRef,
    content: message,
    role: "user",
  });

  // ✅ Use chatRef instead of chatId
  const messages = await messageModel.find({ chat: chatRef });

  // ✅ Map to plain objects with role + content
  const formattedMessages = messages.map(msg => ({
    role: msg.role === "ai" ? "user" : msg.role, // LangChain expects "assistant"
    content: msg.content,
  }));

  const result = await generteResponse(formattedMessages);

  const aiMessage = await messageModel.create({
    chat: chatRef,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    title,
    chat,
      userMessage,
    aiMessage,
  });
}

export async function getChats(req,res) {
  const user = req.user.id;
  const chats = await chatModel.find({user});
  res.status(200).json({
    message:"Chats retrieved successfully",
    chats
  });
  
}

export async function getChatMessages(req,res) {
  const {chatId} = req.params;
  const chat = await chatModel.findById({
    _id:chatId,
    user:req.user.id
  })
  if(!chat){
    return res.status(404).json({
      message:"Chat not found"
    })
  }

  const messages = await messageModel.find({chat:chatId});

  res.status(200).json({
    message:"Messages retrieved successfully",
    messages
  })
}

export async function deleteChat(req,res) {
  const {chatId} = req.params;
  const chat = await chatModel.findById({
    _id:chatId,
    user:req.user.id
  })
  if(!chat){
    return res.status(404).json({
      message:"Chat not found"
    })
  }
  await chatModel.findOneAndDelete({
     _id:chatId,
    user:req.user.id
  });
  await messageModel.deleteMany({chat:chatId})
  res.status(200).json({
    message:"Chat deleted successfully"
  })
}

export async function renameChat(req,res) {
  const {chatId} = req.params;
  const {title} = req.body;
  const chat = await chatModel.findById({
    _id:chatId,
    user:req.user.id
  })
  if(!chat){
    return res.status(404).json({
      message:"Chat not found"
    })
  }
  chat.title = title;
  await chat.save();
  res.status(200).json({
    message:"Chat renamed successfully"
  })
}

export async function shareChat(req,res) {
  const {chatId} = req.params;
  const chat = await chatModel.findById({
    _id:chatId,
    user:req.user.id
  })
  if(!chat){
    return res.status(404).json({
      message:"Chat not found"
    })
  }
  chat.isPublic = true;
  await chat.save();
  res.status(200).json({
    message:"Chat shared successfully"
  })
}





