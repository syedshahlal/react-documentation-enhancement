"use client"

import { useState } from "react"
import { ChevronRight, BookOpen, Clock, Users, Star, ArrowRight } from "lucide-react"

const guideLinks = [
  { title: "Installation", href: "#", time: "5 min", difficulty: "Beginner", icon: "🚀" },
  { title: "Platform Structure and Layout", href: "#", time: "10 min", difficulty: "Beginner", icon: "🏗️" },
  {
    title: "Navigation depth and collapsing sidebars",
    href: "#",
    time: "8 min",
    difficulty: "Intermediate",
    icon: "🧭",
  },
  { title: "Page Table of Contents", href: "#", time: "6 min", difficulty: "Beginner", icon: "📑" },
  { title: "Configuration Options", href: "#", time: "15 min", difficulty: "Intermediate", icon: "⚙️" },
  { title: "Customization Guide", href: "#", time: "20 min", difficulty: "Advanced", icon: "🎨" },
  { title: "API Integration", href: "#", time: "25 min", difficulty: "Advanced", icon: "🔌" },
  { title: "Deployment", href: "#", time: "12 min", difficulty: "Intermediate", icon: "🚀" },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
    case "Intermediate":
      return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
    case "Advanced":
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
  }
}

export function UserGuideSection() {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  User Guide
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive documentation to help you get started and master the platform
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: BookOpen, label: "Guides", value: "8+" },
              { icon: Clock, label: "Total Time", value: "~2h" },
              { icon: Users, label: "Skill Levels", value: "All" },
              { icon: Star, label: "Rating", value: "4.9/5" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="text-center p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Guide Links */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>Getting Started</span>
                <div className="flex-1 h-px bg-border"></div>
              </h3>

              <div className="space-y-3">
                {guideLinks.map((link, index) => (
                  <div
                    key={index}
                    className={`group relative p-4 border border-border rounded-lg transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 ${
                      hoveredLink === index ? "bg-primary/5" : "bg-background hover:bg-muted/50"
                    }`}
                    onMouseEnter={() => setHoveredLink(index)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-2xl">{link.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {link.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(link.difficulty)}`}
                            >
                              {link.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {link.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500 ease-out"
                        style={{ width: hoveredLink === index ? "100%" : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Start */}
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-xl p-6">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <span>⚡</span>
                Quick Start
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get up and running in under 5 minutes with our streamlined setup process.
              </p>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Start Now
              </button>
            </div>

            {/* Community */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Community
              </h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <span className="text-sm">Mattermost</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <span className="text-sm">GitHub Discussions</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                >
                  <span className="text-sm">Stack Overflow</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Latest Updates */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Latest Updates
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">v2.1.0 Released</div>
                    <div className="text-muted-foreground">New theme system and improved performance</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">API Documentation</div>
                    <div className="text-muted-foreground">Complete API reference now available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserGuideSection
