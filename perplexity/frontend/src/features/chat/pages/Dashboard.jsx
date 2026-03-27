import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()  //chat
  const [chatInput, setChatInput] = useState('')  //seachbox
const [editingChatId, setEditingChatId] = useState(null)
const [newTitle, setNewTitle] = useState("")

  const chats = useSelector((state) => state.chat.chats) //side chat bar
  const currentChatId = useSelector((state) => state.chat.currentChatId)  //selected chat 

  useEffect(() => {
    chat.initializeSocketConnection()  // socket
    chat.handleGetChats()  //get
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
  }
  const deleteChat = (chatId) => {
    
    chat.handleDeleteChat(chatId)
  }
  const renameChat = (chatId,newTitle) => {
    console.log(chatId,newTitle)
    chat.handleRenameChat(chatId,newTitle)
  }
  



  return (
    <main className='min-h-screen w-full bg-[#0b0f19] text-white flex'>

      {/* Sidebar */}
      <aside className='hidden md:flex flex-col w-72 bg-[#0e1422] border-r border-white/10 p-4'>

        <h1 className='text-2xl font-semibold mb-1 px-2 py-2 border-b text-center'>Perplexity</h1>

        <div className='space-y-2 overflow-y-auto'>
          <button onClick={chat.handleNewChat} className=' flex  items-center rounded px-2 py-2 w-full hover:bg-gray-800'><i className="ri-chat-new-line text-2xl"> </i>New Chat</button>
<hr />
<p class>chat history</p>

{Object.values(chats).map((chat, index) => (
  <div 
    key={index} 
    className={`flex items-center group w-full  border rounded-2xl  rounded-bl-none text-white/80 hover:bg-gray-600 hover:text-white transition  ${
        currentChatId === chat.id? 'bg-gray-500' : ''
      }`}
  >
    {/* Chat Button */}
    {editingChatId === chat.id ? (
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={() => {
          chat.handleRenameChat(chat.id, newTitle)
          setEditingChatId(null)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
           renameChat(chat.id, newTitle)
            setEditingChatId(null)
          }
        }}
        className="flex-1 px-2 py-1 rounded bg-[#111827] text-white"
        autoFocus
      />
    ) : (
    <button
      onClick={() => openChat(chat.id)}
      className={`flex-1 text-left px-3 py-2 rounded-2xl text-sm cursor-pointer `}
    >
      {chat.title}
    </button>
    )}

    {/* Delete Button (visible on hover) */}
    <button
     onClick={() => {
  const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
  if (confirmDelete) {
    deleteChat(chat.id);
  }
}}
      className="opacity-0 group-hover:opacity-100 text-red-400 px-2 transition"
    >
      <i className="ri-delete-bin-line"></i>
    </button>
        {/* ✏️ Rename button */}
    <button
      onClick={() => {
        setEditingChatId(chat.id)
        setNewTitle(chat.title)
      }}
      className="opacity-0 group-hover:opacity-100 px-2"
    >
      ✏️
    </button>
  </div>
))}
      </div>

    </aside>

      {/* Chat Section */ }
  <section className='flex flex-col flex-1  mx-auto h-screen relative w-full justify-center items-center'>

    {/* Messages */}
    <div className=' messages flex-1   overflow-y-auto px-20 py-6 space-y-4 pb-32'>
      {!currentChatId && (
        <div className='text-center text-4xl text-white/80 mt-50'>
          Start a new conversation 🚀
        </div>
      )}
      {chats[currentChatId]?.messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
              ? 'bg-white/20 text-white rounded-br-none'
              : ' text-white/90 rounded-bl-none'
              }`}
          >
            {message.role === 'user' ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                  ul: ({ children }) => <ul className='list-disc pl-5 mb-2'>{children}</ul>,
                  ol: ({ children }) => <ol className='list-decimal pl-5 mb-2'>{children}</ol>,
                  code: ({ children }) => (
                    <code className='bg-black/40 px-1 py-0.5 rounded text-sm'>
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className='bg-black/50 p-3 rounded-xl overflow-x-auto mb-2'>
                      {children}
                    </pre>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Input Box */}
    <footer className='absolute bottom-0 left-0 w-full px-4 pb-4'>
      <form
        onSubmit={handleSubmitMessage}
        className='bg-[#111827] border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg'
      >
        <input
          type='text'
          value={chatInput}
          onChange={(event) => setChatInput(event.target.value)}
          placeholder='Ask anything...'
          className='flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40'
        />

        <button
          type='submit'
          disabled={!chatInput.trim()}
          className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium disabled:opacity-50 transition'
        >
          Send
        </button>
      </form>
    </footer>
  </section>
    </main >
  )
}

export default Dashboard