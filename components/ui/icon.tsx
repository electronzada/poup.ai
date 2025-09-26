import { 
  Utensils, 
  Car, 
  Home, 
  Heart, 
  Book, 
  Gamepad2, 
  ArrowLeftRight, 
  DollarSign, 
  TrendingUp,
  Laptop,
  Briefcase,
  type LucideIcon 
} from 'lucide-react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

// Mapeamento de nomes para componentes do Lucide
const iconMap: Record<string, LucideIcon> = {
  'utensils': Utensils,
  'car': Car,
  'home': Home,
  'heart': Heart,
  'book': Book,
  'gamepad2': Gamepad2,
  'arrow-left-right': ArrowLeftRight,
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'laptop': Laptop,
  'briefcase': Briefcase,
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  const LucideIconComponent = iconMap[name]

  if (!LucideIconComponent) {
    console.warn(`Icon with name "${name}" not found in Lucide.`)
    return <DollarSign className={className} {...props} /> // Fallback icon
  }

  return <LucideIconComponent className={className} {...props} />
}
