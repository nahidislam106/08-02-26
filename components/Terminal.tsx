// file: components/Terminal.tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { useIDEStore } from '@/lib/store'
import { ChevronUp } from 'lucide-react'

export default function Terminal() {
  const { terminalOutput, addTerminalOutput, clearTerminal } = useIDEStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [command, setCommand] = useState('')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [terminalOutput])

  const handleExecute = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim()) {
      const cmd = command.trim()
      executeCommand(cmd)
      setCommand('')
    }
  }

  const executeCommand = (cmd: string) => {
    addTerminalOutput(`$ ${cmd}`)

    if (cmd === 'clear') {
      clearTerminal()
      setCommand('')
    } else if (cmd === 'ls') {
      addTerminalOutput('README.md')
      addTerminalOutput('components/')
      addTerminalOutput('lib/')
      addTerminalOutput('hooks/')
      addTerminalOutput('docs/')
    } else if (cmd.startsWith('echo ')) {
      const text = cmd.slice(5).replace(/["']/g, '')
      addTerminalOutput(text)
    } else if (cmd === 'pwd') {
      addTerminalOutput('/workspace')
    } else if (cmd === 'help') {
      addTerminalOutput('Available commands: ls, clear, echo <text>, pwd, help')
    } else if (cmd === 'whoami') {
      addTerminalOutput('developer')
    } else {
      addTerminalOutput(`command not found: ${cmd}`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-vs-panel text-vs-text">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-vs-sidebar flex-shrink-0">
        <div className="flex items-center gap-2">
          <ChevronUp size={16} className="text-gray-500" />
          <span className="text-sm font-semibold">Terminal</span>
        </div>
        <button
          onClick={() => clearTerminal()}
          className="text-xs px-2 py-1 bg-vs-accent bg-opacity-20 text-vs-accent rounded hover:bg-opacity-30 transition"
        >
          Clear
        </button>
      </div>

      {/* Output area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-2 text-sm font-mono">
        {terminalOutput.length === 0 ? (
          <div className="text-gray-500">$ Type a command and press Enter</div>
        ) : (
          <>
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap break-all text-gray-300">
                {line}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-2 bg-vs-bg border-t border-gray-700 flex-shrink-0">
        <span className="text-green-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleExecute}
          className="flex-1 bg-transparent outline-none text-vs-text placeholder-gray-600"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  )
}
