// file: components/AIChat.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { useIDEStore } from '@/lib/store'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import { extractCodeBlocks } from '@/lib/utils'
import { Send, Loader } from 'lucide-react'

const PUTER_CDNS = [
  'https://cdn.puter.com/puter.js',
  'https://unpkg.com/@puter/puter/dist/puter.js',
  'https://cdn.jsdelivr.net/npm/@puter/puter/dist/puter.js',
]

export default function AIChat() {
  const {
    chatHistory,
    addChatMessage,
    updateFile,
    addTerminalOutput,
    clearChat,
  } = useIDEStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory, currentResponse])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const loadPuterScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`)
      if (existing) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.head.appendChild(script)
    })

  const waitForPuter = async () => {
    let attempts = 0
    while (!window.puter && attempts < 60) {
      await new Promise((r) => setTimeout(r, 100))
      attempts++
    }
    return window.puter
  }

  const ensurePuter = async () => {
    if (window.puter) return window.puter

    for (const cdn of PUTER_CDNS) {
      try {
        await loadPuterScript(cdn)
        const puter = await waitForPuter()
        if (puter) return puter
      } catch {
        // Try next CDN
      }
    }

    return undefined
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message to history
    addChatMessage('user', userMessage)

    // Prepare messages for Puter.js
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      })),
      { role: 'user' as const, content: userMessage },
    ]

    setIsLoading(true)
    setCurrentResponse('')

    try {
      const puter = await ensurePuter()

      if (!puter) {
        const errorMsg = 'Puter.js failed to load. Check Console (F12) for network or CSP errors, then refresh.'
        showToast(errorMsg)
        addTerminalOutput(`✗ Chat error: ${errorMsg}`)
        return
      }

      if (!puter.ai || typeof puter.ai.chat !== 'function') {
        throw new Error('Puter AI API not available. Please ensure you are logged into Puter.')
      }

      const response = await puter.ai.chat(messages, {
        model: 'claude-sonnet-4-6',
        stream: true,
      })

      let fullResponse = ''

      // Handle streaming response
      if (response && typeof response === 'object' && Symbol.asyncIterator in response) {
        for await (const chunk of response as AsyncIterable<string>) {
          fullResponse += chunk
          setCurrentResponse(fullResponse)
        }
      } else if (typeof response === 'string') {
        fullResponse = response
        setCurrentResponse(fullResponse)
      }

      // Add assistant message to history
      addChatMessage('assistant', fullResponse)

      // Extract and apply code blocks
      const codeBlocks = extractCodeBlocks(fullResponse)
      if (codeBlocks.length > 0) {
        for (const block of codeBlocks) {
          updateFile(block.path, block.content)
          showToast(`Updated ${block.path}`)
          addTerminalOutput(`✓ Updated file: ${block.path}`)
        }
      }

      setCurrentResponse('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      console.error('Chat error:', error)
      showToast(`Error: ${errorMessage}`)
      addTerminalOutput(`✗ Chat error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-vs-sidebar text-vs-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-vs-panel flex-shrink-0">
        <h2 className="text-sm font-bold">Claude AI</h2>
        <button
          onClick={() => clearChat()}
          className="text-xs px-2 py-1 bg-vs-accent bg-opacity-20 text-vs-accent rounded hover:bg-opacity-30 transition"
        >
          Clear
        </button>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Start a conversation with Claude AI</p>
            <p className="text-xs mt-2">Ask for code help, file generation, or explanations</p>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-vs-accent text-vs-bg'
                      : 'bg-vs-panel text-vs-text'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && currentResponse && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg text-sm bg-vs-panel text-vs-text">
                  <p className="whitespace-pre-wrap text-sm">{currentResponse}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Loader size={14} className="animate-spin" />
                    <span className="text-xs">Streaming...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="mx-4 mb-2 px-3 py-2 bg-green-900 bg-opacity-50 text-green-300 rounded text-xs">
          {toastMessage}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-700 p-3 flex-shrink-0 bg-vs-panel">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask Claude..."
            className="flex-1 bg-vs-bg px-3 py-2 rounded text-sm text-vs-text placeholder-gray-600 outline-none border border-gray-700 hover:border-gray-600 focus:border-vs-accent transition"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-vs-accent text-vs-bg rounded hover:opacity-90 disabled:opacity-50 transition flex items-center gap-1"
          >
            {isLoading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Shift+Enter for new line. Files auto-update when Claude provides code.
        </p>
      </div>
    </div>
  )
}
