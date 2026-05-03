# CodeAI - VS Code-Style Web IDE

A full-featured VS Code-style web IDE powered by Claude Sonnet AI via Puter.js. Write, edit, and generate code with real-time AI assistance.

## 🚀 Features

- **Monaco Editor** - Full-featured code editor with syntax highlighting
- **Three-panel layout** - Sidebar (files), Editor (code), Chat (AI assistance)
- **Terminal simulation** - Run basic commands (ls, echo, clear, etc.)
- **Claude Sonnet AI** - Free AI access via Puter.js, no API key needed
- **File auto-update** - AI can generate code blocks that auto-save to files
- **Streaming responses** - Real-time token-by-token AI responses
- **VS Code dark theme** - Native VS Code color palette (#1e1e1e, #569cd6, etc.)
- **TypeScript + Tailwind** - Modern, type-safe, and fully styled

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone or download this project
cd codeai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

### 1. **Edit Files**
- Click any file in the left sidebar to open it in the editor
- Edit code with full syntax highlighting and auto-formatting
- Multiple tabs show all open files
- The dot (●) indicates unsaved changes

### 2. **Chat with Claude**
- Type a question or request in the **AI Chat** panel (right side)
- Press Enter to send (Shift+Enter for new line)
- Claude responds with code, explanations, or guidance

### 3. **Auto-Generated Code**
- When Claude generates code with `// file: <path>` headers, the IDE automatically updates that file
- You'll see a toast notification: "Updated <path>"
- Check the terminal for confirmation

### 4. **Terminal**
- Simulate basic shell commands
- Supported: `ls`, `echo <text>`, `clear`, `pwd`, `help`, `whoami`
- Other commands show "command not found"

## 🏗️ Architecture

### File Structure
```
codeai/
├── app/
│   ├── layout.tsx          # Root layout, loads Puter.js
│   ├── page.tsx            # Home page, renders IDE
│   └── globals.css         # Tailwind styles, Monaco overrides
├── components/
│   ├── IDE.tsx             # Main layout orchestrator
│   ├── Sidebar.tsx         # File tree navigation
│   ├── EditorPanel.tsx     # Monaco Editor + tabs
│   ├── Terminal.tsx        # Terminal simulator
│   └── AIChat.tsx          # Claude AI chat interface
├── lib/
│   ├── store.ts            # Zustand state management
│   ├── puter.d.ts          # TypeScript declarations
│   ├── system-prompt.ts    # Claude system prompt
│   ├── defaultFiles.ts     # Sample starter files
│   └── utils.ts            # Helper functions
└── package.json
```

### State Management (Zustand)

The `lib/store.ts` manages:
- **files**: All project files (path + content)
- **openFiles**: Currently open file tabs
- **activeFile**: Currently active editor tab
- **terminalOutput**: Terminal command history
- **chatHistory**: Chat message thread

### AI Integration

1. User sends message via AIChat
2. Message + system prompt sent to `window.puter.ai.chat()`
3. Response streamed token-by-token
4. Code blocks extracted and auto-saved
5. Toast notifications show updated files

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts` to modify the VS Code palette:
```ts
colors: {
  'vs-bg': '#1e1e1e',      // Main background
  'vs-sidebar': '#252526',  // Sidebar background
  'vs-panel': '#2d2d30',    // Panel background
  'vs-text': '#d4d4d4',     // Text color
  'vs-accent': '#569cd6',   // Accent (blue)
}
```

### Modify Default Files
Edit `lib/defaultFiles.ts` to change the starter project structure.

### Customize System Prompt
Edit `lib/system-prompt.ts` to change how Claude behaves.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Build Locally
```bash
npm run build
npm run start
```

## 🔧 Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Monaco Editor** - VS Code's editor component
- **Zustand** - Lightweight state management
- **Puter.js** - Free Claude Sonnet access (no API needed)
- **Lucide React** - Beautiful icons

## 📝 Notes

- **Puter.js Authentication**: First-time users will see a login popup. Create a free Puter account to get started.
- **No Backend Required**: Everything runs client-side in the browser.
- **Terminal is Simulated**: Not a real shell, but shows file operations and user feedback.
- **Free Claude Access**: Powered by Puter.js (free tier available).

## 🐛 Troubleshooting

**Puter.js not loading?**
- Check browser console for error messages
- Ensure you're connected to the internet
- Try refreshing the page

**Files not auto-updating?**
- Make sure Claude's response includes `// file: <path>` headers
- Check the terminal panel for confirmation messages

**Monaco Editor not rendering?**
- This uses a dynamic import; may take a moment to load
- Check browser console for React errors

## 📄 License

MIT - Feel free to use and modify for your projects!

---

**Built with ❤️ for developers everywhere**
