"use client"
import { useState } from "react"

interface DocVersionDiffProps {
  docId: string
  currentVersion: string
  versions: string[]
  currentContent: string
}

export default function DocVersionDiff({ docId, currentVersion, versions, currentContent }: DocVersionDiffProps) {
  const [compareVersion, setCompareVersion] = useState(versions.find(v => v !== currentVersion) || "")
  const [diff, setDiff] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    setLoading(true)
    setError(null)
    setDiff(null)
    try {
      const res = await fetch(`/api/doc-content?docId=${encodeURIComponent(docId)}&version=${encodeURIComponent(compareVersion)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unknown error")
      if (!data.content) {
        setDiff("No file found in selected version.")
        return
      }
      const diffResult = diffText(currentContent, data.content)
      setDiff(diffResult.trim() ? diffResult : "No differences found.")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-4">
      <div className="flex gap-2 items-center">
        <select value={compareVersion} onChange={e => setCompareVersion(e.target.value)} className="p-2 border rounded">
          {versions.filter(v => v !== currentVersion).map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <button onClick={handleCompare} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading || !compareVersion}>
          {loading ? "Comparing..." : "Compare"}
        </button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {diff && <pre className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs overflow-x-auto">{diff}</pre>}
    </div>
  )
}

// Simple line-by-line diff (additions prefixed with +, deletions with -)
function diffText(a: string, b: string) {
  const aLines = a.split("\n")
  const bLines = b.split("\n")
  let out = ""
  let i = 0, j = 0
  while (i < aLines.length || j < bLines.length) {
    if (aLines[i] === bLines[j]) {
      out += `  ${aLines[i] || ""}\n`
      i++; j++
    } else if (aLines[i] && !bLines.includes(aLines[i])) {
      out += `- ${aLines[i]}\n`
      i++
    } else if (bLines[j] && !aLines.includes(bLines[j])) {
      out += `+ ${bLines[j]}\n`
      j++
    } else {
      out += `- ${aLines[i] || ""}\n+ ${bLines[j] || ""}\n`
      i++; j++
    }
  }
  return out
}
