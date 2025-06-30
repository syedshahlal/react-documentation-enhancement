export interface DocSection {
  title: string
  description?: string
  href?: string
  icon: string
  type: "file" | "folder"
  color?: string
  items?: DocSection[]
}

export interface DocsSectionMeta {
  title: string
  description: string
  color: string
  iconMapping: Record<string, string>
}
