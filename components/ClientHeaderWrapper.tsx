"use client"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Header } from "@/components/header"

export default function ClientHeaderWrapper({ selectedVersion, versions, slug }: { selectedVersion: string, versions: string[], slug: string[] }) {
  const router = useRouter()
  const handleVersionChange = useCallback((newVersion: string) => {
    const newSlug = [newVersion, ...slug.slice(1)]
    router.push(`/docs/${newSlug.join("/")}`)
  }, [router, slug])
  return (
    <Header
      selectedVersion={selectedVersion}
      versions={versions}
      setSelectedVersion={handleVersionChange}
    />
  )
}
