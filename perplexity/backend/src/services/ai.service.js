import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from '@langchain/mistralai'
import { HumanMessage,SystemMessage ,AIMessage} from "langchain";
const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});
const mistralaiModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
})

export async function generteResponse(messages) {
  const response = await geminimodel.invoke(messages.map(msg => {
    if (msg.role == "user") {
      return new HumanMessage(msg.content);
    } else if (msg.role == "ai") {
      return new AIMessage(msg.content);
    }
  }));


  return response.text;
}

export async function generteChatTitle(message) {
  const response = await mistralaiModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for conversations. 
      The title should capture the essence of the conversation in a few words.
      user will give you a conversation and you will generate a title  in 2-4 words.the title should be concise and descriptive, capturing the main topic or theme of the conversation.
      `),
    new HumanMessage(`
      generate a title for the chat conversation below:
      ${message}
    `)
  ])
  
  return response.text
}