"use client"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
