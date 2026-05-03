// file: components/IDE.tsx
'use client'

import { useEffect } from 'react'
import { useIDEStore } from '@/lib/store'
import { DEFAULT_FILES } from '@/lib/defaultFiles'
import Sidebar from './Sidebar'
import EditorPanel from './EditorPanel'
import AIChat from './AIChat'
import Terminal from './Terminal'

export default function IDE() {
  const { files, setFiles } = useIDEStore()

  useEffect(() => {
    if (files.length === 0) {
      setFiles(DEFAULT_FILES)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen bg-vs-bg overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[220px] bg-vs-sidebar border-r border-gray-700 overflow-y-auto flex flex-col">
          <Sidebar />
        </div>

        {/* Center area: editor + terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <EditorPanel />
          </div>

          {/* Terminal */}
          <div className="h-[180px] bg-vs-panel border-t border-gray-700 overflow-hidden flex flex-col">
            <Terminal />
          </div>
        </div>

        {/* AI Chat sidebar */}
        <div className="w-[320px] bg-vs-sidebar border-l border-gray-700 overflow-hidden flex flex-col">
          <AIChat />
        </div>
      </div>
    </div>
  )
}
