// file: lib/defaultFiles.ts
import { FileEntry } from './store'

export const DEFAULT_FILES: FileEntry[] = [
  {
    path: 'README.md',
    content: `# CodeAI - AI Coding Agent

A VS Code-style web IDE powered by Claude AI via Puter.js.

## Features

- 💻 Monaco Editor with syntax highlighting
- 🤖 Claude Sonnet AI integration via Puter.js
- 📁 File tree navigation
- 💬 Streaming AI chat responses
- 🎨 VS Code dark theme
- ⚡ Real-time code editing

## Getting Started

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to start coding.

## How to Use

1. **Edit files** in the Monaco Editor
2. **Ask questions** in the AI Chat panel
3. **AI can update files** - when Claude generates code with \`// file: <path>\`, the IDE automatically updates that file
4. **Try terminal commands** in the Terminal panel (ls, clear, etc.)

## Tech Stack

- Next.js 14
- Tailwind CSS
- Monaco Editor
- Zustand
- Puter.js (free Claude Sonnet access)

---

Made with ❤️ for developers
`,
  },
  {
    path: 'components/HelloWorld.tsx',
    content: `// file: components/HelloWorld.tsx
'use client'

export default function HelloWorld() {
  return (
    <div className="p-8 bg-vs-panel rounded-lg">
      <h1 className="text-3xl font-bold text-vs-accent mb-4">
        Welcome to CodeAI
      </h1>
      <p className="text-vs-text mb-4">
        This is a sample component. Edit files in the editor and ask Claude for help!
      </p>
      <button className="px-4 py-2 bg-vs-accent text-vs-bg rounded hover:opacity-90 transition">
        Click me
      </button>
    </div>
  )
}
`,
  },
  {
    path: 'lib/utils.ts',
    content: `// file: lib/utils.ts
export function getFileLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    json: 'json',
    md: 'markdown',
    css: 'css',
    html: 'html',
    sql: 'sql',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    sh: 'bash',
    bash: 'bash',
  }
  
  return languageMap[ext || ''] || 'plaintext'
}

export function extractCodeBlocks(text: string): Array<{ path: string; content: string }> {
  const regexp = /\\/\\/\\s*file:\\s*([^\\n]+)\\n([\\s\\S]*?)(?=\\/\\/\\s*file:|$)/g
  const blocks: Array<{ path: string; content: string }> = []
  let match
  
  while ((match = regexp.exec(text)) !== null) {
    const path = match[1].trim()
    const content = match[2].trim()
    if (path && content) {
      blocks.push({ path, content })
    }
  }
  
  return blocks
}
`,
  },
  {
    path: 'hooks/useTerminal.ts',
    content: `// file: hooks/useTerminal.ts
'use client'

import { useIDEStore } from '@/lib/store'

export function useTerminal() {
  const { terminalOutput, addTerminalOutput, clearTerminal } = useIDEStore()

  const executeCommand = (cmd: string) => {
    // Show the command
    addTerminalOutput(\`$ \${cmd}\`)

    // Simulate command execution
    if (cmd === 'clear') {
      clearTerminal()
    } else if (cmd === 'ls') {
      addTerminalOutput('HelloWorld.tsx')
      addTerminalOutput('utils.ts')
      addTerminalOutput('useTerminal.ts')
    } else if (cmd.startsWith('echo ')) {
      const text = cmd.slice(5)
      addTerminalOutput(text)
    } else if (cmd === 'pwd') {
      addTerminalOutput('/workspace')
    } else if (cmd === 'help') {
      addTerminalOutput('Available commands: ls, clear, echo, pwd, help')
    } else {
      addTerminalOutput(\`command not found: \${cmd}\`)
    }
  }

  return {
    terminalOutput,
    executeCommand,
    clearTerminal,
  }
}
`,
  },
  {
    path: 'docs/ARCHITECTURE.md',
    content: `# CodeAI Architecture

## Overview

CodeAI is a VS Code-style web IDE built with Next.js that provides Claude Sonnet AI assistance for coding tasks.

## Components

### IDE.tsx
Main layout component that orchestrates the three-panel layout:
- Sidebar (file tree)
- Editor (Monaco Editor with tabs)
- AI Chat (message thread with Claude)
- Terminal (command simulation)

### FileSystem
Files are stored in Zustand state with the structure:
- path: file path (e.g., "components/HelloWorld.tsx")
- content: file content
- language: detected from file extension

### AI Chat Flow
1. User types message and clicks send
2. Message added to chatHistory
3. All messages sent to Puter.js with system prompt
4. Response streamed token-by-token into UI
5. Code blocks detected in response and auto-saved to files

## Styling

Uses Tailwind CSS with custom VS Code color palette:
- bg: #1e1e1e
- sidebar: #252526
- panel: #2d2d30
- text: #d4d4d4
- accent: #569cd6

## State Management

Zustand store manages:
- files[]
- openFiles[]
- activeFile
- terminalOutput[]
- chatHistory[]
`,
  },
]
