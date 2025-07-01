"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, ArrowRight, BookOpen, Code, ExternalLink, GitBranch, Layers, Search, Server, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Feature = {
  icon: React.ElementType
  title: string
  description: string
  color: string
  gradient: string
  details: string[]
  sectionId: string
  href: string
}

// Static feature card data (replace with your actual sections as needed)
const features: Feature[] = [
  {
    icon: BookOpen,
    title: "GRA Core Platform Introduction",
    description: "Get started with GRA Core Platform fundamentals and core concepts.",
    color: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-600/60 to-blue-400/60",
    details: ["Overview", "Key Concepts", "Platform Benefits"],
    sectionId: "platform-introduction",
    href: "/platform-introduction",
  },
  {
    icon: Users,
    title: "User Guide",
    description: "Complete guide to using GRA Core Platform with step-by-step instructions.",
    color: "text-green-600 dark:text-green-400",
    gradient: "from-green-600/60 to-green-400/60",
    details: ["Getting Started", "User Management", "Permissions"],
    sectionId: "user-guide",
    href: "/user-guide",
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Comprehensive API documentation with examples and authentication guides.",
    color: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-600/60 to-purple-400/60",
    details: ["REST API", "Authentication", "Examples"],
    sectionId: "api-reference",
    href: "/api-reference",
  },
  {
    icon: Layers,
    title: "Examples & Tutorials",
    description: "Real-world examples and step-by-step tutorials for common use cases.",
    color: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-600/60 to-orange-400/60",
    details: ["Basic Setup", "Data Management", "User Authentication"],
    sectionId: "examples-tutorials",
    href: "/examples-tutorials",
  },
  {
    icon: GitBranch,
    title: "Development Guide",
    description: "Development workflows, contribution guidelines, and advanced topics.",
    color: "text-teal-600 dark:text-teal-400",
    gradient: "from-teal-600/60 to-teal-400/60",
    details: ["Workflows", "Contribution", "Advanced Topics"],
    sectionId: "development-guide",
    href: "/development-guide",
  },
  {
    icon: Search,
    title: "GCP Feature In-Depth",
    description: "Deep dive into GRA Core Platform architecture and infrastructure.",
    color: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-600/60 to-indigo-400/60",
    details: ["Architecture", "Infrastructure", "Scaling"],
    sectionId: "gcp-feature-in-depth",
    href: "/gcp-feature-in-depth",
  },
]

export function FeatureCards({ selectedVersion }: { selectedVersion: string }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Helper to build the correct href for each card based on version
  function getVersionedHref(sectionId: string): string {
    switch (sectionId) {
      case "platform-introduction":
        return `/docs/${selectedVersion}/${toSlug("01_GRA_Core_Platform Introduction")}/${toSlug("01_introduction")}`
      case "user-guide":
        return `/docs/${selectedVersion}/${toSlug("02_User Guide")}/${toSlug("user-guide")}`
      case "api-reference":
        return `/docs/${selectedVersion}/${toSlug("03_API Reference")}/${toSlug("api-reference")}`
      case "examples-tutorials":
        return `/docs/${selectedVersion}/${toSlug("04_Examples & Tutorials")}/${toSlug("basic-setup")}`
      case "development-guide":
        return `/docs/${selectedVersion}/${toSlug("05_Development Guide")}/${toSlug("advanced-monitoring")}`
      case "platform-architecture":
        return `/docs/${selectedVersion}/${toSlug("06_GCP Feature InDepth")}/`
      default:
        return "#"
    }
  }

  function toSlug(str: string) {
    return str.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map(({ icon: Icon, title, description, color, gradient, details, sectionId }, index) => {
            const href = getVersionedHref(sectionId)
            return (
              <Link
                href={href}
                key={title}
                className="group block focus:outline-none focus:ring-2 focus:ring-primary rounded-xl cursor-pointer"
              >
                <Card
                  tabIndex={-1}
                  className={`relative border border-border bg-card transition-all duration-500 overflow-hidden h-full
                    hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 cursor-pointer
                    ${hoveredCard === index ? "scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px] rounded-xl">
                    <div className="w-full h-full bg-card rounded-xl" />
                  </div>

                  {/* Shimmer Effect */}
                  <div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:translate-x-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      animation: hoveredCard === index ? "shimmer 1.5s ease-in-out" : "none",
                    }}
                  />

                  {/* Header */}
                  <CardHeader className="relative z-10 pb-4">
                    <CardTitle className="flex items-center justify-between text-xl group-hover:text-primary transition-colors">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <Icon className={`h-7 w-7 ${color}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold">{title}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </CardTitle>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="relative z-10 pt-0">
                    <p className="leading-relaxed text-muted-foreground mb-6 group-hover:text-foreground transition-colors">
                      {description}
                    </p>

                    {/* Feature Details */}
                    <div
                      className={`space-y-3 transition-all duration-500 ${
                        hoveredCard === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="border-t border-border pt-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Key Topics:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {details.map((detail, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient.replace("/20", "")}`} />
                              <span className="group-hover:text-foreground transition-colors">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div
                      className={`mt-6 transition-all duration-500 ${
                        hoveredCard === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                          View Documentation
                          <ExternalLink className="w-3 h-3" />
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                          <div
                            className="w-1 h-1 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="w-1 h-1 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Progress Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-xl overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient.replace("/20", "")} transition-all duration-700 ease-out`}
                      style={{ width: hoveredCard === index ? "100%" : "0%" }}
                    />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full border border-primary/20">
            <span className="text-sm font-medium text-foreground">Need help getting started?</span>
            <button
              onClick={(e) => {
                e.preventDefault()
                window.location.href = "/getting-started"
              }}
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Quick Start Guide <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe Animation for Shimmer Effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  )
}

export default FeatureCards
