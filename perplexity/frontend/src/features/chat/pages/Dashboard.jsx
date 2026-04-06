import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import remarkGfm from 'remark-gfm'
import {
  Plus, Search, Compass, Library, MessageSquare,
  MoreHorizontal, PenLine, Trash2, Menu, X, ArrowUp, Paperclip, Globe, User,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [editingChatId, setEditingChatId] = useState(null)
  const [newTitle, setNewTitle] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const user = useSelector((state) => state.auth?.user)

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()

    // Default sidebar to closed on mobile screens
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats, currentChatId])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  const deleteChat = (chatId, e) => {
    e.stopPropagation()
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (confirmDelete) {
      chat.handleDeleteChat(chatId);
    }
  }

  const renameChat = (chatId) => {
    chat.handleRenameChat(chatId, newTitle)
    setEditingChatId(null)
  }

  const startNewChat = () => {
    chat.handleNewChat()
    if (window.innerWidth < 768) setIsSidebarOpen(false)
  }

  return (
    <div className='flex h-screen w-full bg-[#e3e4e6] dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans overflow-hidden'>

      {/* Mobile Header Overlay */}
      <div className="md:hidden absolute top-0 left-0 w-full p-4 flex items-center justify-between z-20 bg-[#e3e4e6] dark:bg-[#09090b]">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 cursor-pointer text-gray-600 dark:text-gray-400" onClick={() => setIsSidebarOpen(true)} />
          <span className="font-semibold text-lg hover:text-gray-600 transition" onClick={startNewChat}>Perplexity Clone</span>
        </div>
        <button onClick={startNewChat}>
          <Plus className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Floating Desktop Toggle (visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden md:flex absolute top-4 left-4 z-40 p-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="w-5 h-5 focus:outline-none" />
        </button>
      )}

      {/* Sidebar Modal Overlay (Mobile Only) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full bg-[#f1f2f4] dark:bg-[#18181b] 
        transition-all duration-300 ease-in-out z-40 flex flex-col pt-2 md:pt-4 
        border-r border-gray-200 dark:border-white/5
        ${isSidebarOpen ? 'translate-x-0 w-64 shrink-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:border-none p-0 overflow-hidden'}
      `}>

        {/* Sidebar Header & Desktop Collapse Button */}
        <div className={`flex items-center justify-between px-4 mb-2 w-64 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity delay-100`}>
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 cursor-pointer" onClick={startNewChat}>
            <div className="w-6 h-6 rounded-sm bg-black dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black text-sm">P</span>
            </div>
            Perplexity
          </div>

          <button onClick={() => setIsSidebarOpen(false)} className="hidden md:flex p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500" title="Collapse Sidebar">
            <PanelLeftClose className="w-5 h-5" />
          </button>

          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500" title="Close Sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Nav Actions */}
        <div className={`px-3 flex flex-col gap-1 mb-6 w-64 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={startNewChat}
            className="flex items-center justify-between w-full p-2.5 mt-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 opacity-70" />
              <span>New Thread</span>
            </div>
            <div className="flex items-center justify-center w-5 h-5 rounded border border-gray-300 dark:border-white/20 text-xs text-gray-500 dark:text-gray-400">
              <span className="opacity-80">⌘I</span>
            </div>
          </button>
          <button className="flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </button>
          <button className="flex items-center gap-3 w-full p-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <Library className="w-4 h-4" />
            <span>Library</span>
          </button>
        </div>

        {/* Chat History / Threads ListView */}
        <div className={`flex flex-col flex-1 overflow-hidden px-3 hidden-scrollbar w-64 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Threads</h3>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 pb-4">
            {Object.values(chats).map((chatObj) => (
              <div
                key={chatObj.id}
                onClick={() => openChat(chatObj.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-colors
                  ${currentChatId === chatObj.id ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}
                `}
              >
                {editingChatId === chatObj.id ? (
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => renameChat(chatObj.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renameChat(chatObj.id)
                    }}
                    className="flex-1 bg-white dark:bg-black border border-blue-500 rounded px-2 py-0.5 outline-none text-gray-900 dark:text-white"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate pr-2">{chatObj.title}</span>
                )}

                {/* Actions on Hover */}
                {!editingChatId || editingChatId !== chatObj.id ? (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(chatObj.id);
                        setNewTitle(chatObj.title);
                      }}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10"
                    >
                      <PenLine className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => deleteChat(chatObj.id, e)}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className={`p-3 mt-auto w-64 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity delay-100`}>
          <button className="flex items-center gap-3 w-full p-2 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-cyan-600 dark:bg-cyan-700 flex flex-shrink-0 items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col items-start truncate overflow-hidden">
              <span className="truncate font-semibold text-gray-800 dark:text-gray-200">
                {user?.name || user?.username || 'User Account'}
              </span>
              <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.email || 'Logged In'}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col h-full relative w-full pt-16 md:pt-0 ${isSidebarOpen ? 'md:max-w-[calc(100vw-16rem)]' : 'md:max-w-full'}`}>
        <div className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-32 w-full mx-auto max-w-5xl hidden-scrollbar pb-36">

          {/* Default Start Screen */}
          {!currentChatId && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in -mt-16">
              <h2 className="text-3xl md:text-5xl tracking-tight text-gray-800 dark:text-white font-[400] mb-8 font-serif">
                Where knowledge begins
              </h2>
            </div>
          )}

          {/* Active Chat Thread */}
          {currentChatId && (
            <div className="pt-8 md:pt-12 pb-8 space-y-8 min-h-full">
              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 capitalize">
                {chats[currentChatId]?.title}
              </h1>

              {chats[currentChatId]?.messages.map((message) => (
                <div key={message.id} className="w-full">
                  {message.role === 'user' ? (
                    <div className="flex justify-end mb-4">
                      <div className="max-w-[85%] bg-gray-200 dark:bg-[#2e3030] text-gray-900 dark:text-gray-100 px-5 py-3.5 rounded-2xl md:text-lg whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      {/* Bot Avatar */}
                      <div className="w-8 h-8 rounded shrink-0 bg-black dark:bg-white flex items-center justify-center mt-1 outline outline-1 outline-gray-200 dark:outline-white/10">
                        <span className="text-white dark:text-black font-bold text-lg leading-none">P</span>
                      </div>

                      {/* Bot Message Content */}
                      <div className="flex-1 w-full text-base leading-relaxed text-gray-800 dark:text-gray-200">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className='mb-4 last:mb-0 max-w-full overflow-hidden text-wrap break-words'>{children}</p>,
                            ul: ({ children }) => <ul className='list-disc pl-5 mb-4 max-w-full'>{children}</ul>,
                            ol: ({ children }) => <ol className='list-decimal pl-5 mb-4 max-w-full'>{children}</ol>,
                            li: ({ children }) => <li className='mb-1 text-wrap break-words'>{children}</li>,
                            code: ({ inline, children }) =>
                              inline ? (
                                <code className='bg-gray-200 dark:bg-[#27272a] text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm break-all'>{children}</code>
                              ) : (
                                <code className='block bg-gray-100 gap-4 dark:bg-[#18181b] p-4 rounded-xl overflow-x-auto mb-4 border border-gray-200 dark:border-white/10 text-sm font-mono'>
                                  {children}
                                </code>
                              ),
                            pre: ({ children }) => <div>{children}</div>,
                            a: ({ children, href }) => <a href={href} className="text-blue-500 hover:text-blue-400 underline break-words">{children}</a>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className={`absolute left-0 w-full px-4 md:px-12 lg:px-32 flex justify-center z-10 transition-all duration-300 ease-out
          ${!currentChatId ? 'top-[50%] md:top-[60%] -translate-y-1/2' : 'bottom-6'}
        `}>
          <div className="w-full max-w-3xl bg-white dark:bg-[#18181b] border border-gray-300 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 flex flex-col p-2 transition-all hover:border-gray-400 dark:hover:border-white/20 focus-within:border-gray-500 dark:focus-within:border-white/30">
            <form onSubmit={handleSubmitMessage} className="flex flex-col">
              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim()) handleSubmitMessage(e);
                  }
                }}
                placeholder="Ask anything..."
                rows={chatInput.split('\n').length > 1 || !currentChatId ? Math.min(chatInput.split('\n').length, 8) : 1}
                className="w-full bg-transparent outline-none resize-none px-3 py-3 text-base md:text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 min-h-[50px] max-h-[200px]"
              />

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-1">
                  <button type="button" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Paperclip className="w-4 h-4" /> <span className="hidden sm:inline">Attach</span>
                  </button>
                  <button type="button" className="p-2 lg:px-3 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Globe className="w-4 h-4" /> <span className="hidden sm:inline">Focus</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-medium mr-2">
                    <span className="text-blue-500 font-bold mr-1">Pro</span> Toggle
                  </div>
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className={`p-2 rounded-full flex items-center justify-center transition-all ${chatInput.trim()
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

    </div>
  )
}

export default Dashboard