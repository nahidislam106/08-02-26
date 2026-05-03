// file: lib/store.ts
import { create } from 'zustand'

export interface FileEntry {
  path: string
  content: string
  language?: string
}

export interface OpenFile extends FileEntry {
  unsavedChanges?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface IDEStore {
  // Files
  files: FileEntry[]
  setFiles: (files: FileEntry[]) => void
  updateFile: (path: string, content: string) => void
  addFile: (path: string, content: string) => void
  deleteFile: (path: string) => void

  // Open files
  openFiles: OpenFile[]
  activeFile: string | null
  openFile: (path: string) => void
  closeFile: (path: string) => void
  setActiveFile: (path: string) => void
  updateOpenFileContent: (path: string, content: string, unsaved?: boolean) => void

  // Terminal
  terminalOutput: string[]
  addTerminalOutput: (line: string) => void
  clearTerminal: () => void

  // Chat
  chatHistory: ChatMessage[]
  addChatMessage: (role: 'user' | 'assistant', content: string) => void
  clearChat: () => void
}

export const useIDEStore = create<IDEStore>((set) => ({
  // Files
  files: [],
  setFiles: (files) => set({ files }),
  updateFile: (path, content) =>
    set((state) => ({
      files: state.files.map((f) => (f.path === path ? { ...f, content } : f)),
    })),
  addFile: (path, content) =>
    set((state) => ({
      files: [...state.files.filter((f) => f.path !== path), { path, content }],
    })),
  deleteFile: (path) =>
    set((state) => ({
      files: state.files.filter((f) => f.path !== path),
      openFiles: state.openFiles.filter((f) => f.path !== path),
      activeFile:
        state.activeFile === path
          ? state.openFiles.find((f) => f.path !== path)?.path ?? null
          : state.activeFile,
    })),

  // Open files
  openFiles: [],
  activeFile: null,
  openFile: (path) =>
    set((state) => {
      const file = state.files.find((f) => f.path === path)
      if (!file) return state
      const alreadyOpen = state.openFiles.find((f) => f.path === path)
      return {
        openFiles: alreadyOpen ? state.openFiles : [...state.openFiles, file],
        activeFile: path,
      }
    }),
  closeFile: (path) =>
    set((state) => {
      const remaining = state.openFiles.filter((f) => f.path !== path)
      return {
        openFiles: remaining,
        activeFile:
          state.activeFile === path ? remaining[remaining.length - 1]?.path ?? null : state.activeFile,
      }
    }),
  setActiveFile: (path) => set({ activeFile: path }),
  updateOpenFileContent: (path, content, unsaved) =>
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f.path === path ? { ...f, content, unsavedChanges: unsaved } : f
      ),
      files: state.files.map((f) => (f.path === path ? { ...f, content } : f)),
    })),

  // Terminal
  terminalOutput: [],
  addTerminalOutput: (line) =>
    set((state) => ({
      terminalOutput: [...state.terminalOutput, line],
    })),
  clearTerminal: () => set({ terminalOutput: [] }),

  // Chat
  chatHistory: [],
  addChatMessage: (role, content) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, { role, content }],
    })),
  clearChat: () => set({ chatHistory: [] }),
}))
