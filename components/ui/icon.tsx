import { LucideIcon, icons } from 'lucide-react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  const LucideIconComponent = icons[name as keyof typeof icons]

  if (!LucideIconComponent) {
    console.warn(`Icon with name "${name}" not found in Lucide.`)
    return null // Or a fallback icon
  }

  return <LucideIconComponent className={className} {...props} />
}
