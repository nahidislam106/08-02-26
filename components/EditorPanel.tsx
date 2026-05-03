// file: components/EditorPanel.tsx
'use client'

import dynamic from 'next/dynamic'
import { useIDEStore } from '@/lib/store'
import { getFileLanguage } from '@/lib/utils'
import { X } from 'lucide-react'

const Editor = dynamic(() => import('@monaco-editor/react').then(m => ({ default: m.default })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-vs-bg flex items-center justify-center text-vs-text">Loading editor...</div>,
})

export default function EditorPanel() {
  const { openFiles, activeFile, setActiveFile, closeFile, updateOpenFileContent } = useIDEStore()

  const current = openFiles.find((f) => f.path === activeFile)

  if (!current && openFiles.length === 0) {
    return (
      <div className="w-full h-full bg-vs-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-vs-accent mb-2">No file open</h1>
          <p className="text-vs-text">Select a file from the sidebar to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-0 bg-vs-panel border-b border-gray-700 overflow-x-auto flex-shrink-0">
        {openFiles.map((file) => (
          <div
            key={file.path}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-gray-700 transition ${
              activeFile === file.path
                ? 'bg-vs-bg text-vs-accent border-b-2 border-vs-accent'
                : 'bg-vs-panel text-vs-text hover:bg-gray-600'
            }`}
            onClick={() => setActiveFile(file.path)}
          >
            <span className="text-sm font-medium truncate">{file.path.split('/').pop()}</span>
            {file.unsavedChanges && <span className="text-xs text-yellow-500">●</span>}
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeFile(file.path)
              }}
              className="p-0 hover:bg-gray-700 rounded transition"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Editor */}
      {current && (
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={getFileLanguage(current.path)}
            language={getFileLanguage(current.path)}
            value={current.content}
            onChange={(value) => {
              if (value) {
                updateOpenFileContent(current.path, value, true)
              }
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineHeight: 1.6,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              insertSpaces: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      )}
    </div>
  )
}
