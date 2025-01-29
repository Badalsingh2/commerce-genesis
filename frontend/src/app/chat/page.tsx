"use client"
import { Chat } from '@/components/Chat'
import React, { useState } from 'react'

function ChatPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  return (
    <Chat
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      isChatOpen={isChatOpen}
      setIsChatOpen={setIsChatOpen}
    />
  )
}

export default ChatPage
