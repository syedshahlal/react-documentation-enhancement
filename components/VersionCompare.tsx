"use client"
import { useState } from "react"

interface VersionCompareProps {
  versions: string[]
}

export default function VersionCompare({ versions }: VersionCompareProps) {
  const [v1, setV1] = useState(versions[0] || "")
  const [v2, setV2] = useState(versions[1] || "")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompare = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/compare-versions?v1=${encodeURIComponent(v1)}&v2=${encodeURIComponent(v2)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Unknown error")
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-8 p-6 border rounded-xl bg-white dark:bg-slate-900">
      <h2 className="text-xl font-bold mb-4">Compare Documentation Versions</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select value={v1} onChange={e => setV1(e.target.value)} className="p-2 border rounded">
          {versions.map(ver => <option key={ver} value={ver}>{ver}</option>)}
        </select>
        <span className="self-center">vs</span>
        <select value={v2} onChange={e => setV2(e.target.value)} className="p-2 border rounded">
          {versions.map(ver => <option key={ver} value={ver}>{ver}</option>)}
        </select>
        <button onClick={handleCompare} className="ml-0 md:ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading || v1 === v2}>
          {loading ? "Comparing..." : "Compare"}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {result && (
        <div className="mt-4">
          <div className="mb-2"><b>Added:</b> {result.added.length ? result.added.join(", ") : "None"}</div>
          <div className="mb-2"><b>Removed:</b> {result.removed.length ? result.removed.join(", ") : "None"}</div>
          <div className="mb-2"><b>Unchanged:</b> {result.unchanged.length ? result.unchanged.join(", ") : "None"}</div>
        </div>
      )}
    </div>
  )
}
