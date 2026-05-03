// file: lib/utils.ts
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

export function extractCodeBlocks(
  text: string
): Array<{ path: string; content: string }> {
  const regexp = /\/\/\s*file:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*file:|$)/g
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
