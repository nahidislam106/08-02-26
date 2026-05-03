// file: components/Sidebar.tsx
'use client'

import { useIDEStore } from '@/lib/store'
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'

interface TreeNode {
  type: 'file' | 'folder'
  name: string
  path: string
  children?: TreeNode[]
}

export default function Sidebar() {
  const { files, openFile, activeFile } = useIDEStore()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']))

  const tree = useMemo(() => buildTree(files), [files])

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const renderTree = (nodes: TreeNode[], depth: number = 0): JSX.Element => {
    return (
      <>
        {nodes.map((node) => (
          <div key={node.path}>
            {node.type === 'folder' ? (
              <div>
                <button
                  onClick={() => toggleFolder(node.path)}
                  className="w-full flex items-center gap-1 px-2 py-1 hover:bg-vs-panel transition text-vs-text text-sm"
                  style={{ paddingLeft: `${depth * 12 + 8}px` }}
                >
                  {expandedFolders.has(node.path) ? (
                    <ChevronDown size={16} className="flex-shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="flex-shrink-0" />
                  )}
                  <Folder size={16} className="flex-shrink-0 text-amber-500" />
                  <span className="truncate">{node.name}</span>
                </button>
                {expandedFolders.has(node.path) && node.children && (
                  <div>{renderTree(node.children, depth + 1)}</div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openFile(node.path)}
                className={`w-full flex items-center gap-2 px-2 py-1 transition text-sm text-left truncate ${
                  activeFile === node.path
                    ? 'bg-vs-accent text-vs-bg'
                    : 'text-vs-text hover:bg-vs-panel'
                }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                <File size={16} className="flex-shrink-0" />
                <span className="truncate">{node.name}</span>
              </button>
            )}
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
          Explorer
        </h2>
        {renderTree(tree)}
      </div>
    </div>
  )
}

function buildTree(files: { path: string; content: string }[]): TreeNode[] {
  const root: TreeNode[] = []
  const map = new Map<string, TreeNode>()

  for (const file of files) {
    const parts = file.path.split('/')
    let current = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLast = i === parts.length - 1
      current = current ? `${current}/${part}` : part

      if (!map.has(current)) {
        const node: TreeNode = {
          type: isLast ? 'file' : 'folder',
          name: part,
          path: current,
          children: isLast ? undefined : [],
        }
        map.set(current, node)

        // Add to parent
        if (i === 0) {
          root.push(node)
        } else {
          const parentPath = current.split('/').slice(0, -1).join('/')
          const parent = map.get(parentPath)
          if (parent?.children) {
            parent.children.push(node)
          }
        }
      }
    }
  }

  return root
}
