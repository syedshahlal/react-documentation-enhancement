import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Banner } from "@/components/banner"
import { Header } from "@/components/header"
import HomeClient from "@/components/HomeClient"
import { getVersions } from "@/lib/getVersions"
import { getHomepageSections } from "@/lib/getHomepageSections"
import { getSeeAlsoLinks } from "@/lib/getSeeAlsoLinks"

interface HomepageSection {
  title: string
  description: string
  icon: string
  href: string
  color: string
}

interface SeeAlsoLink {
  title: string
  href: string
}

export default async function HomePage() {
  const versions = await getVersions()
  const latestVersion = versions[0] || ""
  const documentationSections = await getHomepageSections(latestVersion)
  const seeAlsoLinks = await getSeeAlsoLinks(latestVersion)

  return (
    <HomeClient
      initialSections={documentationSections}
      initialSeeAlso={seeAlsoLinks}
      versions={versions}
      initialVersion={latestVersion}
    />
  )
}
